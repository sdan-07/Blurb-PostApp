import { useState, FormEvent } from 'react';
import { useAuth } from '../components/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
      console.error(err);
      alert(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-slate-950 px-4 relative overflow-hidden transition-colors">
      {/* Decorative Background Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border border-black/5 dark:border-white/10"
      >
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
            <UserIcon size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Moments'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {isLogin ? 'Sign in to access your collection' : 'Start your personal legacy today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white focus:bg-black/10 dark:focus:bg-white/10 focus:border-black/10 dark:focus:border-white/20 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-white/20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={18} />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white focus:bg-black/10 dark:focus:bg-white/10 focus:border-black/10 dark:focus:border-white/20 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-white/20"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-slate-900 dark:text-white focus:bg-black/10 dark:focus:bg-white/10 focus:border-black/10 dark:focus:border-white/20 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-white/20"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4.5 rounded-2xl font-black text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest"
          >
            {isLogin ? "New here? Create account" : 'Returning? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
