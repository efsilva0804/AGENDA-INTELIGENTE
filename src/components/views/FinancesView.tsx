import { useMemo } from 'react';
import { OSData } from '../../types';
import { DollarSign, TrendingDown, TrendingUp, CreditCard, Banknote, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function FinancesView({ data, onDelete }: { data: OSData, onDelete: (id: string) => void }) {
  const finances = [...data.finances].sort((a, b) => b.createdAt - a.createdAt);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    finances.forEach(item => {
      if (item.financeType === 'Receita') income += item.amount;
      else expense += item.amount;
    });

    return { income, expense, total: income - expense };
  }, [finances]);

  // Group by category for a simple chart
  const chartData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};
    finances.forEach(item => {
      if (item.financeType === 'Despesa') {
        expensesByCategory[item.category] = (expensesByCategory[item.category] || 0) + item.amount;
      }
    });
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      value
    })).sort((a, b) => b.value - a.value);
  }, [finances]);

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este registro financeiro?")) {
      onDelete(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-32">
      <h2 className="text-xl font-bold text-white">Controle Financeiro</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-800 border border-neutral-700/50 p-4 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-teal-400 mb-1">
            <TrendingUp className="w-4 h-4"/>
            <span className="text-xs font-semibold uppercase">Receitas</span>
          </div>
          <span className="text-xl font-mono text-white">R$ {stats.income.toFixed(2)}</span>
        </div>
        <div className="bg-neutral-800 border border-neutral-700/50 p-4 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <TrendingDown className="w-4 h-4"/>
            <span className="text-xs font-semibold uppercase">Despesas</span>
          </div>
          <span className="text-xl font-mono text-white">R$ {stats.expense.toFixed(2)}</span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-neutral-800 border border-neutral-700/50 p-4 rounded-2xl pt-6 h-64">
           <h3 className="text-sm text-neutral-400 font-medium mb-4">Despesas por Categoria</h3>
           <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                  cursor={{ fill: '#262626' }}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fb7185' }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Gasto']}
                />
                <Bar dataKey="value" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mt-2">Transações</h3>
        {finances.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center py-4">Nenhuma transação registrada.</p>
        ) : (
          finances.map(item => (
            <div key={item.id} className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-xl flex items-center justify-between relative group">
              <div className="flex flex-col gap-1 pr-6">
                <span className="text-white font-medium">{item.description}</span>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span className="bg-neutral-700/50 px-1.5 py-0.5 rounded">{item.category}</span>
                  {item.paymentMethod && (
                    <span className="flex items-center gap-1">
                      {item.paymentMethod.toLowerCase().includes('cart') ? <CreditCard className="w-3 h-3"/> : <Banknote className="w-3 h-3"/>}
                      {item.paymentMethod}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`font-mono font-medium ${item.financeType === 'Receita' ? 'text-teal-400' : 'text-rose-400'}`}>
                  {item.financeType === 'Receita' ? '+' : '-'}R$ {item.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-neutral-500 hover:text-rose-400 p-1 rounded transition-colors"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
