import React from 'react';
import { MODES } from '../constants';
import { ParaphraseMode } from '../types';
import { ChevronDown } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: ParaphraseMode;
  onSelectMode: (mode: ParaphraseMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onSelectMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeMode = MODES.find(m => m.id === selectedMode) || MODES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        Mode
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-64 bg-white border border-slate-200 hover:border-indigo-400 rounded-lg px-4 py-2.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className={`w-2 h-2 rounded-full ${activeMode.color}`}></span>
          <span className="font-medium text-slate-700 truncate">{activeMode.label}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden max-h-96 overflow-y-auto">
          <div className="p-2 space-y-1">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onSelectMode(mode.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-start space-x-3 transition-colors ${
                  selectedMode === mode.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${mode.color}`} />
                <div>
                  <div className={`font-medium text-sm ${selectedMode === mode.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {mode.label}
                  </div>
                  <div className="text-xs text-slate-500 leading-tight mt-0.5">
                    {mode.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};