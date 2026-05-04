import { ThemeProvider } from './components/ThemeContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import AuthPage from './pages/AuthPage';
import MyPosts from './pages/MyPosts';
import Navbar from './components/Navbar';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="animate-spin text-zinc-900 dark:text-white" size={32} />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-purple-500/30 transition-colors relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-blue-600/10 dark:bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <Navbar 
          onAddPost={() => {
            window.dispatchEvent(new CustomEvent('open-add-post'));
          }} 
          onMyPosts={() => {}} 
        />
        <main>
          <MyPosts />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
