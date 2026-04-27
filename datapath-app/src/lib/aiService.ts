import type { DatasetInfo, Lang } from '../types';

// Set this via environment or UI rather than hardcoding a real key.
const LLAMA_API_KEY = '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';

export interface ChatParams {
  question: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  apiKey?: string;
  dataset: DatasetInfo | null;
  lang: Lang;
  aiModel?: 'llama' | 'nemotron'; // Added to allow choosing the model
}

export async function askAI(params: ChatParams): Promise<string> {
  const { question, history, apiKey, dataset, lang } = params;
  
  // Exclusively using Gemini 2.0 Flash via OpenRouter
  const activeApiKey = apiKey || LLAMA_API_KEY; // Reusing LLAMA_API_KEY as the default OpenRouter key
  const targetModelStr = 'google/gemini-2.0-flash-001';

  const systemPrompt = `
You are DataPath AI, a premium world-class Data Analyst and General AI Assistant.
User's Language: ${lang === 'ar' ? 'Arabic' : 'English'}.

${dataset ? `CURRENT DATASET CONTEXT:
- Filename: ${dataset.filename}
- Rows: ${dataset.rows} | Columns: ${dataset.columns.length}
- Duplicates: ${dataset.duplicates} | Total Missing: ${dataset.totalNulls}
- Columns List: ${dataset.columns.map(c => `${c.name} (${c.type})`).join(', ')}` : 'No dataset uploaded.'}

RULES:
1. GENERAL KNOWLEDGE: You are NOT restricted to the dataset. Answer any general question (history, science, coding, life advice) with high quality.
2. DATA ANALYSIS: When asked about the data, be precise.
3. DATA ACTIONS: If the user asks to "remove duplicates" or "clean data" or "fix nulls", explain what you found AND state clearly that you can perform this action.
4. TONE: Professional, helpful, and concise. Use Markdown.
5. LANGUAGE: Always respond in the user's language (${lang === 'ar' ? 'Arabic' : 'English'}).
  `.trim();

  const messages = [
    ...history.slice(-10),
    { role: 'user' as const, content: question },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${activeApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Kimit AI Studio',
    },
    body: JSON.stringify({
      model: targetModelStr,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(lang === 'ar' ? 'مفتاح API غير صحيح أو مفقود. يرجى التحقق من الإعدادات.' : 'Invalid or missing API Key. Please check settings.');
    } else if (response.status === 429) {
      throw new Error(lang === 'ar' ? 'تم تجاوز الحد المسموح للطلبات. يرجى المحاولة لاحقاً.' : 'Rate limit exceeded. Please try again later.');
    } else if (response.status >= 500) {
      throw new Error(lang === 'ar' ? 'مشكلة في خوادم الذكاء الاصطناعي. يرجى المحاولة لاحقاً.' : 'AI server issue. Please try again later.');
    } else {
      throw new Error(lang === 'ar' ? 'حدث خطأ غير متوقع في معالجة طلبك.' : 'An unexpected error occurred while processing your request.');
    }
  }

  const data = await response.json() as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content ?? '';
}

export async function generateExecutiveSummary(dataset: DatasetInfo, apiKey: string | undefined, lang: Lang): Promise<string> {
  const prompt = `
    Analyze this dataset and provide a premium executive summary in ${lang === 'ar' ? 'Arabic' : 'English'}.
    Focus on:
    1. Overall Data Health & Quality.
    2. Most Important Insights (patterns/anomalies).
    3. Future Predictions / Forecasting (what to expect next based on this data).
    4. Clear Business Recommendations.
    Dataset: ${dataset.filename}, Rows: ${dataset.rows}, Total Nulls: ${dataset.totalNulls}, Anomalies: ${dataset.anomalies.length}.
    Use bold headers for each point and make it highly professional.
  `;

  return askAI({
    question: prompt,
    history: [],
    apiKey,
    dataset,
    lang
  });
}

export function speakText(text: string, lang: Lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/[#*]/g, ''));
  utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}
