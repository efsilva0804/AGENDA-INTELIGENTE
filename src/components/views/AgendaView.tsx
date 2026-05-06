import { useState, useMemo } from 'react';
import { OSData, AgendaEvent } from '../../types';
import { CalendarIcon, Clock, MapPin, Users, Share2, Trash2, Filter } from 'lucide-react';
import { parseISO, format, isSameMonth, isValid } from 'date-fns';

export function AgendaView({ data, onDelete }: { data: OSData; onDelete: (id: string) => void }) {
  const [filterMonth, setFilterMonth] = useState<string>(''); // empty means all

  const events = useMemo(() => {
    let filtered = [...data.agenda];
    
    if (filterMonth) {
      const [year, month] = filterMonth.split('-');
      filtered = filtered.filter(item => {
        if (!item.date) return false;
        const dateObj = new Date(Number(year), Number(month) - 1, 1);
        const itemDate = parseISO(item.date);
        return isValid(itemDate) && isSameMonth(itemDate, dateObj);
      });
    }

    return filtered.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return b.createdAt - a.createdAt;
    });
  }, [data.agenda, filterMonth]);

  const handleShareEvent = (item: AgendaEvent) => {
    let message = `*Lembrete de Compromisso:*\n${item.description}\n`;
    if (item.date) {
      message += `*Data:* ${item.date.split('-').reverse().join('/')}\n`;
    }
    if (item.time) {
      message += `*Hora:* ${item.time}\n`;
    }
    if (item.classGroup) {
      message += `*Turma:* ${item.classGroup}\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este compromisso?")) {
      onDelete(id);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full pb-32">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white">Sua Agenda</h2>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500">
          <Filter className="w-4 h-4 text-neutral-400" />
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-transparent text-sm text-neutral-300 focus:outline-none [color-scheme:dark]"
            aria-label="Filtrar por mês"
          />
          {filterMonth && (
            <button onClick={() => setFilterMonth('')} className="text-xs text-indigo-400 font-medium ml-2">Limpar</button>
          )}
        </div>
      </div>
      
      {events.length === 0 ? (
        <p className="text-neutral-500 text-sm text-center py-8">
          {filterMonth ? 'Nenhum compromisso neste mês.' : 'Sua agenda está vazia.'}
        </p>
      ) : (
        events.map(item => (
          <div key={item.id} className="bg-neutral-800 border border-neutral-700/50 p-4 rounded-xl flex flex-col gap-2 relative group">
            <div className="flex items-center justify-between pr-16">
              <span className="text-emerald-400 bg-emerald-400/10 px-2 flex items-center gap-1.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                <CalendarIcon className="w-3.5 h-3.5"/>
                {item.eventType}
              </span>
              {(item.date || item.time) && (
                <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
                  {item.date && <span>{item.date.split('-').reverse().join('/')}</span>}
                  {item.time && <span>• {item.time}</span>}
                </div>
              )}
            </div>
            
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <button 
                onClick={() => handleShareEvent(item)}
                className="p-1.5 text-neutral-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                title="Enviar lembrete pelo WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                title="Excluir compromisso"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-white font-medium text-lg mt-1">{item.description}</p>
            
            {item.classGroup && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-400 mt-2 bg-neutral-700/30 px-2 py-1 rounded-md w-max">
                <Users className="w-4 h-4" />
                Turma: {item.classGroup}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
