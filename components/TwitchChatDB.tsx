"use client";

import { use, useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";

async function getChatMessages() {
    const customers = await getDocs(collection(firestore, "zackrawrr"));
    return customers;
}

export default function TwitchChat({ channelName }: { channelName: string }) {
    const [isConnected, setIsConnected] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const q = query(
            collection(firestore, "zackrawrr"),
            orderBy("timestamp", "desc") 
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages: any[] = [];
            querySnapshot.forEach((doc: { data: () => any }) => {
                messages.unshift(doc.data()); // Add new data to the beginning of the array
            });
            
            setChatMessages(messages);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    

    return (
        <div className="max-w-2xl mx-auto p-5 border rounded shadow-md">
            <h1 className="text-center text-xl text-gray-700 border-b pb-4">Chat Messages for {channelName}</h1>
            <ul className="divide-y divide-gray-200">
                {[...chatMessages].reverse().map((message, index) => (
                    <li key={index} className="py-4">
                        <strong className="text-blue-500">{message.username}:</strong>
                        <p className="mt-2 text-lg">{message.chat_message}</p>
                        <small className="text-gray-500">{new Date(message.timestamp).toLocaleString()}</small>
                        {message.is_toxic && <span className="ml-4 inline-block px-2 py-1 bg-red-500 text-white rounded">Toxic</span>}
                    </li>
                ))}
            </ul>
        </div>
    );    
}
