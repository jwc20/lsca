import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBXKCN7Q0q--7IMqUBOg5x7Z97LWEE2HP0",
    authDomain: "omfscene24.firebaseapp.com",
    databaseURL: "https://omfscene24-default-rtdb.firebaseio.com",
    projectId: "omfscene24",
    storageBucket: "omfscene24.appspot.com",
    messagingSenderId: "504611517445",
    appId: "1:504611517445:web:64409e1b8dadc3d301986c",
    measurementId: "G-W291ZJ7BX1",
};

// Initialize Firebase
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
