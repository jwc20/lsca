import os
import re
import asyncio
import aiohttp
import websockets
from datetime import datetime
from collections import deque
from dotenv import load_dotenv


load_dotenv()

CLIENT_ID = os.environ.get("TWITCH_CLIENT_ID")
CLIENT_SECRET = os.environ.get("TWITCH_CLIENT_SECRET")
CHANNEL_NAME = os.environ.get("TWITCH_CHANNEL_NAME")

print(CLIENT_ID, CLIENT_SECRET, CHANNEL_NAME)

MAX_MESSAGES = 100
messages_queue = deque(maxlen=MAX_MESSAGES)


async def get_oauth_token(client_id, client_secret):
    url = f"https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials"
    async with aiohttp.ClientSession() as session:
        async with session.post(url) as response:
            data = await response.json()
            print(data)
            return data["access_token"]


async def receive_chat_messages(channel_name):
    token = await get_oauth_token(CLIENT_ID, CLIENT_SECRET)
    websocket_url = f"wss://irc-ws.chat.twitch.tv:443"

    # Keep reconnecting and receiving messages
    while True:
        try:
            async with websockets.connect(websocket_url) as websocket:
                await websocket.send(f"PASS oauth:{token}")
                await websocket.send(f"NICK justinfan123")  # for read-only
                await websocket.send(f"JOIN #{channel_name}")

                counter = 0
                after_end_of_names = False

                while True:
                    message = await websocket.recv()
                    message = message.strip().replace("\n", "")

                    if not after_end_of_names:
                        match = re.search(r":End of /NAMES list", message)
                        if match:
                            after_end_of_names = True
                        continue

                    counter += 1

                    messages_queue.append(message)

                    # Extracting chat messages for console display
                    match_nick = re.search(r"@(\w+)\.tmi\.twitch\.tv", message)
                    match_chat = re.search(r"PRIVMSG #\w+ :(.*)", message)

                    current_time = datetime.now().strftime("%H:%M:%S")
                    username = match_nick.group(1) if match_nick else ""
                    chat_message = match_chat.group(1) if match_chat else ""

                    print(f"[{current_time}] <{username}> {chat_message}")

        except Exception as e:
            print(f"WebSocket Error: {e}")
            print("Reconnecting...")
            await asyncio.sleep(5)


if __name__ == "__main__":
    asyncio.run(receive_chat_messages(CHANNEL_NAME))



