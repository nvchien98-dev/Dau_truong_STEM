import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { LogOut, Activity } from 'lucide-react';
import './index.css';

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // In a real app, we verify role again or rely on AdminLogin to handle it
      if (user) {
        setAdminUser(user);
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--dark-bg)]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="text-[var(--admin-red)] animate-pulse" size={48} />
          <p className="glow-text font-['Orbitron'] font-bold tracking-widest animate-pulse">CONNECTING TO SECURE SERVER...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!adminUser ? (
        <AdminLogin onAdminVerified={setAdminUser} />
      ) : (
        <div className="min-h-screen p-6">
          <header className="admin-panel px-6 py-4 rounded-xl mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[var(--admin-red)] animate-pulse shadow-[0_0_10px_var(--admin-red)]"></div>
              <span className="font-['Orbitron'] font-bold text-xl tracking-widest text-white">
                STEM <span className="text-[var(--admin-red)]">ADMIN</span>
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors text-sm font-bold uppercase"
            >
              <LogOut size={16} /> Ngắt Kết Nối
            </button>
          </header>

          <AdminPanel />
        </div>
      )}
    </div>
  );
}

export default App;
