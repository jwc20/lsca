import os
import re
import asyncio
import aiohttp
import websockets

from datetime import datetime
from collections import deque
from dotenv import load_dotenv

load_dotenv()

# Twitch Configurations
CLIENT_ID = os.environ.get("TWITCH_CLIENT_ID")
CLIENT_SECRET = os.environ.get("TWITCH_CLIENT_SECRET")
CHANNEL_NAME = os.environ.get("TWITCH_CHANNEL_NAME")

print(f"CLIENT_ID: {CLIENT_ID}, CLIENT_SECRET: {CLIENT_SECRET}, CHANNEL_NAME: {CHANNEL_NAME}")

MAX_MESSAGES = 100
messages_queue = deque(maxlen=MAX_MESSAGES)

# Client Set for Websockets
clients = set()
# print("This is the clients: ",clients)

async def get_oauth_token(client_id, client_secret):
    url = f"https://id.twitch.tv/oauth2/token?client_id={client_id}&client_secret={client_secret}&grant_type=client_credentials"
    async with aiohttp.ClientSession() as session:
        async with session.post(url) as response:
            data = await response.json()
            print(data)
            return data["access_token"]

# async def forward_to_clients(message):
#     # This checks if there are any clients connected. 
#     # If there are no clients connected, it just prints the message and exits the function.
#     if not clients:
#         print("No clients connected:", message)
#         return
#     await asyncio.wait([client.send(message) for client in clients])

async def forward_to_clients(message):
    for client in clients:
        try:
            await client.send(message)
        except:
            # This would catch any errors that might occur if sending fails, 
            # such as if the client has disconnected but hasn't been removed from the clients set.
            continue


async def register_client(websocket):
    clients.add(websocket)

async def unregister_client(websocket):
    clients.remove(websocket)

async def ws_handler(websocket, path):
    await register_client(websocket)
    try:
        async for message in websocket:
            # This example assumes you just echo received messages.
            # You can add more logic if needed.
            await forward_to_clients(message)
    except:
        pass
    finally:
        await unregister_client(websocket)

async def receive_chat_messages():
    token = await get_oauth_token(CLIENT_ID, CLIENT_SECRET)
    websocket_url = f"wss://irc-ws.chat.twitch.tv:443"
    while True:
        try:
            async with websockets.connect(websocket_url) as websocket:
                await websocket.send(f"PASS oauth:{token}")
                await websocket.send(f"NICK justinfan123")  # for read-only
                await websocket.send(f"JOIN #{CHANNEL_NAME}")
                after_end_of_names = False
                while True:
                    message = await websocket.recv()
                    message = message.strip().replace("\n", "")
                    if not after_end_of_names:
                        match = re.search(r":End of /NAMES list", message)
                        if match:
                            after_end_of_names = True
                        continue
                    # Extracting chat messages for forwarding
                    match_nick = re.search(r"@(\w+)\.tmi\.twitch\.tv", message)
                    match_chat = re.search(r"PRIVMSG #\w+ :(.*)", message)
                    current_time = datetime.now().strftime("%H:%M:%S")
                    username = match_nick.group(1) if match_nick else ""
                    chat_message = match_chat.group(1) if match_chat else ""
                    formatted_message = f"[{current_time}] <{username}> {chat_message}"
                    
                    print(formatted_message)
                    
                    await forward_to_clients(formatted_message)
                    
        except Exception as e:
            print(f"WebSocket Error: {e}")
            print("Reconnecting...")
            await asyncio.sleep(5)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    # Twitch Chat Receiver
    loop.create_task(receive_chat_messages())
    # Start WebSocket Server
    server = websockets.serve(ws_handler, 'localhost', 5678)
    loop.run_until_complete(server)
    loop.run_forever()
