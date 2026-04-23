import { doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

/**
 * دالة لتحليل ملف Markdown وتوزيع بياناته على مجموعات Firestore
 * تعتمد على العناوين (Headings) من المستوى الثاني `##` كاسم للكولكشن
 * والمستوى الثالث `###` كمعرف للمستند (Document ID) أو يتم إنشاء معرف تلقائي
 */
export const migrateMarkdownToFirestore = async (markdownText: string) => {
  try {
    const lines = markdownText.split('\n');
    let currentCollection = '';
    let currentDocId = 'default_doc';
    let currentData: Record<string, string> = {};
    let currentKey = 'content';

    const batch = writeBatch(db);
    let hasOperations = false;

    // دالة مساعدة لإضافة المستند الحالي إلى الـ Batch
    const commitCurrentDoc = () => {
      if (currentCollection && Object.keys(currentData).length > 0) {
        const docRef = doc(db, currentCollection, currentDocId);
        batch.set(docRef, currentData, { merge: true });
        hasOperations = true;
      }
    };

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // التعرف على اسم الكولكشن (مثال: ## users_profile)
      if (line.startsWith('## ')) {
        commitCurrentDoc(); // حفظ البيانات السابقة
        currentCollection = line.replace('##', '').trim();
        currentDocId = 'default_doc';
        currentData = {};
        currentKey = 'content';
      } 
      // التعرف على اسم المستند (مثال: ### user_123 أو إيميل)
      else if (line.startsWith('### ')) {
        commitCurrentDoc(); // حفظ البيانات السابقة لنفس الكولكشن
        currentDocId = line.replace('###', '').trim();
        currentData = {};
        currentKey = 'content';
      }
      // التعرف على المفاتيح والقيم (مثال: - name: Ahmed أو name: Ahmed)
      else if (line.includes(':')) {
        // إزالة علامة القائمة إذا وجدت
        const cleanLine = line.startsWith('- ') ? line.slice(2) : line;
        const [key, ...valueParts] = cleanLine.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          currentData[key.trim()] = value;
        }
      } 
      // نصوص عادية
      else {
        if (!currentData[currentKey]) {
          currentData[currentKey] = line;
        } else {
          currentData[currentKey] += '\n' + line;
        }
      }
    }

    // حفظ آخر مستند
    commitCurrentDoc();

    if (hasOperations) {
      await batch.commit();
      console.log('✅ تم توزيع بيانات Markdown على Firestore بنجاح!');
    }
  } catch (error) {
    console.error('❌ خطأ أثناء توزيع بيانات Markdown:', error);
  }
};
