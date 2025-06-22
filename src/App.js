import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

function App() {
  const [status, setStatus] = useState('Connecting to Firebase...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Your new Firebase config goes here
        const firebaseConfig = {
          apiKey: process.env.REACT_APP_API_KEY,
          authDomain: process.env.REACT_APP_AUTH_DOMAIN,
          projectId: process.env.REACT_APP_PROJECT_ID,
        };

        if (!firebaseConfig.projectId) {
          throw new Error("Project ID is missing from environment variables.");
        }

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        setStatus('Firebase connected. Writing to Firestore...');

        const testDocRef = doc(db, 'testCollection', 'testDoc');
        await setDoc(testDocRef, { status: 'success', timestamp: new Date() });

        setStatus('Write successful. Reading from Firestore...');

        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists() && docSnap.data().status === 'success') {
          setStatus('SUCCESS: Firebase connection is working!');
        } else {
          throw new Error('Could not verify data write.');
        }
      } catch (error) {
        console.error("Firebase test failed:", error);
        setStatus(`ERROR: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: status.startsWith('SUCCESS') ? 'green' : 'red' }}>
      <h1>Firebase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
