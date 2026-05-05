import React, { useState, useEffect } from 'react';
import { Trophy, Medal, ChevronUp } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to top 10 users ordered by neuronEnergy
    const q = query(
      collection(db, "users"),
      orderBy("neuronEnergy", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardData = [];
      snapshot.forEach((doc) => {
        leaderboardData.push({ id: doc.id, ...doc.data() });
      });
      setLeaders(leaderboardData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      // For demo purposes if db is not connected yet, use mock data
      setLeaders([
        { id: '1', name: 'Cyber Ninja', neuronEnergy: 9500, level: 10 },
        { id: '2', name: 'Code Breaker', neuronEnergy: 8200, level: 9 },
        { id: '3', name: 'Neon Glitch', neuronEnergy: 7100, level: 8 },
        { id: '4', name: 'Syntax Error', neuronEnergy: 6500, level: 7 },
        { id: '5', name: 'Byte Master', neuronEnergy: 5400, level: 6 },
      ]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRankColor = (index) => {
    switch(index) {
      case 0: return 'text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]'; // Gold
      case 1: return 'text-[#C0C0C0] drop-shadow-[0_0_10px_rgba(192,192,192,0.8)]'; // Silver
      case 2: return 'text-[#CD7F32] drop-shadow-[0_0_10px_rgba(205,127,50,0.8)]'; // Bronze
      default: return 'text-[var(--neon-blue)]';
    }
  };

  const getRankBg = (index) => {
    switch(index) {
      case 0: return 'bg-[#FFD700]/10 border border-[#FFD700]/50';
      case 1: return 'bg-[#C0C0C0]/10 border border-[#C0C0C0]/50';
      case 2: return 'bg-[#CD7F32]/10 border border-[#CD7F32]/50';
      default: return 'bg-black/40 border border-transparent hover:border-[var(--neon-blue)]/50';
    }
  };

  return (
    <div className="cyber-panel p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--panel-border)] pb-4 mb-4">
        <Trophy className="text-[var(--neon-yellow)]" size={28} />
        <h2 className="text-2xl font-bold neon-text uppercase">Bảng Xếp Hạng</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-[var(--neon-blue)] border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaders.map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${getRankBg(index)}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 text-center font-bold font-['Orbitron'] text-xl ${getRankColor(index)}`}>
                    #{index + 1}
                  </div>
                  <div className="w-10 h-10 rounded bg-black/50 overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white truncate max-w-[120px]" title={user.name}>{user.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-bold">Lvl. {user.level || Math.floor(user.neuronEnergy/1000) + 1}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-[var(--neon-blue)] font-bold font-['Orbitron']">{user.neuronEnergy}</div>
                  <div className="text-[10px] text-[var(--neon-green)] flex items-center">
                    <ChevronUp size={12} /> Năng lượng
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
