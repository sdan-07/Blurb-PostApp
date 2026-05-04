import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { X, Image as ImageIcon, Video, Upload, Loader2, Plus, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../lib/axiosInstance';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { caption: string; mediaUrl: string; mediaType: 'image' | 'video' }) => void;
}

export default function PostFormModal({ isOpen, onClose, onSubmit }: PostFormModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMediaType(selectedFile.type.startsWith('video') ? 'video' : 'image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!caption || !file) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);

      await axiosInstance.post('/post/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCaption('');
      setMediaUrl('');
      setFile(null);
      onSubmit({ caption, mediaUrl: '', mediaType }); // The parent will refetch
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          
            <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/10 overflow-hidden"
          >
            <div className="p-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-white/50 bg-clip-text text-transparent">New Moments</h2>
                <button 
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/5 dark:border-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-white/40 mb-3 uppercase tracking-widest">
                    Capture Moment
                  </label>
                  
                  <div className="relative group">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,video/*"
                      className="hidden"
                    />
                    
                    {!mediaUrl ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video border-2 border-dashed border-black/10 dark:border-white/10 rounded-[2.5rem] bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center gap-4 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all group"
                      >
                        <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-400 dark:text-white/40 group-hover:scale-110 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-all">
                          <Upload size={28} />
                        </div>
                        <div className="text-center">
                          <p className="text-slate-900 dark:text-white font-semibold">Select File</p>
                          <p className="text-slate-400 dark:text-white/30 text-sm mt-1">Image or Motion</p>
                        </div>
                      </button>
                    ) : (
                      <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-black/10 dark:border-white/20 shadow-2xl">
                        {mediaType === 'image' ? (
                          <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <video src={mediaUrl} className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => setMediaUrl('')}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                          {mediaType}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-white/40 mb-3 uppercase tracking-widest">
                    The Narrative
                  </label>
                  <textarea
                    required
                    placeholder="Describe this vibration..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:bg-black/10 dark:focus:bg-white/10 focus:border-black/20 dark:focus:border-white/20 transition-all outline-none resize-none h-36 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !mediaUrl}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Plus size={22} strokeWidth={2.5} />
                      Publish Moment
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
