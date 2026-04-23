import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  profile?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  activity?: Record<string, unknown>;
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  smartRegisterOrLogin: (email: string, password: string) => Promise<void>;
  fetchUserData: (uid: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // جلب كافة بيانات المستخدم من الكولكشنات المختلفة
  const fetchUserData = async (uid: string, email: string) => {
    try {
      const data: UserData = {};
      
      // جلب البيانات من users_profile
      const profileRef = doc(db, 'users_profile', uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        data.profile = profileSnap.data();
      } else {
        // إذا لم يكن موجوداً، يمكننا البحث بواسطة الإيميل أيضاً
        const q = query(collection(db, 'users_profile'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          data.profile = querySnapshot.docs[0].data();
        }
      }

      // جلب البيانات من users_settings
      const settingsRef = doc(db, 'users_settings', uid);
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) data.settings = settingsSnap.data();

      // جلب البيانات من users_activity
      const activityRef = doc(db, 'users_activity', uid);
      const activitySnap = await getDoc(activityRef);
      if (activitySnap.exists()) data.activity = activitySnap.data();

      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // مراقبة حالة تسجيل الدخول
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        await fetchUserData(currentUser.uid, currentUser.email);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // القاعدة الذهبية: التحقق الذكي عند التسجيل (Check-then-Login)
  const smartRegisterOrLogin = async (email: string, password: string) => {
    try {
      // 1. البحث عن Gmail في كولكشن users_profile
      const q = query(collection(db, 'users_profile'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // الإيميل موجود -> تسجيل دخول ناجح (استخدام تسجيل الدخول بدلاً من إنشاء حساب)
        await signInWithEmailAndPassword(auth, email, password);
        // البيانات سيتم جلبها تلقائياً عبر onAuthStateChanged
        return;
      }

      // 2. في حالة عدم وجوده مسبقاً، محاولة إنشاء حساب جديد
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        
        // إنشاء ملفات مبدئية في الكولكشنات
        await setDoc(doc(db, 'users_profile', newUser.uid), {
          email: newUser.email,
          createdAt: new Date().toISOString()
        });
        
        await setDoc(doc(db, 'users_settings', newUser.uid), {
          theme: 'dark',
          notifications: true
        });

      } catch (err: unknown) {
        // إذا كان الإيميل مسجلاً في Auth ولكن غير موجود في Firestore Profile
        if (err instanceof Error && (err as Error & { code?: string }).code === 'auth/email-already-in-use') {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error("Smart Auth Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, userData, loading, smartRegisterOrLogin, fetchUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
