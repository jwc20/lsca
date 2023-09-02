'use client'



import { useEffect, useState } from 'react';
import { collection, getDocs, query, onSnapshot, orderBy, doc,getDoc , } from "firebase/firestore";
import { firestore } from '../firebase/firebase';

const ChatComponent = () => {
    const [chats, setChats] = useState([]);

    // useEffect(() => {
    //     const fetchChats = async () => {
    //         const chatPath = '/chats/sodapoppin/2023/09/02/00';
    //         const messagesCollectionRef = collection(firestore, chatPath, 'chats');  // Accessing the sub-collection
    
    //         // Create a query against the collection
    //         const q = query(messagesCollectionRef, orderBy("timestamp"));
    
    //         const querySnapshot = await getDocs(q);
    //         let chatData = [];
    //         querySnapshot.forEach((doc) => {
    //             chatData.push(doc.data());
    //         });
    
    //         setChats(chatData);
    //     };
    
    //     fetchChats();
    // }, []);

    useEffect(() => {

        const chatPath = '/chats/sodapoppin/2023/09/02/03';
        const chatRef = doc(firestore, chatPath);

        const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
            let chatData = docSnapshot.data().chats || [];  // Assuming the array field is named 'chats'
    
            // If you still want to sort them by timestamp:
            chatData.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    
            setChats(chatData);
        });
        return () => unsubscribe();
        


        // if (docSnapshot.exists()) {
        //     let chatData = docSnapshot.data().chats || [];  // Assuming the array field is named 'chats'

        //     // Sort the chats array by timestamp
        //     chatData.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

        //     setChats(chatData);
        // }
    
    
        // fetchChats();
    }, []);
    

    return (
        <div className="bg-gray-800 p-6 rounded-lg max-w-3xl mx-auto mt-12">
            <h2 className="text-white text-center mb-4">Chats</h2>
            <ul className="divide-y divide-gray-600">
                {chats.map((chat, index) => (
                    <li key={index} className={`py-2 px-3 ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}>
                        {/* <strong className="text-green-400">{chat.username}:</strong> */}
                        <strong className="text-green-400">{chat.username ? chat.username + ':' : ''}</strong>
                        {/* {chat.username && <span className="text-white ml-2">{chat.username}:</span>} */}
                        <span className="text-white ml-2">{chat.chat_message}</span>
                        <span className="text-gray-400 text-sm ml-4">{new Date(chat.timestamp).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
    
    
}

export default ChatComponent;
