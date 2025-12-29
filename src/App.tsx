import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mic, Square, Loader2, Sparkles, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  source: 'user' | 'ai';
  message: string;
}

function App() {
  const [status, setStatus] = useState<'idle' | 'connected' | 'disconnected'>('idle');
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const conversation = useConversation({
    onConnect: () => { setStatus('connected'); setTranscript([]); setFeedback(''); },
    onDisconnect: () => { setStatus('disconnected'); generateFeedback(); },
    onMessage: (message) => {
      if (message.message) setTranscript(prev => [...prev, { source: message.source === 'user' ? 'user' : 'ai', message: message.message }]);
    },
    onError: (error) => console.error('Error:', error),
  });

  const startInterview = useCallback(async () => {
    try {
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
      if (!agentId) return alert("Missing Agent ID");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: agentId } as any);
    } catch (error) { alert("Connection failed."); }
  }, [conversation]);

  const stopInterview = useCallback(async () => { await conversation.endSession(); }, [conversation]);

  const generateFeedback = async () => {
    if (transcript.length === 0) return;
    setIsAnalyzing(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const conversationText = transcript.map(t => `${t.source}: ${t.message}`).join('\n');
      const prompt = `You are a Senior Technical Recruiter at Google. Analyze this interview transcript:\n${conversationText}\nProvide a performance review in Markdown. Focus on: Technical Accuracy, Communication Clarity, and a Final Verdict (Hire/No Hire).`;
      const result = await model.generateContent(prompt);
      setFeedback(result.response.text());
    } catch (error) { setFeedback("Error generating feedback."); } 
    finally { setIsAnalyzing(false); }
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Gradients (Subtle) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-3xl z-10 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs font-medium text-zinc-400 mb-4">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI POWERED INTERVIEWER</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            SkillNova <span className="text-zinc-500">Voice</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed">
            Master your technical interview skills with real-time AI feedback.
          </p>
        </div>

        {/* Interaction Card */}
        <div className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-12 shadow-2xl flex flex-col items-center gap-8 overflow-hidden">
          
          {/* Status Light */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`} />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {status === 'connected' ? 'Live' : 'Ready'}
            </span>
          </div>

          {/* The "Breathing" Mic */}
          <div className="relative group">
             {/* Animation Rings */}
            {status === 'connected' && (
              <>
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-75 duration-1000" />
                <div className="absolute inset-[-12px] bg-indigo-500/10 rounded-full animate-pulse delay-75" />
              </>
            )}
            
            <button
              onClick={status === 'connected' ? stopInterview : startInterview}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                status === 'connected' 
                  ? 'bg-white text-zinc-900 scale-105' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
              }`}
            >
              {status === 'connected' ? (
                <Square className="w-8 h-8 fill-current" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Action Text */}
          <div className="text-center space-y-1 h-12">
             {status === 'idle' && <p className="text-zinc-400">Tap microphone to begin</p>}
             {status === 'connected' && <p className="text-indigo-300 font-medium animate-pulse">Listening...</p>}
             {isAnalyzing && (
               <div className="flex items-center gap-2 text-zinc-300">
                 <Loader2 className="w-4 h-4 animate-spin" />
                 <span>Generating performance review...</span>
               </div>
             )}
          </div>

        </div>

        {/* Feedback Section (Clean Report Style) */}
        {feedback && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Assessment Complete
              </h3>
              <span className="text-xs text-zinc-500 font-mono">GEMINI-1.5-FLASH</span>
            </div>
            
            <div className="p-8 prose prose-invert prose-zinc max-w-none">
              {/* Rendering markdown simply */}
              {feedback.split('\n').map((line, i) => {
                if (line.startsWith('**Verdict')) return (
                   <div key={i} className="mt-6 p-4 bg-zinc-800/50 rounded-lg border-l-4 border-indigo-500">
                      <p className="text-indigo-200 font-medium m-0">{line.replace(/\*\*/g, '')}</p>
                   </div>
                );
                return <p key={i} className="leading-7 text-zinc-300">{line.replace(/\*\*/g, '')}</p>
              })}
            </div>
            
            <div className="bg-zinc-950/50 p-4 text-center border-t border-zinc-800">
              <button onClick={() => window.location.reload()} className="text-sm text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1 mx-auto transition-colors">
                Start New Session <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;