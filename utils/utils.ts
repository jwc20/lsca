import { firestore } from "../firebase/firebase";

export async function updateChatToxicity(chatId, isToxic) {

    // get current date and time
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes();

    try {
        const chatRef = firestore.collection("chats").doc(chatId);
        await chatRef.update({
            is_toxic: isToxic,
        });
        console.log("Chat updated successfully");
    } catch (error) {
        console.error("Error updating chat:", error);
    }
}
