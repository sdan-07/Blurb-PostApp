import { useState, useRef } from 'react';
import { Post } from '../types';
import { MoreHorizontal, Edit2, Trash2, Calendar, FileText, Check, X, Play, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onEdit: (id: string, caption: string) => void;
  key?: string | number;
}

export default function PostCard({ post, onDelete, onEdit }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onEdit(post.id, editedCaption);
    setIsEditing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(timestamp));
  };

  return (
    <motion.div 
      layout
      className="bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/15 shadow-xl dark:shadow-2xl transition-all hover:bg-white/60 dark:hover:bg-white/[0.12]"
    >
      {/* Media */}
      <div className="relative aspect-video group">
        {post.mediaType === 'image' ? (
          <img 
            src={post.mediaUrl} 
            alt={post.caption} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        ) : (
          <video 
            src={post.mediaUrl} 
            className="w-full h-full object-cover"
            controls
          />
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2.5 rounded-full bg-black/20 dark:bg-black/30 backdrop-blur-lg text-white/90 hover:bg-black/40 dark:hover:bg-black/50 transition-all border border-white/10"
          >
            <MoreHorizontal size={18} />
          </button>

          <AnimatePresence>
            {showOptions && (
              <>
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setShowOptions(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 mt-3 w-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1 z-10"
                >
                  <button
                    onClick={() => { setIsEditing(true); setShowOptions(false); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <Edit2 size={14} className="opacity-70" />
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(post.id); setShowOptions(false); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} className="opacity-70" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-4 left-4 bg-black/30 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest border border-white/10">
          {formatDate(post.createdAt)}
        </div>
      </div>

      {/* Content */}
      <div className="p-7">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 resize-none focus:bg-black/10 dark:focus:bg-white/10 transition-colors outline-none h-28 text-sm"
              placeholder="Refine your story..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-colors"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleSave}
                className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                <Check size={18} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed font-medium">
            {post.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}
