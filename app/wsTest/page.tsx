"use client";
import { useState, useEffect, useRef } from "react";
import { updateChatToxicity } from "../../utils/utils";

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


export default function wsTest({ channelName }) {
    const [chats, setChats] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const handleLabelToxicity = async (chatId, isToxic, timestamp) => {
        const updatedChats = chats.map((chat) => {
            // console.log(chat.chat_id, chatId, isToxic);
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
        await updateChatToxicity(channelName, chatId, isToxic, timestamp);
    };

    useEffect(() => {
        let socket: WebSocket;
        // const socket = new WebSocket('ws://localhost:8765/');
        // let socket = new WebSocket("ws://localhost:8080/");
        
        const connectWebSocket = () => {
        
            let socket = new WebSocket("ws://35.226.133.69:8080/");
            // console.log(socket);
            socket.onopen = function (event) {
                console.log("WebSocket connection opened");
                setIsConnected(true);
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

            socket.onclose = (event) => {
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
            socket.close();
        };
    }, []);

    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        }

        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [containerRef]);

    const timestampWidth = 60; 
    const usernameWidth = 100; 
    const margins = 24; 
    const buttonWidth = 80; 

    const messageWidth = width - timestampWidth - usernameWidth - margins - buttonWidth;





    
    return (
        <div className="bg-black p-4 h-full min-h-screen font-mono text-xs overflow-x-hiddenoverflow-anchor-enabled" ref={containerRef}>
            <div className="border-b border-gray-700 mb-4">
                <h2 className="text-white text-base">omfs24 chat</h2>
            </div>

            <ul className="overflow-y-hidden w-full">
                {chats.slice().reverse().map((chat, index) => (
                    <li 
                        key={index} 
                        className={`py-0 border-b border-gray-700 flex items-start ${chat.is_toxic ? 'bg-red-600' : ''}`}
                    >
                        <span className="text-green-400 font-bold inline-block w-20 mr-4 flex-none">
                            {new Date(chat.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="inline-block w-32 text-right font-bold text-green-400 mr-4 flex-none">
                            {chat.username || ""}
                        </span>
                        <div className="flex-grow overflow-x-hidden">
                            <Message message={chat.chat_message} containerWidth={messageWidth} />
                        </div>
                        <button
                            className="ml-4 text-white px-2 py-0.5 w-24 flex-none"
                            onClick={() => handleLabelToxicity(chat.chat_id, !chat.is_toxic, chat.timestamp)}
                        >
                            {chat.is_toxic ? "Not Toxic" : "Toxic"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
      
    
}
