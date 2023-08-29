"use client";

import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import { collection, getDocs, query, onSnapshot, orderBy, limit, startAfter, startAt } from "firebase/firestore";

const CACHE_KEY = "twitch_chat_messages";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export default function TwitchChat({ channelName }: { channelName: string }) {
  
    const [isOldestFirst, setIsOldestFirst] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(69);
    const [lastDocument, setLastDocument] = useState(null); 

    useEffect(() => {
        const orderDirection = isOldestFirst ? "asc" : "desc";

        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);
        const currentTime = new Date().getTime();

        if (cachedData && cachedTimestamp && (currentTime - Number(cachedTimestamp) < CACHE_DURATION)) {
            setChatMessages(JSON.parse(cachedData));
            return;
        }
        
        let q = query(
            collection(firestore, "sodapoppin"),
            orderBy("timestamp", orderDirection),
            limit(itemsPerPage)
        );

        if (currentPage > 0) {
            q = query(
                collection(firestore, "sodapoppin"),
                orderBy("timestamp", orderDirection),
                startAfter(lastDocument),
                limit(itemsPerPage)
            );
        }

         const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages: any[] = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data());
            });

            // Update the state and cache the data
            setChatMessages(messages);
            localStorage.setItem(CACHE_KEY, JSON.stringify(messages));
            localStorage.setItem(`${CACHE_KEY}_timestamp`, String(currentTime));
        });

        return () => {
            unsubscribe();
        };
    }, [isOldestFirst, currentPage]); 
    

    const handleNext = () => {
        setCurrentPage(prev => prev + 1);
    }

    const handlePrev = () => {
        setCurrentPage(prev => prev - 1);
    }

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
            <div className="mt-4">
                {currentPage > 0 && <button onClick={handlePrev}>Previous</button>}
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
}
