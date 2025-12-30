
import React from 'react';
import { Activity, Brain, FileText, Home, Menu, X, LogOut, User, Share2, Check } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const navItems = [
    { id: AppView.HOME, label: 'Home', icon: Home },
    { id: AppView.DIAGNOSIS, label: 'Start Diagnosis', icon: Activity },
    { id: AppView.ARCHITECTURE, label: 'System Architecture', icon: Brain },
    { id: AppView.ABOUT, label: 'About Project', icon: FileText },
  ];

  const handleShareApp = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                X
              </div>
              <div>
                <span className="font-bold text-xl text-slate-900 block leading-tight">OncoVision</span>
                <span className="text-xs text-pink-600 font-semibold uppercase tracking-wider">Hybrid XAI Framework</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            
            <div className="flex items-center gap-3 ml-2">
              <button 
                onClick={handleShareApp}
                className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                    copied ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-pink-600 hover:bg-pink-50'
                }`}
                title="Share App Link"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                {copied ? 'Link Copied' : 'Share App'}
              </button>

              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <div className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="text-xs font-semibold text-slate-700">Dr. Clinician</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-md text-base font-medium ${
                  currentView === item.id
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
             <button
              onClick={handleShareApp}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              <Share2 size={20} />
              Share App Link
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
