import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './components/Login';
import MainArena from './components/MainArena';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // For demo without db initialized
            setUserData({
              name: currentUser.email?.split('@')[0] || 'Unknown Hacker',
              neuronEnergy: 0,
              badges: [],
              level: 1
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({
            name: currentUser.email?.split('@')[0] || 'Unknown Hacker',
            neuronEnergy: 0,
            badges: [],
            level: 1
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--dark-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-[var(--neon-blue)] border-r-[var(--neon-pink)] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--neon-blue)] font-['Orbitron'] font-bold tracking-widest animate-pulse">INITIATING SYSTEM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!user ? (
        <Login />
      ) : (
        <MainArena currentUser={user} userData={userData} />
      )}
    </div>
  );
}

export default App;
