import { doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Function to parse a Markdown file and distribute its data to Firestore collections
 * Relies on Level 2 Headings `##` for Collection Name
 * and Level 3 `###` for Document ID or an auto ID is generated
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

    // Helper function to add current document to Batch
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

      // Detect Collection Name (e.g., ## users_profile)
      if (line.startsWith('## ')) {
        commitCurrentDoc(); // Save previous data
        currentCollection = line.replace('##', '').trim();
        currentDocId = 'default_doc';
        currentData = {};
        currentKey = 'content';
      } 
      // Detect Document ID (e.g., ### user_123 or email)
      else if (line.startsWith('### ')) {
        commitCurrentDoc(); // Save previous data for same collection
        currentDocId = line.replace('###', '').trim();
        currentData = {};
        currentKey = 'content';
      }
      // Detect Keys and Values (e.g., - name: Ahmed or name: Ahmed)
      else if (line.includes(':')) {
        // Remove list mark if exists
        const cleanLine = line.startsWith('- ') ? line.slice(2) : line;
        const [key, ...valueParts] = cleanLine.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          currentData[key.trim()] = value;
        }
      } 
      // Plain texts
      else {
        if (!currentData[currentKey]) {
          currentData[currentKey] = line;
        } else {
          currentData[currentKey] += '\n' + line;
        }
      }
    }

    // Save last document
    commitCurrentDoc();

    if (hasOperations) {
      await batch.commit();
      console.log('✅ Markdown data distributed to Firestore successfully!');
    }
  } catch (error) {
    console.error('❌ Error distributing Markdown data:', error);
  }
};
