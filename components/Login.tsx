import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated Authentication
    setTimeout(() => {
      if (email === 'clinician@oncovision.ai' && password === 'password2026') {
        onLogin();
      } else {
        setError('Invalid clinical credentials. Please check your email and password.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 rounded-2xl text-white font-bold text-3xl shadow-lg mb-4">
            X
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">OncoVision XAI</h1>
          <p className="text-slate-500 mt-2">Clinical Portal Access</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <ShieldAlert size={18} />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all"
                  placeholder="clinician@oncovision.ai"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-pink-600 focus:ring-pink-500" />
                Remember this terminal
              </label>
              <button type="button" className="text-pink-600 hover:text-pink-700 font-medium">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authenticate <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Authorized clinical use only. All actions are logged under the Project Report 2026 compliance framework.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-xs">
          <p>Demo Credentials:</p>
          <p className="font-mono mt-1">clinician@oncovision.ai / password2026</p>
        </div>
      </div>
    </div>
  );
};