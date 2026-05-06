import { useState } from 'react';
import { OSData } from '../../types';
import { MessageSquare, CheckCircle2, ChevronRight, Share2, FileJson, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isSameDay } from 'date-fns';

export function ReportsView({ data }: { data: OSData }) {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "professor_os_backup.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSendReminder = () => {
    setIsSending(true);
    
    const today = new Date();
    // Assuming date format YYYY-MM-DD for agenda
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const todaysAgenda = data.agenda.filter(item => item.date === todayStr);
    const todaysFinances = data.finances.filter(item => isSameDay(new Date(item.createdAt), today));
    
    let message = `*Relatório Professor OS* 🧠\n*Data:* ${today.toLocaleDateString('pt-BR')}\n\n`;
    
    message += `*🗓️ Agenda de Hoje (${todaysAgenda.length}):*\n`;
    if (todaysAgenda.length > 0) {
      todaysAgenda.forEach(e => {
        message += `• ${e.time || '--:--'} - ${e.eventType}: ${e.description} ${e.classGroup ? `(Turma: ${e.classGroup})` : ''}\n`;
      });
    } else {
      message += `Sem compromissos para hoje.\n`;
    }
    
    message += `\n*💰 Finanças de Hoje:*\n`;
    let income = 0;
    let expense = 0;
    todaysFinances.forEach(f => {
      if (f.financeType === 'Receita') income += f.amount;
      else expense += f.amount;
    });
    
    message += `🟢 Receitas: R$ ${income.toFixed(2)}\n`;
    message += `🔴 Despesas: R$ ${expense.toFixed(2)}\n\n`;
    
    if (todaysFinances.length > 0) {
      message += `*Transações:*\n`;
      todaysFinances.forEach(f => {
        message += `• ${f.financeType === 'Receita' ? '🟢' : '🔴'} R$ ${f.amount.toFixed(2)} - ${f.description}\n`;
      });
    } else {
      message += `Sem movimentações financeiras no dia.\n`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      window.open(whatsappUrl, '_blank');
      setTimeout(() => setSentSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-32">
      <h2 className="text-xl font-bold text-white">Relatórios e Integrações</h2>

      <div className="flex flex-col gap-4">
        <h3 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider">Exportar Dados</h3>
        
        <button 
          onClick={handleDownloadJSON}
          className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700/80 transition-colors p-4 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <FileJson className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-white font-medium text-left">Exportar Backup (JSON)</span>
              <span className="text-xs text-neutral-400 text-left">Baixe um arquivo com todos os dados</span>
            </div>
          </div>
          <ChevronRight className="text-neutral-500" />
        </button>

        <button 
          onClick={() => alert("Exportação para CSV em desenvolvimento.")}
          className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700/80 transition-colors p-4 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-white font-medium text-left">Planilha (CSV)</span>
              <span className="text-xs text-neutral-400 text-left">Relatório financeiro mensal</span>
            </div>
          </div>
          <ChevronRight className="text-neutral-500" />
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
         <h3 className="text-neutral-400 text-sm font-semibold uppercase tracking-wider">Assistente Ativo</h3>
         
         <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500/10 text-green-400 rounded-lg shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white font-medium">Disparo Automático (WhatsApp/Telegram)</span>
                <span className="text-sm text-neutral-400">
                  Acione um alerta no seu aplicativo de mensagens de preferência sobre o próximo compromisso no calendário e possíveis alertas de gastos no mês.
                </span>
              </div>
            </div>

            <button
              onClick={handleSendReminder}
              disabled={isSending || sentSuccess}
              className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                sentSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  Conectando API...
                </span>
              ) : sentSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Lembrete Disparado!
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" /> Disparar Lembrete Agora
                </>
              )}
            </button>
         </div>
      </div>
    </div>
  );
}
