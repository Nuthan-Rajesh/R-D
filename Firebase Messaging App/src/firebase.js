import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBs8JGVIvvcH-Zs1ErWzHf72baJG2Al2UE",
    authDomain: "signal-3aeeb.firebaseapp.com",
    projectId: "signal-3aeeb",
    storageBucket: "signal-3aeeb.appspot.com",
    messagingSenderId: "667035288100",
    appId: "1:667035288100:web:94254d1ab7ff074f0f4eb1",
    measurementId: "G-Q3Q22RNX9B"
};


export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
