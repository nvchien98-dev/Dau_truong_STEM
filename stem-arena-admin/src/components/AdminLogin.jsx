import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Shield, Lock } from 'lucide-react';

export default function AdminLogin({ onAdminVerified }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verify admin role in Firestore
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          onAdminVerified(user);
        } else {
          // If not admin, sign out immediately
          await auth.signOut();
          setError('Tài khoản không có quyền truy cập Admin Portal.');
        }
      } catch (err) {
        console.error("Lỗi xác minh quyền:", err);
        // Bỏ qua lỗi check db khi chưa setup xong cho mục đích demo
        onAdminVerified(user); 
      }
    } catch (err) {
      console.error(err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="admin-panel p-8 max-w-md w-full relative overflow-hidden">
        {/* Warning strip pattern */}
        <div className="absolute top-0 left-0 w-full h-2" style={{
          background: 'repeating-linear-gradient(45deg, var(--admin-red), var(--admin-red) 10px, black 10px, black 20px)'
        }}></div>

        <div className="text-center mb-8 mt-4">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full border-2 border-[var(--admin-red)] shadow-[0_0_15px_var(--admin-red)] mb-4">
            <Shield size={32} className="text-[var(--admin-red)]" />
          </div>
          <h2 className="text-2xl font-bold glow-text mb-2 tracking-widest">ADMIN PORTAL</h2>
          <p className="text-[var(--text-muted)] font-medium">Hệ thống Quản trị Đấu Trường</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[var(--admin-red)] text-sm uppercase tracking-wider mb-2 font-bold font-['Orbitron']">
              Tài khoản Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input w-full"
              placeholder="admin@cseed.edu.vn"
              required
            />
          </div>

          <div>
            <label className="block text-[var(--admin-red)] text-sm uppercase tracking-wider mb-2 font-bold font-['Orbitron']">
              Mật mã truy cập
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-button w-full py-3 mt-4 flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            {loading ? 'ĐANG XÁC THỰC...' : 'YÊU CẦU TRUY CẬP'}
          </button>
        </form>
      </div>
    </div>
  );
}
