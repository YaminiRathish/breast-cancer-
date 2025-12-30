
export enum AppView {
  HOME = 'HOME',
  DIAGNOSIS = 'DIAGNOSIS',
  HISTORY = 'HISTORY',
  ARCHITECTURE = 'ARCHITECTURE',
  ABOUT = 'ABOUT',
  PUBLIC_REPORT = 'PUBLIC_REPORT'
}

export enum DiagnosisMode {
  IMAGE = 'IMAGE',
  CLINICAL = 'CLINICAL'
}

export enum ProcessingStep {
  IDLE = 'IDLE',
  PREPROCESSING = 'Preprocessing Image...',
  CNN_EXTRACTION = 'CNN Feature Extraction...',
  ML_CLASSIFICATION = 'ML Classification (Random Forest)...',
  XAI_CALCULATION = 'Generating SHAP Explanations...',
  AI_INSIGHTS = 'Generating AI Clinical Insights...',
  COMPLETE = 'COMPLETE'
}

export interface FeatureImportance {
  feature: string;
  value: number; // SHAP value
  impact: 'positive' | 'negative';
}

export interface DiagnosisResult {
  id: string;
  timestamp: number;
  mode: DiagnosisMode;
  prediction: 'Malignant' | 'Benign' | 'Normal';
  confidence: number;
  imageUrl?: string;
  shapValues: FeatureImportance[];
  aiInterpretation?: string;
  isPublished?: boolean;
  publicUrl?: string;
}
