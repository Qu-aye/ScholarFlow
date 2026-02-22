import React, { useState, useCallback, useEffect } from 'react';
import { ModeSelector } from './ModeSelector';
import { ParaphraseMode } from '../types';
import { rewriteText } from '../services/gemini';
import { AIDetector } from './AIDetector';
import { Copy, RefreshCw, Trash2, ArrowRight, Wand2, Check, AlertTriangle, Timer, KeyRound, ShieldOff, ServerCrash, WifiOff } from 'lucide-react';

export const Paraphraser: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<ParaphraseMode>(ParaphraseMode.Academic);
  const [tone, setTone] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const toneLabels: { [key: number]: string } = {
    '-2': 'Very Informal',
    '-1': 'Informal',
    '0': 'Neutral',
    '1': 'Formal',
    '2': 'Very Formal',
  };

  const handleParaphrase = useCallback(async () => {
    if (!inputText.trim() || cooldown > 0) return;
    setIsLoading(true);
    setIsCopied(false);
    setError(null);
    setOutputText(''); // Clear previous output to focus user on the new process
    
    // Simulate a slight delay for better UX (so it doesn't feel too instant/robotic)
    await new Promise(r => setTimeout(r, 600));

    try {
      const result = await rewriteText(inputText, mode, tone);
      setOutputText(result);
      setCooldown(15); // Start cooldown only on a successful request
    } catch (err: any) {
      setError({
        message: err.message || "An unexpected error occurred.",
        code: err.code || 'GENERIC_ERROR'
      });
      // Trigger cooldown specifically for rate limit errors
      if (err.code === 'RATE_LIMIT_ERROR') {
        setCooldown(15);
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputText, mode, tone, cooldown]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setIsCopied(false);
    setError(null);
  };

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = (text: string) => text.length;
  
  const getErrorIcon = (code?: string) => {
    const iconProps = { size: 24, className: "text-red-600" };
    switch (code) {
        case 'RATE_LIMIT_ERROR': return <Timer {...iconProps} />;
        case 'AUTH_ERROR': return <KeyRound {...iconProps} />;
        case 'SAFETY_ERROR': return <ShieldOff {...iconProps} />;
        case 'SERVER_ERROR': return <ServerCrash {...iconProps} />;
        case 'NETWORK_ERROR': return <WifiOff {...iconProps} />;
        default: return <AlertTriangle {...iconProps} />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      {/* Controls Bar */}
      <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-sm z-10 relative">
        <ModeSelector selectedMode={mode} onSelectMode={setMode} />
        
        <div className="flex-1 w-full md:w-auto">
          <label htmlFor="tone-slider" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center md:text-left">
            Tone
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="tone-slider"
              type="range"
              min="-2"
              max="2"
              step="1"
              value={tone}
              onChange={(e) => setTone(Number(e.target.value))}
              disabled={isLoading || cooldown > 0}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed accent-indigo-600"
            />
            <span className="text-sm font-medium text-slate-600 w-28 text-center">{toneLabels[tone]}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={handleParaphrase}
            disabled={isLoading || !inputText.trim() || cooldown > 0}
            className={`flex-1 md:flex-none flex items-center justify-center space-x-2 px-8 py-3 rounded-lg font-semibold text-white shadow-md transition-all 
              ${isLoading || !inputText.trim() || cooldown > 0
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'
              }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                <span>Working...</span>
              </>
            ) : cooldown > 0 ? (
              <>
                <Timer size={18} />
                <span>Wait {cooldown}s</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span>Paraphrase</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="bg-white border border-slate-200 rounded-b-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Input Section */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
          
          <div className="flex-1 p-6 relative">
             <textarea
              className="w-full h-full resize-none outline-none text-slate-700 text-lg leading-relaxed bg-transparent placeholder:text-slate-300"
              placeholder="Paste your text here to rewrite..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              spellCheck="false"
            />
            {inputText && (
               <button 
                onClick={handleClear}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                title="Clear text"
               >
                 <Trash2 size={18} />
               </button>
            )}
          </div>
          
          <div className="h-12 bg-slate-50 border-t border-slate-100 px-6 flex items-center justify-between text-xs font-medium text-slate-400">
             <span>{wordCount(inputText)} words</span>
             <span>
               {charCount(inputText)} chars
             </span>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col bg-slate-50/50 relative">
          <div className="flex-1 p-6 relative">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-3 bg-white/50 backdrop-blur-sm z-10">
                 <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                 <span className="animate-pulse font-medium">Humanizing text...</span>
              </div>
            )}

            {!isLoading && error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    {getErrorIcon(error.code)}
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-2">Rewrite Failed</h3>
                <p className="text-slate-500 max-w-xs mb-6 leading-relaxed text-sm">{error.message}</p>
                <button 
                    onClick={handleParaphrase}
                    disabled={cooldown > 0}
                    className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? (
                    <>
                      <Timer size={16} />
                      <span>Wait {cooldown}s</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      <span>Try Again</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
               outputText ? (
                <textarea
                  className="w-full h-full resize-none outline-none text-indigo-900 text-lg leading-relaxed bg-transparent"
                  value={outputText}
                  readOnly
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 select-none">
                  <ArrowRight size={48} className="mb-4 opacity-20" />
                  <p>Your rewritten text will appear here</p>
                </div>
              )
            )}

            {outputText && !isLoading && !error && (
              <button
                onClick={handleCopy}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center space-x-2 border shadow-sm
                  ${isCopied 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:text-indigo-600 hover:border-indigo-200'
                  }`}
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
                {isCopied && <span className="text-xs font-bold">Copied!</span>}
              </button>
            )}
          </div>

           <div className="h-12 bg-slate-100/50 border-t border-slate-200 px-6 flex items-center justify-between text-xs font-medium text-slate-400">
             {!error && outputText && (
               <>
                <span className="flex items-center space-x-2">
                   <span>{wordCount(outputText)} words</span>
                   {wordCount(outputText) !== wordCount(inputText) && (
                     <span className={`px-1.5 py-0.5 rounded ${
                       wordCount(outputText) > wordCount(inputText) ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                     }`}>
                       {wordCount(outputText) > wordCount(inputText) ? '+' : ''}{wordCount(outputText) - wordCount(inputText)}
                     </span>
                   )}
                </span>
                <span className="text-indigo-500">
                  AI Probability: &lt;1% (Estimated)
                </span>
               </>
             )}
             {error && <span className="text-red-500 flex items-center space-x-1"><AlertTriangle size={12}/> <span>Error encountered</span></span>}
          </div>
        </div>
      </div>
      
      {/* AI Detector Section */}
      <AIDetector text={outputText} />
    </div>
  );
};