import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import PostFormModal from '../components/PostFormModal';
import { Plus, Camera, LayoutGrid, Ghost, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axiosInstance from '../lib/axiosInstance';

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-add-post', handleOpenModal);
    return () => window.removeEventListener('open-add-post', handleOpenModal);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/post/fetch');
      const mappedPosts: Post[] = (response.data.posts || []).map((p: any) => ({
        id: p._id,
        userId: p.user,
        caption: p.caption,
        mediaUrl: p.image,
        mediaType: 'image', // Backend only supports images for now
        createdAt: new Date(p.date).getTime() || Date.now()
      }));
      setPosts(mappedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/post/delete-post/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleEdit = async (id: string, caption: string) => {
    try {
      await axiosInstance.patch(`/post/update-post/${id}`, { caption });
      setPosts(posts.map(p => p.id === id ? { ...p, caption } : p));
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post');
    }
  };

  const handleAddPost = () => {
    fetchPosts(); // Refetch all posts after adding
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 mb-4">
            <Camera size={18} className="text-purple-500 dark:text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Personal Artifacts</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
            Curate your <br />
            <span className="text-slate-300 dark:text-slate-600">vibration.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white/40 dark:bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-black/5 dark:border-white/10 self-start md:self-auto shadow-xl">
          <LayoutGrid size={18} className="text-blue-500 dark:text-blue-400" />
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {posts.length} <span className="text-slate-400 dark:text-slate-500 font-medium">{posts.length === 1 ? 'Moment' : 'Moments'}</span>
          </span>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.length > 0 ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[4rem] border border-black/5 dark:border-white/5"
          >
            <div className="h-28 w-28 bg-black/5 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mb-8 border border-black/5 dark:border-white/5">
              <Ghost size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Void Detected</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm font-medium">
              Your narrative is currently unwritten. Inject a pulse into your collection.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <Plus size={24} strokeWidth={3} />
              Begin Narrative
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Button */}
      {posts.length > 0 && (
        <div className="mt-24 flex flex-col items-center border-t border-black/5 dark:border-white/10 pt-24">
          <p className="text-slate-400 dark:text-slate-500 mb-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
            Horizon Reached <ArrowRight size={14} />
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-bold text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/30"
          >
            <Plus size={28} strokeWidth={3} />
            Add New Post
          </button>
        </div>
      )}

      <PostFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddPost} 
      />
    </div>
  );
}
