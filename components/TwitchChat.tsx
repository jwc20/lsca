"use client";

import { useEffect, useState } from "react";


// Todo - add a way to use channelName using [slug]
export default function TwitchChat({ channelName }) {
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-2xl h-[600px]">
                <h1 className="text-xl font-bold mb-4 text-gray-300 border-b border-gray-700 pb-2">
                    Twitch Chat Messages
                </h1>

                <div className="flex items-center mb-4 justify-between">
                    <div
                        className={`rounded ${
                            isConnected
                                ? "bg-green-500 text-gray-800"
                                : "bg-red-500 text-gray-800"
                        } px-2 py-1`}
                    >
                        {isConnected ? "Connected" : "Disconnected"}
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[500px] border-t border-gray-700 pt-2">
                    <ul>
                        {[...messages].reverse().map((msg, index) => (
                            <li
                                key={index}
                                className={`mb-1 text-sm text-gray-300 break-words ${
                                    index % 2 === 0 ? "bg-gray-750" : ""
                                }`}
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
