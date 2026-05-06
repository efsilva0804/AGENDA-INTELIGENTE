import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FinanceEvent } from '../../types';

interface AddFinanceEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Omit<FinanceEvent, 'id' | 'type' | 'createdAt'>) => void;
}

export function AddFinanceEventModal({ isOpen, onClose, onAdd }: AddFinanceEventModalProps) {
  const [financeType, setFinanceType] = useState<'Receita' | 'Despesa'>('Despesa');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    onAdd({
      financeType,
      amount: parseFloat(amount),
      category: category || 'Outros',
      paymentMethod: paymentMethod || 'Dinheiro',
      description
    });
    
    // reset
    setFinanceType('Despesa');
    setAmount('');
    setCategory('');
    setPaymentMethod('');
    setDescription('');
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-400" />
                Novo Registro
              </h2>
              <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFinanceType('Receita')}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${financeType === 'Receita' ? 'bg-teal-500/20 text-teal-400' : 'text-neutral-500 hover:bg-neutral-800'}`}
                >Receita</button>
                <button
                  type="button"
                  onClick={() => setFinanceType('Despesa')}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${financeType === 'Despesa' ? 'bg-rose-500/20 text-rose-400' : 'text-neutral-500 hover:bg-neutral-800'}`}
                >Despesa</button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-neutral-400 font-medium">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm text-neutral-400 font-medium">Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Alimentação"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm text-neutral-400 font-medium">Método</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                     <option value="">Selecione...</option>
                     <option value="Dinheiro">Dinheiro</option>
                     <option value="Cartão de Crédito">Cartão de Crédito</option>
                     <option value="Cartão de Débito">Cartão de Débito</option>
                     <option value="Pix">Pix</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-neutral-400 font-medium">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Compra de materiais..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors tracking-wide"
              >
                Salvar Registro
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
