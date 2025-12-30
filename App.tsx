
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Architecture } from './components/Architecture';
import { DiagnosisDashboard } from './components/DiagnosisDashboard';
import { About } from './components/About';
import { Login } from './components/Login';
import { ResultsView } from './components/ResultsView';
import { AppView, DiagnosisMode, DiagnosisResult } from './types';
import { ShieldCheck, Info } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Helper to get report from URL
  const getReportFromUrl = (): DiagnosisResult | null => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get('reportId');
    if (!reportId) return null;

    return {
      id: reportId,
      timestamp: Date.now(),
      mode: DiagnosisMode.IMAGE,
      prediction: reportId.includes('M') ? 'Malignant' : (reportId.includes('B') ? 'Benign' : 'Normal'),
      confidence: 0.92 + Math.random() * 0.05,
      aiInterpretation: "This analysis indicates consistent patterns with the selected classification. SHAP values suggest the model prioritized structural density and boundary regularity. Further clinical correlation is recommended.",
      shapValues: [
        { feature: 'radius_mean', value: reportId.includes('M') ? 0.45 : -0.22, impact: reportId.includes('M') ? 'positive' : 'negative' },
        { feature: 'texture_worst', value: reportId.includes('M') ? 0.38 : -0.15, impact: reportId.includes('M') ? 'positive' : 'negative' },
        { feature: 'concavity_mean', value: reportId.includes('M') ? 0.22 : -0.10, impact: reportId.includes('M') ? 'positive' : 'negative' }
      ],
      isPublished: true
    };
  };

  const initialReport = getReportFromUrl();
  const [currentView, setCurrentView] = useState<AppView>(initialReport ? AppView.PUBLIC_REPORT : AppView.HOME);
  const [publicReport, setPublicReport] = useState<DiagnosisResult | null>(initialReport);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(AppView.HOME);
    // Clear URL params on logout
    const url = new URL(window.location.href);
    url.searchParams.delete('reportId');
    window.history.replaceState({}, document.title, url.pathname);
  };

  const renderView = () => {
    if (currentView === AppView.PUBLIC_REPORT && publicReport) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
          <div className="mb-6 p-4 bg-indigo-600 rounded-2xl text-white flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Secured Public Report View</span>
            </div>
            <button 
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('reportId');
                window.history.replaceState({}, document.title, url.pathname);
                setCurrentView(AppView.HOME);
                setPublicReport(null);
              }}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-bold transition-all"
            >
              Back to Portal
            </button>
          </div>
          <ResultsView result={publicReport} />
          <div className="mt-8 p-6 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-4">
            <Info className="text-slate-400 mt-1" size={20} />
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Clinical Disclosure:</strong> This view is generated for peer-review and patient sharing. Deep interactive diagnostic tools require authentication via the OncoVision Main Portal. All data is processed under Project Report 2026 guidelines.
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Login onLogin={() => setIsAuthenticated(true)} />;
    }

    switch (currentView) {
      case AppView.HOME:
        return (
          <>
            <Hero onStart={() => setCurrentView(AppView.DIAGNOSIS)} />
            <Architecture />
          </>
        );
      case AppView.DIAGNOSIS:
        return <DiagnosisDashboard />;
      case AppView.ARCHITECTURE:
        return <Architecture />;
      case AppView.ABOUT:
        return <About />;
      default:
        return <Hero onStart={() => setCurrentView(AppView.DIAGNOSIS)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {currentView !== AppView.PUBLIC_REPORT && (
        <Navbar currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />
      )}
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-xs">
            <p>© 2026 Panimalar Engineering College. Final Year Project. All diagnostic data processed under HIPAA-simulated protocols.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
