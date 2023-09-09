"use client";

import { useState, useEffect } from "react";
import { updateChatToxicity } from "../../utils/utils";

export default function wsTest({ channelName }) {
    const [chats, setChats] = useState<string[]>([]);

    const handleLabelToxicity = async (chatId, isToxic) => {
        // Update frontend state
        console.log(isToxic);
        const updatedChats = chats.map((chat) => {
            console.log(chat.chat_id, chatId, isToxic);
            if (chat.chat_id === chatId) {
                return {
                    ...chat,
                    is_toxic: isToxic,
                };
            }
            return chat;
        });
        setChats(updatedChats);

        // Update Firestore
        await updateChatToxicity(channelName, chatId, isToxic);
    };

    useEffect(() => {
        // const socket = new WebSocket('ws://localhost:8765/');
        let socket = new WebSocket("ws://localhost:8080/");

        socket.onopen = function (event) {
            console.log("WebSocket connection opened:", event);
            //   let jsonData = JSON.stringify({test: "Hello, Secure Server!"});
            //   socket.send(jsonData);
        };

        socket.onmessage = function (event) {
            let jsonData = JSON.parse(event.data);
            // console.log(jsonData);
            setChats((prevChats) => [...prevChats, jsonData]);
        };

        socket.onerror = function (error) {
            console.error("WebSocket Error:", error);
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log("WebSocket connection closed cleanly:", event);
            } else {
                console.error("Connection died");
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="bg-gray-800 p-6 rounded-lg max-w-3xl mx-auto mt-12">
            <h2 className="text-white text-center mb-4">Chats</h2>
            <ul className="divide-y divide-gray-600">
                {chats.map((chat, index) => (
                    <li
                        key={index}
                        className={`py-2 px-3 ${
                            chat.is_toxic === true
                                ? "bg-red-600"
                                : index % 2 === 0
                                ? "bg-gray-700"
                                : "bg-gray-800"
                        }`}
                    >
                        <strong className="text-green-400">
                            {chat.username ? chat.username + ":" : ""}
                        </strong>

                        <span className="text-white ml-2">
                            {chat.chat_message}
                        </span>
                        <button
                            className="text-white ml-2 bg-blue-500 px-2 py-1 rounded"
                            onClick={() =>
                                handleLabelToxicity(
                                    chat.chat_id,
                                    !chat.is_toxic
                                )
                            }
                        >
                            {chat.is_toxic ? "Not Toxic" : "Toxic"}
                        </button>

                        <span className="text-white ml-2">{chat.chat_id}</span>

                        <span className="text-gray-400 text-sm ml-4">
                            {new Date(chat.timestamp).toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
