"use client";

import { useEffect, useState } from "react";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            ws = new WebSocket("ws://localhost:5678");

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
        <div>
            <h1>Twitch Chat Messages</h1>
            <div>{isConnected ? "Connected" : "Disconnected"}</div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
