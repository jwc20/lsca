"use client";

import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";

export default function TwitchChat({ channelName }: { channelName: string }) {
    const [isOldestFirst, setIsOldestFirst] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const orderDirection = isOldestFirst ? "asc" : "desc";
        const q = query(
            collection(firestore, "sodapoppin"),
            orderBy("timestamp", orderDirection)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages: any[] = [];
            querySnapshot.forEach((doc: { data: () => any }) => {
                messages.push(doc.data());
            });
            
            setChatMessages(messages);
        });

        return () => {
            unsubscribe();
        };
    }, [isOldestFirst]);  

    return (
        <div className="max-w-2xl mx-auto p-5 border rounded shadow-md">
            <h1 className="text-center text-xl text-gray-700 border-b pb-4">Chat Messages for {channelName}</h1>
            
            <button onClick={() => setIsOldestFirst(!isOldestFirst)}>
                {isOldestFirst ? 'Show Newest First' : 'Show Oldest First'}
            </button>

            <ul className="divide-y divide-gray-200">
                {chatMessages.map((message, index) => (
                    <li key={index} className="py-4">
                        <strong className="text-blue-500">{message.username}:</strong>
                        <p className="mt-2 text-lg">{message.chat_message}</p>
                        <p className="mt-2 text-lg">{message.preprocessed_chat_message}</p>
                        <small className="text-gray-500">{new Date(message.timestamp).toLocaleString()}</small>
                        {message.is_toxic && <span className="ml-4 inline-block px-2 py-1 bg-red-500 text-white rounded">Toxic</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
