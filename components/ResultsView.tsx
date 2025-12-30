
import React, { useState, useEffect } from 'react';
import { DiagnosisResult, DiagnosisMode } from '../types';
import { Eye, EyeOff, Download, Share2, Check, Globe, Sparkles, UserCheck, ShieldCheck, Copy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ResultsViewProps {
  result: DiagnosisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(result.isPublished || false);
  const [publicUrl, setPublicUrl] = useState('');

  const getStatusStyles = (prediction: string) => {
      switch (prediction) {
          case 'Malignant':
              return {
                  bg: 'bg-red-50/50',
                  border: 'border-red-100',
                  badge: 'bg-red-600 text-white',
                  bar: 'bg-red-500',
                  text: 'text-red-900',
                  glow: 'shadow-red-200',
                  icon: 'text-red-600'
              };
          case 'Benign':
              return {
                  bg: 'bg-amber-50/50',
                  border: 'border-amber-100',
                  badge: 'bg-amber-600 text-white',
                  bar: 'bg-amber-500',
                  text: 'text-amber-900',
                  glow: 'shadow-amber-200',
                  icon: 'text-amber-600'
              };
          default:
               return {
                  bg: 'bg-green-50/50',
                  border: 'border-green-100',
                  badge: 'bg-green-600 text-white',
                  bar: 'bg-green-500',
                  text: 'text-green-900',
                  glow: 'shadow-green-200',
                  icon: 'text-green-600'
              };
      }
  };

  const styles = getStatusStyles(result.prediction);
  
  // Use a more robust URL generation method
  const generateShareLink = () => {
    try {
        const url = new URL(window.location.href);
        // Clear existing params to avoid stacking
        url.search = ''; 
        url.searchParams.set('reportId', result.id);
        return url.toString();
    } catch (e) {
        return `${window.location.origin}${window.location.pathname}?reportId=${result.id}`;
    }
  };

  const handlePublish = () => {
    const link = generateShareLink();
    setPublicUrl(link);
    setIsPublished(true);
  };

  const handleCopyLink = async () => {
    const link = publicUrl || generateShareLink();
    try {
        await navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error("Copy failed", err);
    }
  };

  // Sync state if already published
  useEffect(() => {
    if (result.isPublished) {
        setPublicUrl(generateShareLink());
    }
  }, [result.id]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-sm">
      
      {/* Header Panel */}
      <div className={`p-8 border-b ${styles.bg} ${styles.border} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck size={120} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-white/50 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clinical Protocol v26.1</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Analysis</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
                Ref: <span className="text-slate-900 font-bold">{result.id}</span> • 
                Patient: <span className="text-slate-900 font-bold">X-992-Anonymous</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isPublished ? (
                <button 
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <Globe size={14} />
                    Publish & Get Link
                </button>
            ) : (
                <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? 'Link Copied' : 'Copy Shared Link'}
                </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div className={`p-6 rounded-2xl border-2 flex items-center justify-between shadow-lg ${styles.badge} ${styles.glow}`}>
                <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Final Prediction</span>
                    <span className="text-4xl font-black tracking-tighter leading-none">{result.prediction}</span>
                </div>
                <UserCheck size={40} className="opacity-40" />
            </div>
            <div className="bg-white/40 p-6 rounded-2xl border border-white/60 backdrop-blur-md">
                 <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Pipeline Confidence</span>
                 <div className="flex items-center gap-4">
                    <div className="flex-grow h-4 bg-slate-200/50 rounded-full overflow-hidden p-1 shadow-inner">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${styles.bar}`} 
                            style={{width: `${result.confidence * 100}%`}}
                        ></div>
                    </div>
                    <span className="font-black text-2xl text-slate-800 tabular-nums">{(result.confidence * 100).toFixed(1)}%</span>
                 </div>
            </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Gemini AI Insights Section */}
        <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 animate-pulse">
                <Sparkles className="text-indigo-400 opacity-50" size={60} />
            </div>
            <div className="relative z-10">
                <h3 className="flex items-center gap-2 text-indigo-200 text-xs font-black uppercase tracking-[0.3em] mb-4">
                    <Sparkles size={14} />
                    Gemini AI Clinical Interpretation
                </h3>
                <p className="text-lg leading-relaxed font-medium text-indigo-50 italic">
                    "{result.aiInterpretation}"
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Visual Panel */}
            <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] px-2">Diagnostic Scan</h3>
                
                {result.imageUrl ? (
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 aspect-square shadow-2xl ring-8 ring-slate-50">
                        <img src={result.imageUrl} alt="Scan" className="w-full h-full object-cover" />
                        {showHeatmap && (
                            <div className="absolute inset-0 heatmap-overlay pointer-events-none" 
                                 style={{
                                     background: `radial-gradient(circle at 40% 40%, ${result.prediction === 'Malignant' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.5)'} 0%, transparent 80%)`
                                 }}>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 h-full shadow-inner flex items-center justify-center">
                         <div className="text-center opacity-30">
                            <ShieldCheck size={48} className="mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">Numerical Analysis Only</p>
                         </div>
                    </div>
                )}
            </div>

            {/* Feature Importance Chart */}
            <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] px-2">Explainable AI (SHAP Plot)</h3>
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-inner h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={result.shapValues}
                            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="feature" type="category" width={100} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                            />
                            <ReferenceLine x={0} stroke="#94a3b8" />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {result.shapValues.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} fillOpacity={0.8} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {isPublished && publicUrl && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-500">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Globe size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-black text-indigo-900 text-xs uppercase tracking-widest">Shareable Public Link</p>
                        <p className="text-sm text-indigo-700 font-medium truncate max-w-md">{publicUrl}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleCopyLink}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 whitespace-nowrap"
                    >
                        {isCopied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                    <a 
                        href={publicUrl} 
                        target="_blank" 
                        className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap"
                    >
                        Test Link
                    </a>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
