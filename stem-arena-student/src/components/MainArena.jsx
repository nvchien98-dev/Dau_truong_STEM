import React from 'react';
import Dashboard from './Dashboard';
import CodingArena from './CodingArena';
import Leaderboard from './Leaderboard';
import { LogOut, Radio } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function MainArena({ currentUser, userData }) {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 gap-6">
      {/* Header */}
      <header className="flex items-center justify-between cyber-panel px-6 py-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[var(--neon-green)] animate-pulse shadow-[0_0_10px_var(--neon-green)]"></div>
          <span className="font-['Orbitron'] font-bold text-xl tracking-widest text-white drop-shadow-[0_0_8px_white]">
            STEM <span className="text-[var(--neon-blue)]">ARENA</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-[var(--neon-pink)] font-bold text-sm">
            <Radio size={16} className="animate-pulse" /> SYSTEM ONLINE
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors text-sm font-bold uppercase"
          >
            <LogOut size={16} /> Ngắt Kết Nối
          </button>
        </div>
      </header>

      {/* Main Grid: 3 columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        {/* Left Column: Dashboard (3 cols) */}
        <div className="md:col-span-3 h-full">
          <Dashboard userData={userData} />
        </div>

        {/* Middle Column: Coding Arena (6 cols) */}
        <div className="md:col-span-6 h-full">
          <CodingArena />
        </div>

        {/* Right Column: Leaderboard (3 cols) */}
        <div className="md:col-span-3 h-full">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
