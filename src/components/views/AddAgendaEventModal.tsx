import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgendaEvent } from '../../types';

interface AddAgendaEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<AgendaEvent, 'id' | 'type' | 'createdAt'>) => void;
}

export function AddAgendaEventModal({ isOpen, onClose, onAdd }: AddAgendaEventModalProps) {
  const [eventType, setEventType] = useState('Aula');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [classGroup, setClassGroup] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType || !date || !description) return;
    
    onAdd({
      eventType,
      date,
      time,
      description,
      classGroup
    });
    
    // reset
    setEventType('Aula');
    setDate('');
    setTime('');
    setDescription('');
    setClassGroup('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Novo Compromisso</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-neutral-400 font-medium">Tipo</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  <option value="Aula">Aula</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Correção">Correção</option>
                  <option value="Lembrete">Lembrete</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm text-neutral-400 font-medium">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm text-neutral-400 font-medium">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-neutral-400 font-medium">Turma (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 8º Ano A"
                  value={classGroup}
                  onChange={e => setClassGroup(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-neutral-400 font-medium">Descrição</label>
                <textarea
                  placeholder="Ex: Fechar as médias do bimestre..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Salvar na Agenda
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
