import type { QuickQuestion } from '../types';

export const QUICK_QUESTIONS: QuickQuestion[] = [
  // Data analysis
  { id: 'q1', icon: '📊', label: 'Data Summary', prompt: 'Give me a full summary of the uploaded data', category: 'data' },
  { id: 'q2', icon: '⚠️', label: 'Missing Values', prompt: 'Which columns have missing values and what is the percentage?', category: 'data' },
  { id: 'q3', icon: '🔍', label: 'Anomalies', prompt: 'Are there any anomalies in the data? Explain them.', category: 'data' },
  { id: 'q4', icon: '🔗', label: 'Correlations', prompt: 'What are the strongest correlations between data variables?', category: 'data' },
  { id: 'q5', icon: '📈', label: 'Top Values', prompt: 'What are the highest and lowest values in each numeric column?', category: 'analysis' },
  { id: 'q6', icon: '🎯', label: 'Recommendations', prompt: 'Based on the data, what are your recommendations for improvement?', category: 'analysis' },
  // General AI
  { id: 'q7', icon: '🧮', label: 'Calculate', prompt: 'Calculate mean and standard deviation for numeric columns', category: 'analysis' },
  { id: 'q8', icon: '💡', label: 'Smart Insights', prompt: 'What are the top 5 useful insights from this dataset?', category: 'analysis' },
  { id: 'q9', icon: '📝', label: 'Explain Data', prompt: 'Explain the content of this file in simple terms', category: 'data' },
  { id: 'q10', icon: '🤖', label: 'Predict', prompt: 'Can this data be used for a predictive model?', category: 'analysis' },
  { id: 'q11', icon: '🌍', label: 'General Question', prompt: 'What is the difference between AI and Machine Learning?', category: 'general' },
  { id: 'q12', icon: '✨', label: 'Data Power', prompt: 'How can I use this data to make better decisions?', category: 'general' },
];
