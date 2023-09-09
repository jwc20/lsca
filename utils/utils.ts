import { firestore } from "../firebase/firebase";
import { onSnapshot, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { DateTime } from 'luxon';


export async function updateChatToxicity(channelName, chatId, isToxic, timestamp) {
    // const today = new Date();
    // const year = today.getFullYear();
    // const month = ("0" + (today.getMonth() + 1)).slice(-2); // note: this is a string
    // const day = ("0" + today.getDate()).slice(-2);
    // const hours = today.getHours();
    // console.log(year, month, day, hours)
    // console.log(timestamp)
    // convert timestamp to my timezone, for example 2023-09-09T01:13:21.212807 to 2023-09-09T15:13:21.212807


    // const myTimestamp = new Date(timestamp);

    // let myTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(myTimeZone)

    // const options = {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric',
    //     hour: '2-digit',
    //     timeZone: myTimeZone,
    // };

    // // set year, month, day, hours, minutes 
    // const myDate = myTimestamp.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit' });
    // console.log(myDate)

    // const formatter = new Intl.DateTimeFormat('sv-SE', options)
    // const startingDate = new Date("2012/04/10 10:10:30 +0000")

    // const dateInNewTimezone = formatter.format(startingDate) 


    // const year = myDate.slice(0, 4);
    // const month = myDate.slice(5, 7);
    // const day = myDate.slice(8, 10);
    // const hours = myDate.slice(11, 13);
    // console.log(year, month, day, hours)



    const dt = DateTime.fromISO(timestamp);
    console.log(dt.toString()); 
    const year = dt.year;
    const month = ("0" + dt.month).slice(-2);
    const day = ("0" + dt.day).slice(-2);
    const hours = ("0" + dt.hour).slice(-2);

    console.log(year, month, day, hours)

    const channelName1 = "pressed___";

    const hourDocPath = `/chats/${channelName1}/${year}/${month}/${day}/${hours}`; 
    // /chats/pressed___/2023/09/09/15

    try {
        const hourDocRef = doc(firestore, hourDocPath);
        console.log(hourDocPath, hourDocRef)

        const hourDocSnapshot = await getDoc(hourDocRef);

        if (hourDocSnapshot.exists()) {
            const chatsArray = hourDocSnapshot.data().chats || []; 
            console.log(chatsArray)

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
