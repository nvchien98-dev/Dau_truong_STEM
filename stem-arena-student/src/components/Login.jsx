import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError('Mã truy cập bị từ chối. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="cyber-panel p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full border-2 border-[var(--neon-blue)] shadow-[0_0_15px_var(--neon-blue)] mb-4 glitch-effect">
            <Terminal size={32} className="text-[var(--neon-blue)]" />
          </div>
          <h2 className="text-2xl font-bold neon-text mb-2">Đấu Trường STEM</h2>
          <p className="text-[var(--text-muted)] font-medium">Hệ thống xác thực danh tính Học Sinh</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-6 flex items-start gap-2">
            <ShieldAlert size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[var(--neon-blue)] text-sm uppercase tracking-wider mb-2 font-bold font-['Orbitron']">
              Mã Học Sinh (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input"
              placeholder="student@cseed.edu.vn"
              required
            />
          </div>

          <div>
            <label className="block text-[var(--neon-blue)] text-sm uppercase tracking-wider mb-2 font-bold font-['Orbitron']">
              Mật mã (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cyber-button w-full py-3 mt-4"
            style={{ animation: 'pulse-glow 2s infinite' }}
          >
            {loading ? 'ĐANG XÁC THỰC...' : 'KẾT NỐI VÀO ĐẤU TRƯỜNG'}
          </button>
        </form>
      </div>
    </div>
  );
}
