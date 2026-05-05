import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Plus, Minus, Search, ShieldAlert } from 'lucide-react';

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Listen to users collection
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        // Assume all users are students unless role === 'admin'
        if (doc.data().role !== 'admin') {
          usersData.push({ id: doc.id, ...doc.data() });
        }
      });
      // Sort by name
      usersData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setStudents(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching students:", error);
      // Mock data for demo
      setStudents([
        { id: '1', name: 'Cyber Ninja', email: 'ninja@cseed.edu.vn', neuronEnergy: 9500 },
        { id: '2', name: 'Code Breaker', email: 'breaker@cseed.edu.vn', neuronEnergy: 8200 },
      ]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdatePoints = async (userId, amount) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        neuronEnergy: increment(amount)
      });
    } catch (error) {
      console.error("Error updating points:", error);
      alert("Lỗi khi cập nhật điểm! Hãy kiểm tra kết nối Firebase.");
    }
  };

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel p-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold glow-text flex items-center gap-2 uppercase">
          <Users size={28} /> Quản lý Học sinh
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm học sinh..." 
            className="admin-input pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-t-[var(--admin-red)] border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--panel-border)] text-[var(--admin-red)] uppercase font-bold font-['Orbitron'] text-sm tracking-wider">
                <th className="p-4">Học Sinh</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-right">Năng lượng</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[var(--text-muted)]">
                    <ShieldAlert size={48} className="mx-auto mb-4 opacity-50" />
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-[var(--panel-border)]/30 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold">{student.name || 'Chưa cập nhật'}</td>
                    <td className="p-4 text-[var(--text-muted)]">{student.email}</td>
                    <td className="p-4 text-right font-['Orbitron'] font-bold text-xl">{student.neuronEnergy || 0}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleUpdatePoints(student.id, -100)}
                          className="admin-button flex items-center gap-1 !p-2 !border-gray-500 !text-gray-400 hover:!bg-gray-800 hover:!text-white hover:!border-white hover:shadow-none"
                          title="Trừ 100 điểm"
                        >
                          <Minus size={16} /> 100
                        </button>
                        <button 
                          onClick={() => handleUpdatePoints(student.id, 100)}
                          className="admin-button flex items-center gap-1 !p-2"
                          title="Cộng 100 điểm"
                        >
                          <Plus size={16} /> 100
                        </button>
                        <button 
                          onClick={() => handleUpdatePoints(student.id, 500)}
                          className="admin-button flex items-center gap-1 !p-2 !border-[var(--admin-orange)] !text-[var(--admin-orange)] hover:!bg-[var(--admin-orange)] hover:!text-black"
                          title="Cộng 500 điểm"
                        >
                          <Plus size={16} /> 500
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
