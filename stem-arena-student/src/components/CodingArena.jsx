import React, { useState, useRef } from 'react';
import { Send, Code, Link, UploadCloud, Terminal, XCircle, Zap } from 'lucide-react';

export default function CodingArena({ currentUser }) {
  const [submissionType, setSubmissionType] = useState('upload'); // 'code', 'link', 'upload'
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentorFeedback, setMentorFeedback] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (ext === 'py' || ext === 'sb3') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Chỉ huy C-seed chỉ hỗ trợ phân tích định dạng .py (Python) và .sb3 (Scratch).');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submissionType === 'upload' && !file) return;
    if (submissionType !== 'upload' && !content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    setMentorFeedback(null);

    if (submissionType === 'upload') {
      try {
        const formData = new FormData();
        formData.append('codeFile', file);

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/api/mentor/analyze`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi kết nối đến server AI.');
        }

        setMentorFeedback(data);
        
        // TODO: Here we should call Firebase Firestore to update neuronEnergy with data.e_bonus
        // await updateDoc(doc(db, "users", currentUser.uid), { neuronEnergy: increment(data.e_bonus) })
        
      } catch (err) {
        console.error(err);
        setError(err.message || 'Không thể kết nối đến Chỉ huy C-seed. Hãy đảm bảo Backend đang chạy.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Simulate normal submission
      setTimeout(() => {
        setIsSubmitting(false);
        setContent('');
      }, 1000);
    }
  };

  return (
    <div className="cyber-panel p-6 h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[var(--neon-blue)] rounded-full opacity-5 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <Code className="text-[var(--neon-blue)]" size={28} />
        <h2 className="text-2xl font-bold neon-text uppercase tracking-widest">Khu Vực Nộp Bài</h2>
      </div>

      <div className="flex gap-2 mb-4 relative z-10 text-xs md:text-sm">
        <button 
          onClick={() => setSubmissionType('upload')}
          className={`px-3 py-2 font-bold uppercase tracking-wider rounded transition-colors ${
            submissionType === 'upload' ? 'bg-[var(--neon-blue)] text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'bg-black/50 text-[var(--neon-blue)] border border-[var(--neon-blue)]'
          }`}
        >
          Tải file (.py, .sb3)
        </button>
        <button 
          onClick={() => setSubmissionType('code')}
          className={`px-3 py-2 font-bold uppercase tracking-wider rounded transition-colors ${
            submissionType === 'code' ? 'bg-[var(--neon-green)] text-black shadow-[0_0_15px_rgba(0,255,102,0.4)]' : 'bg-black/50 text-[var(--neon-green)] border border-[var(--neon-green)]'
          }`}
        >
          Dán Code
        </button>
        <button 
          onClick={() => setSubmissionType('link')}
          className={`px-3 py-2 font-bold uppercase tracking-wider rounded transition-colors ${
            submissionType === 'link' ? 'bg-[var(--neon-pink)] text-black shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-black/50 text-[var(--neon-pink)] border border-[var(--neon-pink)]'
          }`}
        >
          Nộp Link URL
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-500 text-red-300 p-3 rounded text-sm flex items-start gap-2">
          <XCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
          {error}
        </div>
      )}

      {mentorFeedback ? (
        <div className="flex-1 flex flex-col relative z-10 border border-[var(--neon-blue)] bg-black/80 rounded-md p-4 animate-fade-in overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 border-b border-[var(--neon-blue)]/30 pb-3">
            <div className="w-12 h-12 rounded-full border border-[var(--neon-blue)] shadow-[0_0_15px_var(--neon-blue)] bg-[url('https://api.dicebear.com/7.x/bottts/svg?seed=Commander')] bg-cover bg-center animate-pulse"></div>
            <div>
              <h3 className="text-[var(--neon-blue)] font-bold font-['Orbitron'] tracking-widest">CHỈ HUY C-SEED</h3>
              <p className="text-xs text-[var(--neon-green)] flex items-center gap-1">
                <Zap size={12} /> +{mentorFeedback.e_bonus} Năng lượng thưởng
              </p>
            </div>
          </div>
          <div className="text-[var(--text-main)] text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {mentorFeedback.feedback}
          </div>
          <button 
            onClick={() => { setMentorFeedback(null); setFile(null); }}
            className="mt-6 cyber-button py-2 text-sm"
          >
            NỘP BÀI KHÁC
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative z-10">
          <div className="flex-1 bg-black/60 border border-[var(--panel-border)] rounded-md relative group overflow-hidden">
            
            {submissionType === 'upload' && (
              <div 
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--neon-blue)]/30 m-2 rounded cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".py,.sb3"
                  onChange={handleFileChange}
                />
                <UploadCloud size={48} className="text-[var(--neon-blue)] mb-4 opacity-70" />
                <p className="text-[var(--neon-blue)] font-bold tracking-wider mb-2">BẤM ĐỂ CHỌN FILE</p>
                <p className="text-xs text-[var(--text-muted)]">Hỗ trợ định dạng: Python (.py) và Scratch (.sb3)</p>
                {file && (
                  <div className="mt-4 px-4 py-2 bg-[var(--neon-blue)]/20 border border-[var(--neon-blue)] rounded text-[var(--neon-blue)] font-mono text-sm">
                    {file.name}
                  </div>
                )}
              </div>
            )}

            {submissionType === 'code' && (
              <textarea
                className="w-full h-full bg-transparent text-[#00ff66] font-mono p-4 resize-none outline-none text-sm leading-relaxed"
                placeholder="// Paste your code here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck="false"
              />
            )}

            {submissionType === 'link' && (
              <div className="h-full p-4 flex flex-col justify-center">
                <label className="block text-[var(--neon-pink)] text-sm uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                  <Link size={16} /> URL Dự án
                </label>
                <input
                  type="url"
                  className="cyber-input border-[var(--neon-pink)] focus:border-[var(--neon-pink)] focus:shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                  placeholder="https://github.com/..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || (submissionType === 'upload' ? !file : !content.trim())}
            className={`cyber-button w-full py-4 mt-6 ${submissionType === 'link' ? 'pink' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Terminal size={20} className="animate-spin" /> ĐANG PHÂN TÍCH...</span>
            ) : (
              <span className="flex items-center gap-2"><Send size={20} /> XÁC NHẬN NỘP BÀI</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
