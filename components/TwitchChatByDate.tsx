"use client";

import { useEffect, useState, useRef } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

function segmentMessageBasedOnWidth(
    message,
    containerWidth,
    fontStyle = "14px monospace"
) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = fontStyle;

    const words = message.split(" ");
    let currentLine = "";
    let lines = [];

    for (let word of words) {
        let testLine = currentLine + word + " ";
        let testLineWidth = ctx.measureText(testLine).width;

        if (testLineWidth > containerWidth && currentLine !== "") {
            lines.push(currentLine);
            currentLine = word + " ";
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine !== "") {
        lines.push(currentLine);
    }

    return lines;
}

const Message = ({ message, containerWidth }) => {
    const segments = segmentMessageBasedOnWidth(
        message,
        containerWidth,
        "14px monospace"
    );

    return (
        <div className="flex-grow flex flex-col">
            {segments.map((seg, index) => (
                <div className="flex whitespace-nowrap" key={index}>
                    <span className="text-white">|</span>
                    <span className="text-white ml-2">{seg}</span>
                </div>
            ))}
        </div>
    );
};

const ChatComponent = ({ year, month, day, hour }) => {
    const [chats, setChats] = useState([]);
    const chatListRef = useRef(null);

    useEffect(() => {
        // const chatPath = "/chats/sodapoppin/2023/09/02/05"; // TODO: get from URL
        const chatPath = `/chats/sodapoppin/${year}/${month}/${day}/${hour}`;
        console.log(chatPath);

        const chatRef = doc(firestore, chatPath);

        const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
            let chatData = docSnapshot.data().chats || [];
            chatData.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
            setChats(chatData);
        });
        return () => unsubscribe();
    }, []);

    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        }

        handleResize(); // initialize on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [containerRef]);


    const timestampWidth = 60;
    const usernameWidth = 100;
    const margins = 24;
    const buttonWidth = 80;

    const messageWidth =
        width - timestampWidth - usernameWidth - margins - buttonWidth;

        return (
            <div
            className="bg-black p-4 h- min-h-screen font-mono text-xs overflow-x-hidden overflow-anchor-enabled"
                ref={containerRef}
            >
                <div className="border-b border-gray-700 mb-4">
                    <h2 className="text-white text-base">y/m/d: {year}/{month}/{day}; hour: {hour}</h2>
                </div>
    
                <ul
                    className="flex flex-col-reverse overflow-y-auto w-full h-[80vh] mb-4"
                    ref={chatListRef}
                >
                    {[...chats].map((chat, index) => (
                        <li
                            key={index}
                            className={`py-0 border-b border-gray-700 flex items-start ${
                                chat.is_toxic ? "bg-red-600" : ""
                            }`}
                        >
                            <span className="text-green-400 font-bold inline-block w-20 mr-4 flex-none">
                                {new Date(chat.timestamp).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour12: false,
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    }
                                )}
                            </span>
                            <span className="inline-block w-32 text-right font-bold text-green-400 mr-4 flex-none">
                                {chat.username || ""}
                            </span>
                            <div className="flex-grow overflow-x-hidden">
                                <Message
                                    message={chat.chat_message}
                                    containerWidth={messageWidth}
                                />
                            </div>
                            <button
                                className="ml-4 text-white px-2 flex-none"
                                onClick={() =>
                                    handleLabelToxicity(
                                        chat.chat_id,
                                        !chat.is_toxic,
                                        chat.timestamp
                                    )
                                }
                            >
                                {chat.is_toxic ? "Toxic" : "Not Toxic"}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
};

export default ChatComponent;
