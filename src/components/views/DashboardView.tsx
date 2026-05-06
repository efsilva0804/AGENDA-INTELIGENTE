import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign, MapPin, Clock } from 'lucide-react';
import { AgendaEvent, FinanceEvent, OSData } from '../../types';

interface DashboardViewProps {
  data: OSData;
}

export function DashboardView({ data }: DashboardViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  // Get recent 3 events
  const recentEvents = [...data.agenda, ...data.finances]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const getEventsForDay = (date: Date) => {
    return data.agenda.filter(event => {
      if (!event.date) return false;
      const [year, month, day] = event.date.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-32">
      <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-400">
              <ChevronLeft className="w-5 h-5"/>
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-neutral-700 rounded-lg text-neutral-400">
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500 mb-2">
          <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={day.toISOString()} 
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg relative text-sm
                  ${isToday ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' : 'text-neutral-300 hover:bg-neutral-700/30'}
                `}
              >
                {format(day, 'd')}
                {hasEvents && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-3">Atividades Recentes</h3>
        <div className="flex flex-col gap-3">
          {recentEvents.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-4 bg-neutral-800/30 rounded-xl border border-neutral-800">
              Nenhuma atividade recente.
            </p>
          ) : (
            recentEvents.map(item => (
               <div key={item.id} className="bg-neutral-800/50 border border-neutral-700/50 p-4 rounded-xl flex flex-col gap-2">
                {item.type === 'agenda' ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {item.eventType.toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{item.description}</span>
                    <div className="text-xs text-neutral-400 flex gap-2">
                      {item.date && <span>{item.date}</span>}
                      {item.time && <span>{item.time}</span>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`flex justify-between text-xs font-semibold ${item.financeType === 'Receita' ? 'text-teal-400' : 'text-rose-400'}`}>
                      <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {item.financeType.toUpperCase()}</div>
                      <span className="text-sm">R$ {item.amount.toFixed(2)}</span>
                    </div>
                    <span className="text-white font-medium">{item.description}</span>
                    <span className="text-xs text-neutral-400 bg-neutral-700/50 px-2 py-0.5 rounded w-max">{item.category}</span>
                  </>
                )}
               </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
