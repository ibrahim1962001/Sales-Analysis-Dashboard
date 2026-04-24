import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    FieldValue
} from "firebase/firestore";
import { db } from "./firebase";

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number | Date;
    action?: string;
}

export interface ChatSession {
    id?: string;
    title: string;
    filename: string;
    messages: ChatMessage[];
    updatedAt?: FieldValue | Date | number;
}

const COLLECTION_NAME = "chat_sessions";

export const chatService = {
    // جلب كل الجلسات
    async getAllSessions(): Promise<ChatSession[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ChatSession, 'id'>)
        })) as ChatSession[];
    },

    // حفظ جلسة جديدة أو تحديث موجودة
    async saveSession(session: ChatSession) {
        // نستخرج المعرف (id) حتى لا يتم حفظه كحقل إضافي داخل الوثيقة أو يتسبب بخطأ undefined
        const { id, ...sessionData } = session;
        
        // إزالة أي حقول قد تكون undefined لأن Firestore لا يقبلها
        const cleanData = Object.fromEntries(
            Object.entries(sessionData).filter(([_, v]) => v !== undefined)
        );

        if (id) {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, {
                ...cleanData,
                updatedAt: serverTimestamp()
            });
            return id;
        } else {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...cleanData,
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        }
    },

    // حذف جلسة
    async deleteSession(sessionId: string) {
        await deleteDoc(doc(db, COLLECTION_NAME, sessionId));
    }
};