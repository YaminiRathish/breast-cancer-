
import React, { useState } from 'react';
import { Upload, AlertCircle, FileText, Image as ImageIcon, BarChart2, Check, RefreshCw, Activity, Sparkles } from 'lucide-react';
import { DiagnosisMode, DiagnosisResult, ProcessingStep, FeatureImportance } from '../types';
import { ResultsView } from './ResultsView';
import { GoogleGenAI } from "@google/genai";

export const DiagnosisDashboard: React.FC = () => {
  const [mode, setMode] = useState<DiagnosisMode>(DiagnosisMode.IMAGE);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<ProcessingStep>(ProcessingStep.IDLE);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  
  const [clinicalData, setClinicalData] = useState({
    radius_mean: '',
    texture_mean: '',
    perimeter_mean: '',
    area_mean: '',
    smoothness_mean: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setStep(ProcessingStep.IDLE);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setStep(ProcessingStep.IDLE);
    }
  };

  const getAIInterpretation = async (prediction: string, shapValues: FeatureImportance[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `As a senior oncology AI specialist, interpret these SHAP values for a breast cancer diagnosis.
    Prediction: ${prediction}
    Features: ${shapValues.map(s => `${s.feature}: ${s.value.toFixed(4)}`).join(', ')}
    Provide a concise clinical summary (max 100 words) explaining why the model reached this conclusion based on these specific feature contributions. Use professional but accessible terminology.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Interpretation Error:", error);
      return "Unable to generate AI interpretation at this time. Please refer to the feature importance chart below.";
    }
  };

  const startAnalysis = async () => {
    if (!file && mode === DiagnosisMode.IMAGE) return;
    if (mode === DiagnosisMode.CLINICAL && !clinicalData.radius_mean) return;

    setStep(ProcessingStep.PREPROCESSING);
    setResult(null);
    
    // Step-by-step simulation
    await new Promise(r => setTimeout(r, 800));
    setStep(ProcessingStep.CNN_EXTRACTION);
    await new Promise(r => setTimeout(r, 1000));
    setStep(ProcessingStep.ML_CLASSIFICATION);
    await new Promise(r => setTimeout(r, 800));
    setStep(ProcessingStep.XAI_CALCULATION);
    await new Promise(r => setTimeout(r, 900));
    setStep(ProcessingStep.AI_INSIGHTS);

    // Mock Result Generation logic
    let prediction: 'Malignant' | 'Benign' | 'Normal';
    if (mode === DiagnosisMode.IMAGE && file) {
        const len = file.name.length;
        prediction = len % 3 === 0 ? 'Malignant' : (len % 3 === 1 ? 'Benign' : 'Normal');
    } else {
        const rand = Math.random();
        prediction = rand < 0.33 ? 'Normal' : (rand < 0.66 ? 'Benign' : 'Malignant');
    }

    let shapValues: FeatureImportance[];
    if (prediction === 'Malignant') {
        shapValues = [
            { feature: 'radius_mean', value: 0.45, impact: 'positive' },
            { feature: 'texture_worst', value: 0.38, impact: 'positive' },
            { feature: 'concavity_mean', value: 0.22, impact: 'positive' }
        ];
    } else if (prediction === 'Benign') {
        shapValues = [
            { feature: 'radius_mean', value: 0.15, impact: 'positive' },
            { feature: 'texture_worst', value: -0.10, impact: 'negative' },
            { feature: 'concavity_mean', value: -0.15, impact: 'negative' }
        ];
    } else {
        shapValues = [
            { feature: 'radius_mean', value: -0.32, impact: 'negative' },
            { feature: 'texture_worst', value: -0.21, impact: 'negative' },
            { feature: 'concavity_mean', value: -0.15, impact: 'negative' }
        ];
    }

    const aiText = await getAIInterpretation(prediction, shapValues);

    setResult({
      id: `ONCO-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      timestamp: Date.now(),
      mode: mode,
      prediction: prediction,
      confidence: 0.85 + Math.random() * 0.14,
      imageUrl: file ? URL.createObjectURL(file) : undefined,
      shapValues: shapValues,
      aiInterpretation: aiText
    });
    setStep(ProcessingStep.COMPLETE);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setStep(ProcessingStep.IDLE);
    setClinicalData({ radius_mean: '', texture_mean: '', perimeter_mean: '', area_mean: '', smoothness_mean: '' });
  };

  const isProcessing = step !== ProcessingStep.IDLE && step !== ProcessingStep.COMPLETE;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostic Workspace</h1>
          <p className="text-slate-500 mt-2">Initialize Hybrid CNN-ML pipeline for breast tissue analysis.</p>
        </div>
        
        <div className="bg-slate-100 p-1.5 rounded-xl inline-flex shadow-inner">
          <button
            onClick={() => { setMode(DiagnosisMode.IMAGE); reset(); }}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              mode === DiagnosisMode.IMAGE ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon size={18} className="mr-2" />
            Radiological Imaging
          </button>
          <button
            onClick={() => { setMode(DiagnosisMode.CLINICAL); reset(); }}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              mode === DiagnosisMode.CLINICAL ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 size={18} className="mr-2" />
            Numerical Markers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={80} className="text-indigo-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mr-3 text-sm font-bold shadow-lg">1</span>
              System Input
            </h3>

            {mode === DiagnosisMode.IMAGE ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 overflow-hidden ${
                  file ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                {isProcessing && <div className="scan-line"></div>}
                
                {file ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 bg-indigo-100 rounded-2xl animate-pulse"></div>
                        <FileText size={48} className="text-indigo-600 relative z-10 m-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate max-w-[200px] mx-auto">{file.name}</p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(1)} KB DATA</p>
                    </div>
                    <button onClick={reset} className="text-xs text-red-500 hover:underline font-bold uppercase tracking-wider">Remove Scan</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold">Import Mammogram</p>
                      <p className="text-xs text-slate-500 mt-2 font-medium">DICOM, PNG, or JPEG supported</p>
                    </div>
                    <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept="image/*" />
                    <label htmlFor="file-upload" className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 cursor-pointer shadow-lg hover:shadow-indigo-200 transition-all">
                      Browse Files
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 animate-in slide-in-from-left duration-300">
                <div className="grid grid-cols-1 gap-4">
                    {['radius_mean', 'texture_mean', 'perimeter_mean', 'area_mean'].map((field) => (
                        <div key={field}>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{field.replace('_', ' ')}</label>
                            <input 
                                type="number" 
                                className="w-full rounded-xl border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 sm:text-sm border p-3.5 bg-slate-50 transition-all" 
                                value={clinicalData[field as keyof typeof clinicalData]} 
                                onChange={e => setClinicalData({...clinicalData, [field]: e.target.value})} 
                                placeholder="0.00" 
                            />
                        </div>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={startAnalysis}
              disabled={isProcessing || (!file && mode === DiagnosisMode.IMAGE) || (mode === DiagnosisMode.CLINICAL && !clinicalData.radius_mean)}
              className={`w-full mt-8 flex items-center justify-center px-6 py-4 rounded-xl text-white font-bold tracking-wide transition-all ${
                isProcessing || ((!file && mode === DiagnosisMode.IMAGE) || (mode === DiagnosisMode.CLINICAL && !clinicalData.radius_mean))
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="animate-spin mr-3" size={20} />
                  Running Neural Engine...
                </>
              ) : (
                <>
                  <Activity className="mr-3" size={20} />
                  {step === ProcessingStep.COMPLETE ? 'Restart Analysis' : 'Initialize Diagnosis'}
                </>
              )}
            </button>
          </div>
          
          {step !== ProcessingStep.IDLE && (
             <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 font-mono text-xs space-y-3 shadow-2xl border-l-4 border-indigo-500">
                <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold border-b border-slate-800 pb-2">
                    <Activity size={14} />
                    <span>SYSTEM_LOG_v2.0</span>
                </div>
                {[
                    { s: ProcessingStep.PREPROCESSING, label: 'PRE_PROCESS_IO' },
                    { s: ProcessingStep.CNN_EXTRACTION, label: 'CNN_FEAT_V3' },
                    { s: ProcessingStep.ML_CLASSIFICATION, label: 'RAND_FOREST_EXE' },
                    { s: ProcessingStep.XAI_CALCULATION, label: 'SHAP_INTERPRET' },
                    { s: ProcessingStep.AI_INSIGHTS, label: 'GEMINI_LLM_SUMMARY' },
                ].map((item, i) => (
                    <div key={i} className={`flex items-center transition-all duration-500 ${step === item.s ? 'text-indigo-400 translate-x-1' : (i < 4 && step === ProcessingStep.COMPLETE ? 'text-slate-500 opacity-60' : 'opacity-30')}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-3 ${step === item.s ? 'bg-indigo-400 animate-pulse' : 'bg-current'}`}></span>
                        [{item.label}] {item.s}
                    </div>
                ))}
                {step === ProcessingStep.COMPLETE && (
                    <div className="text-green-400 mt-4 flex items-center gap-2 animate-bounce">
                        <Check size={14} />
                        DIAGNOSIS_STREAM_SUCCESS
                    </div>
                )}
             </div>
          )}
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="animate-in slide-in-from-bottom duration-700">
                <ResultsView result={result} />
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center flex-col text-slate-400 group hover:border-indigo-200 transition-colors">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Sparkles className="text-slate-300 group-hover:text-indigo-300" size={40} />
               </div>
               <p className="font-bold text-slate-500 text-lg">System Awaiting Data Input</p>
               <p className="text-sm mt-2 font-medium opacity-60 text-center max-w-xs px-6">Upload a medical image or clinical markers to begin the AI-augmented diagnosis process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
