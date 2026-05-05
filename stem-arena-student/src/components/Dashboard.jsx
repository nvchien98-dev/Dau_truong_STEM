import React from 'react';
import { Zap, Hexagon, Star, Shield, Cpu } from 'lucide-react';

export default function Dashboard({ userData }) {
  // Default values
  const user = userData || {
    name: 'Unknown Hacker',
    neuronEnergy: 0,
    badges: [],
    level: 1
  };

  // Calculate progress for next level
  const pointsForNextLevel = user.level * 1000;
  const progressPercent = Math.min((user.neuronEnergy / pointsForNextLevel) * 100, 100);

  const getBadgeIcon = (badgeName) => {
    switch (badgeName) {
      case 'First Blood': return <Star className="text-[var(--neon-yellow)]" size={24} />;
      case 'Bug Hunter': return <Shield className="text-[var(--neon-pink)]" size={24} />;
      case 'Algorithm Master': return <Cpu className="text-[var(--neon-green)]" size={24} />;
      default: return <Hexagon className="text-[var(--neon-blue)]" size={24} />;
    }
  };

  return (
    <div className="cyber-panel p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 border-b border-[var(--panel-border)] pb-6 mb-6">
        <div className="w-20 h-20 rounded-full border-2 border-[var(--neon-blue)] shadow-[0_0_15px_var(--neon-blue)] overflow-hidden bg-black/50 p-1">
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
            alt="Avatar" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold neon-text">{user.name}</h2>
          <p className="text-[var(--text-muted)] font-bold tracking-widest text-sm mt-1">Lvl. {user.level || 1}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-[var(--neon-blue)] uppercase flex items-center gap-2">
            <Zap size={16} /> Năng lượng Nơ-ron
          </span>
          <span className="text-lg font-bold font-['Orbitron'] text-white">
            {user.neuronEnergy} <span className="text-[var(--text-muted)] text-sm">/ {pointsForNextLevel}</span>
          </span>
        </div>
        <div className="h-4 bg-black/50 border border-[var(--panel-border)] rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[var(--neon-blue)] relative"
            style={{ 
              width: `${progressPercent}%`, 
              boxShadow: '0 0 10px var(--neon-blue)',
              transition: 'width 1s ease-out'
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-[var(--neon-pink)] mb-4 border-l-4 border-[var(--neon-pink)] pl-3 uppercase">Huy hiệu Kỹ năng</h3>
        <div className="grid grid-cols-2 gap-3">
          {user.badges && user.badges.length > 0 ? (
            user.badges.map((badge, idx) => (
              <div key={idx} className="bg-black/30 border border-[rgba(255,0,255,0.2)] p-3 rounded flex flex-col items-center justify-center gap-2 hover:border-[var(--neon-pink)] transition-colors hover:shadow-[0_0_10px_rgba(255,0,255,0.2)]">
                {getBadgeIcon(badge)}
                <span className="text-xs text-center font-bold text-gray-300">{badge}</span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-[var(--text-muted)] py-4 text-sm border border-dashed border-[var(--text-muted)] rounded">
              Chưa thu thập huy hiệu nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
