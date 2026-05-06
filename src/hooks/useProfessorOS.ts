import { useState, useCallback, useEffect } from "react";
import { OSData, AgendaEvent, FinanceEvent } from "../types";
import { processVoiceCommand } from "../services/gemini";
import { v4 as uuidv4 } from "uuid";

export function useProfessorOS() {
  const [data, setData] = useState<OSData>({ agenda: [], finances: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReply, setLastReply] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('professor_os_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const persist = (newData: OSData) => {
    setData(newData);
    localStorage.setItem('professor_os_data', JSON.stringify(newData));
  };

  const processAudioText = useCallback(async (transcript: string) => {
    setIsProcessing(true);
    setLastReply(null);
    try {
      const now = new Date();
      const currentDateString = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      
      const result = await processVoiceCommand(transcript, currentDateString, JSON.stringify(data));
      
      const newAgenda: AgendaEvent[] = result.agenda.map(item => ({
        ...item,
        type: 'agenda',
        id: uuidv4(),
        createdAt: Date.now()
      }));

      const newFinances: FinanceEvent[] = result.finances.map(item => ({
        ...item,
        type: 'finance',
        id: uuidv4(),
        createdAt: Date.now()
      }));

      let updatedAgenda = [...data.agenda];
      let updatedFinances = [...data.finances];

      if (result.deletedEventIds && result.deletedEventIds.length > 0) {
        updatedAgenda = updatedAgenda.filter(item => !result.deletedEventIds.includes(item.id));
        updatedFinances = updatedFinances.filter(item => !result.deletedEventIds.includes(item.id));
      }

      persist({
        agenda: [...updatedAgenda, ...newAgenda],
        finances: [...updatedFinances, ...newFinances]
      });

      setLastReply(result.reply);

    } catch (e) {
      console.error(e);
      setLastReply("Ocorreu um erro ao processar seu comando. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  }, [data]);

  const addAgendaEvent = useCallback((event: Omit<AgendaEvent, 'id' | 'type' | 'createdAt'>) => {
    const newEvent: AgendaEvent = {
        ...event,
        type: 'agenda',
        id: uuidv4(),
        createdAt: Date.now()
    };
    persist({
        agenda: [...data.agenda, newEvent],
        finances: data.finances
    });
  }, [data]);

  const addFinanceEvent = useCallback((event: Omit<FinanceEvent, 'id' | 'type' | 'createdAt'>) => {
    const newEvent: FinanceEvent = {
        ...event,
        type: 'finance',
        id: uuidv4(),
        createdAt: Date.now()
    };
    persist({
        agenda: data.agenda,
        finances: [...data.finances, newEvent]
    });
  }, [data]);

  const deleteAgendaEvent = useCallback((id: string) => {
    persist({
        agenda: data.agenda.filter(e => e.id !== id),
        finances: data.finances
    });
  }, [data]);

  const deleteFinanceEvent = useCallback((id: string) => {
    persist({
        agenda: data.agenda,
        finances: data.finances.filter(e => e.id !== id)
    });
  }, [data]);

  return { data, isProcessing, lastReply, processAudioText, addAgendaEvent, addFinanceEvent, deleteAgendaEvent, deleteFinanceEvent };
}
