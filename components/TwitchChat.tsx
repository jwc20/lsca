"use client";

import { useEffect, useState } from "react";

export default function TwitchChat({ channelName }) {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    console.log("channelName", channelName);

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            ws = new WebSocket("ws://34.64.212.200:8080"); 
            console.log(ws)
            
            // Todo: use ably client to get chat messages
            // Use pub/sub to get messages from the server
            // https://www.ably.io/documentation/realtime/channels-messages
            // https://www.ably.io/documentation/realtime/channels-messages#publish-subscribe
            // use subscribe to get messages from the server

            ws.onopen = () => {
                console.log("Connected to the WebSocket");
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                setMessages((prevMessages) => [...prevMessages, event.data]);
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error", error);
            };

            ws.onclose = (event) => {
                if (event.wasClean) {
                    console.log(
                        `Closed clean, code=${event.code}, reason=${event.reason}`
                    );
                } else {
                    console.log("Connection died");
                }
                setIsConnected(false);
                setTimeout(connectWebSocket, 5000); // try to reconnect in 5 seconds
            };
        };

        connectWebSocket();

        return () => {
            ws.close();
        };
    }, []);

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
