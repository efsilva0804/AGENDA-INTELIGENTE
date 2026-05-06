export interface AgendaEvent {
  id: string;
  type: 'agenda';
  eventType: string;
  date: string;
  time: string;
  classGroup?: string;
  description: string;
  createdAt: number;
}

export interface FinanceEvent {
  id: string;
  type: 'finance';
  financeType: 'Receita' | 'Despesa';
  amount: number;
  category: string;
  paymentMethod: string;
  description: string;
  createdAt: number;
}

export type ViewState = 'dashboard' | 'agenda' | 'finances' | 'reports';

export type OSData = {
  agenda: AgendaEvent[];
  finances: FinanceEvent[];
};
