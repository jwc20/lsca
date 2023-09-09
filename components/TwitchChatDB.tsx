"use client";

import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const ChatComponent = () => {
    const [chats, setChats] = useState([]);
    useEffect(() => {
        const chatPath = "/chats/sodapoppin/2023/09/02/05"; // TODO: get from URL
        const chatRef = doc(firestore, chatPath);

        const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
            let chatData = docSnapshot.data().chats || [];
            chatData.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
            setChats(chatData);
        });
        return () => unsubscribe();
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
                        <span className="text-white ml-2">
                            ({chat.preprocessed_chat_message})
                        </span>

                        <span className="text-white ml-2">{chat.is_toxic}</span>

                        <span className="text-white ml-2">
                            {chat.vw_toxicity_score}
                        </span>

                        <span className="text-gray-400 text-sm ml-4">
                            {new Date(chat.timestamp).toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatComponent;
