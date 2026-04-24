import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// يجب ملء هذه البيانات من وحدة تحكم Firebase (Firebase Console)
// يفضل وضعها في ملف .env.local
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تهيئة Firestore
export const db = getFirestore(app);

export default app;