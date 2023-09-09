import { firestore } from "../firebase/firebase";
import { onSnapshot, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { DateTime } from 'luxon';


export async function updateChatToxicity(channelName, chatId, isToxic, timestamp) {
    const dt = DateTime.fromISO(timestamp);
    // console.log(dt.toString()); 
    const year = dt.year;
    const month = ("0" + dt.month).slice(-2);
    const day = ("0" + dt.day).slice(-2);
    const hours = ("0" + dt.hour).slice(-2);

    // console.log(year, month, day, hours)

    const channelName1 = "pressed___";

    const hourDocPath = `/chats/${channelName1}/${year}/${month}/${day}/${hours}`; 
    // /chats/pressed___/2023/09/09/15

    try {
        const hourDocRef = doc(firestore, hourDocPath);
        // console.log(hourDocPath, hourDocRef)

        const hourDocSnapshot = await getDoc(hourDocRef);

        if (hourDocSnapshot.exists()) {
            const chatsArray = hourDocSnapshot.data().chats || []; 
            // console.log(chatsArray)

            const updatedChatsArray = chatsArray.map(chat => {
                if (chat.chat_id === chatId) {  
                    return { ...chat, is_toxic: isToxic };
                }
                return chat;
            });

            await updateDoc(hourDocRef, {
                chats: updatedChatsArray
            });

        } else {
            console.error("The hour document doesn't exist.");
        }

    } catch (error) {
        console.error("Error updating chat:", error);
    }

}
