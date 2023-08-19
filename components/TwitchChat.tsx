"use client";

import { useEffect, useState } from "react";

export default function TwitchChat({ channelName }: { channelName: string }) {
    const [messages, setMessages] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const [afterEndOfNames, setAfterEndOfNames] = useState<boolean>(false);

    const getToken = async () => {
        const res = await fetch("scripts/getToken.js");
        const { token } = await res.json();
        setToken(token);
    };

    useEffect(() => {
        const websocket_url = "wss://irc-ws.chat.twitch.tv:443";

        let websocket: WebSocket;

        async function startWebSocketConnection() {
            websocket = new WebSocket(websocket_url);

            websocket.onopen = () => {
                setIsConnected(true);
                websocket.send(`PASS oauth:${token}`);
                websocket.send(`NICK justinfan123`);
                websocket.send(`JOIN #${channelName}`);
            };

            websocket.onmessage = (event) => {
                let message = event.data.replace("\n", "").trim();

                if (!afterEndOfNames) {
                    if (/:End of \/NAMES list/.test(message)) {
                        setAfterEndOfNames(true);
                        return;
                    }
                } else {
                    const match_nick = /@(\w+)\.tmi\.twitch\.tv/.exec(message);
                    const match_chat = /PRIVMSG #\w+ :(.*)/.exec(message);
                    const current_time = new Date().toLocaleTimeString(
                        "en-US",
                        {
                            hour12: false,
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                        }
                    );
                    const username = match_nick ? match_nick[1] : "";
                    const chat_message = match_chat ? match_chat[1] : "";
                    const formatted_message = `[${current_time}] <${username}> ${chat_message}`;

                    setMessages((prevMessages) => [
                        ...prevMessages,
                        formatted_message,
                    ]);
                }
            };

            websocket.onerror = (err: Event) => {
                setIsConnected(false);
                console.error("WebSocket Error:", err);
            };

            websocket.onclose = () => {
                setIsConnected(false);
            };
        }

        startWebSocketConnection();

        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [channelName, token, afterEndOfNames]);

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px",
            }}
        >
            <div
                style={{
                    padding: "20px",
                    maxWidth: "600px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <h1 style={{ marginBottom: "20px" }}>Twitch Chat Messages</h1>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            borderRadius: "5px",
                            padding: "10px",
                            color: "white",
                            backgroundColor: isConnected ? "green" : "red",
                        }}
                    >
                        {isConnected ? "Connected" : "Disconnected"}
                    </div>
                </div>

                <div
                    style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                        paddingTop: "10px",
                    }}
                >
                    <ul>
                        {[...messages].reverse().map((msg, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: "5px",
                                    wordBreak: "break-word",
                                    backgroundColor:
                                        index % 2 === 0
                                            ? "#333"
                                            : "transparent",
                                }}
                            >
                                {msg}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
