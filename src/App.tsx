import React, { useState, useMemo } from 'react';
import { Mic, MicOff, Brain, PlusCircle, LayoutDashboard, CalendarDays, DollarSign, FileBarChart, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpeech } from './hooks/useSpeech';
import { useProfessorOS } from './hooks/useProfessorOS';
import { ViewState } from './types';
import { DashboardView } from './components/views/DashboardView';
import { AgendaView } from './components/views/AgendaView';
import { FinancesView } from './components/views/FinancesView';
import { ReportsView } from './components/views/ReportsView';
import { AddAgendaEventModal } from './components/views/AddAgendaEventModal';
import { AddFinanceEventModal } from './components/views/AddFinanceEventModal';

export default function App() {
  const { data, isProcessing, lastReply, processAudioText, addAgendaEvent, addFinanceEvent, deleteAgendaEvent, deleteFinanceEvent } = useProfessorOS();
  const [inputText, setInputText] = useState("");
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isAddAgendaModalOpen, setIsAddAgendaModalOpen] = useState(false);
  const [isAddFinanceModalOpen, setIsAddFinanceModalOpen] = useState(false);
  
  const { isRecording, startRecording, stopRecording, error } = useSpeech((transcript) => {
    processAudioText(transcript);
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      processAudioText(inputText.trim());
      setInputText('');
    }
  };

  const navItems: { id: ViewState; icon: any; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
    { id: 'agenda', icon: CalendarDays, label: 'Agenda' },
    { id: 'finances', icon: DollarSign, label: 'Finanças' },
    { id: 'reports', icon: FileBarChart, label: 'Relatórios' },
  ];

  const handleAddClick = () => {
    if (currentView === 'finances') {
      setIsAddFinanceModalOpen(true);
    } else {
      setIsAddAgendaModalOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-200 font-sans flex flex-col items-center">
      <header className="w-full max-w-xl mx-auto pt-6 pb-4 px-6 flex items-center justify-between sticky top-0 bg-neutral-950/80 backdrop-blur-xl z-20 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl font-bold tracking-tight text-white">Professor OS</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddClick}
            className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg flex-shrink-0">
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col p-6 space-y-6 overflow-y-auto pb-48">
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 justify-center items-center rounded-xl text-sm border border-red-500/20">
            {error}
          </div>
        )}

        <AnimatePresence>
          {lastReply && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-2xl flex items-start gap-4 mb-4"
            >
              <Brain className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-indigo-100 font-medium leading-relaxed">{lastReply}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {currentView === 'dashboard' && <DashboardView data={data} />}
            {currentView === 'agenda' && <AgendaView data={data} onDelete={deleteAgendaEvent} />}
            {currentView === 'finances' && <FinancesView data={data} onDelete={deleteFinanceEvent} />}
            {currentView === 'reports' && <ReportsView data={data} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 w-full max-w-xl bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800 z-20 pb-2">
        {/* Floating Recording Section */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-14 w-[90%] max-w-md flex flex-col items-center gap-4">
          <AnimatePresence>
            {isProcessing && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className="flex items-center gap-3 px-5 py-2.5 bg-indigo-500/20 text-indigo-300 shadow-xl rounded-full text-sm font-medium border border-indigo-500/30"
               >
                 <div className="flex gap-1.5">
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                   <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                 </div>
                 Processando áudio...
               </motion.div>
            )}
          </AnimatePresence>

           <div className="flex w-full gap-2 items-center bg-neutral-900 border border-neutral-700/50 p-2 rounded-full shadow-2xl">
             <form onSubmit={handleManualSubmit} className="flex-1 flex items-center">
                 <input 
                   type="text" 
                   placeholder="Digite um comando..."
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   disabled={isProcessing}
                   className="w-full bg-transparent px-4 text-sm text-white focus:outline-none placeholder:text-neutral-500 disabled:opacity-50"
                 />
                 <button disabled={!inputText.trim() || isProcessing} type="submit" className="p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-30">
                   <PlusCircle className="w-5 h-5" />
                 </button>
             </form>
             <div className="w-px h-6 bg-neutral-700"></div>
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`p-3 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isRecording 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>
           </div>
        </div>

        {/* Bottom Navigation Tabs */}
        <div className="flex items-center justify-between px-6 pt-16 pb-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1.5 p-2 transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <div className={`relative p-1 ${isActive ? 'bg-indigo-400/10 rounded-xl' : ''}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </div>
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            )
          })}
        </div>
      </footer>

      <AddAgendaEventModal
        isOpen={isAddAgendaModalOpen}
        onClose={() => setIsAddAgendaModalOpen(false)}
        onAdd={addAgendaEvent}
      />
      <AddFinanceEventModal
        isOpen={isAddFinanceModalOpen}
        onClose={() => setIsAddFinanceModalOpen(false)}
        onAdd={addFinanceEvent}
      />
    </div>
  );
}
