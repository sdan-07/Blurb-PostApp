import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { Moon, Sun, User, LogOut, FileText, PlusCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ onAddPost, onMyPosts }: { onAddPost: () => void, onMyPosts: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={onMyPosts}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-bold text-white text-sm">M</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Moments</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all text-slate-800 dark:text-white/90"
            >
              <div className="h-7 w-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <User size={14} />
              </div>
              <span className="text-sm font-medium">
                {user.name}
              </span>
              <ChevronDown size={14} className={`opacity-40 dark:opacity-60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1 z-50 text-slate-900 dark:text-slate-200"
                >
                  <button
                    onClick={() => { onMyPosts(); setIsDropdownOpen(false); }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <FileText size={16} className="opacity-70" />
                    My Posts
                  </button>
                  <button
                    onClick={() => { onAddPost(); setIsDropdownOpen(false); }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <PlusCircle size={16} className="opacity-70" />
                    Create Post
                  </button>
                  <div className="h-px bg-black/5 dark:bg-white/10 my-1 mx-1" />
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
