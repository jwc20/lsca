'use client';

import { useEffect, useState, useRef } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

function segmentMessageBasedOnWidth(message, containerWidth, fontStyle = '14px monospace') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = fontStyle;

    const words = message.split(' ');
    let currentLine = '';
    let lines = [];

    for (let word of words) {
        let testLine = currentLine + word + ' ';
        let testLineWidth = ctx.measureText(testLine).width;

        if (testLineWidth > containerWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine !== '') {
        lines.push(currentLine);
    }

    return lines;
}

const Message = ({ message, containerWidth }) => {
    const segments = segmentMessageBasedOnWidth(message, containerWidth, '14px monospace');

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

    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        }

        handleResize(); // initialize on mount
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [containerRef]);




    return (
        <div className="bg-black p-4 h-full min-h-screen font-mono text-xs" ref={containerRef}>
            <div className="border-b border-gray-700 mb-4">
                <h2 className="text-white text-base">Arch Linux IRC</h2> {/* Resetting title size */}
            </div>
    
            <ul className="overflow-y-auto">
                {chats.slice().reverse().map((chat, index) => (
                    <li key={index} className="py-0 border-gray-700 flex items-start whitespace-nowrap">
                        <span className="text-green-400 font-bold inline-block w-20 mr-4 flex-none">
                            {new Date(chat.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="inline-block w-32 text-right font-bold text-green-400 mr-4 flex-none">
                            {chat.username || ""}
                        </span>
                        <Message message={chat.chat_message} containerWidth={width} />
                        <button
                            className="text-black px-2 py-0.5 ml-4 flex-none"
                            onClick={() => handleLabelToxicity(chat.chat_id, !chat.is_toxic, chat.timestamp)}
                        >
                            {chat.is_toxic ? "Not Toxic" : "Toxic"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );



};

export default ChatComponent;
