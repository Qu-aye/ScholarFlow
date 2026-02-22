import React from 'react';
import { Header } from './components/Header';
import { Paraphraser } from './components/Paraphraser';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center justify-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-2">
            <Sparkles size={14} />
            <span>Premium Academic Engine Active</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Humanize Your Text. <span className="text-indigo-600">Undetectably.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Advanced paraphrasing tailored for research and academic integrity. 
            Rewrite AI-generated content to be indistinguishable from human writing.
          </p>
        </div>

        <Paraphraser />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">Academic Integrity</h3>
            <p className="text-slate-500 text-sm">Engineered to maintain rigorous academic standards and citation flow.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">0% AI Detection Focus</h3>
            <p className="text-slate-500 text-sm">Maximizes perplexity and burstiness to mimic natural human writing patterns.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">Contextual Understanding</h3>
            <p className="text-slate-500 text-sm">Preserves original meaning while enhancing vocabulary and sentence structure.</p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ScholarFlow. Built for researchers.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;