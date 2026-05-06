import { GoogleGenAI, Type } from "@google/genai";
import { AgendaEvent, FinanceEvent } from "../types";

export interface ProcessorResult {
  agenda: Omit<AgendaEvent, 'id' | 'createdAt' | 'type'>[];
  finances: Omit<FinanceEvent, 'id' | 'createdAt' | 'type'>[];
  deletedEventIds: string[];
  reply: string; 
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processVoiceCommand(transcript: string, currentDate: string, currentDataSummary: string): Promise<ProcessorResult> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      agenda: {
        type: Type.ARRAY,
        description: "Lista de eventos de agenda a serem agendados ou lembrados.",
        items: {
          type: Type.OBJECT,
          properties: {
            eventType: { type: Type.STRING, description: "Tipo: Aula, Reunião, Correção, Lembrete, etc." },
            date: { type: Type.STRING, description: "Data em formato ISO YYYY-MM-DD. Use o contexto da data de hoje para resolver datas relativas." },
            time: { type: Type.STRING, description: "Hora no formato HH:mm" },
            classGroup: { type: Type.STRING, description: "Turma associada, se houver. Ex: 8º ano" },
            description: { type: Type.STRING, description: "Detalhes do evento." }
          },
          required: ["eventType", "date", "description"]
        }
      },
      finances: {
        type: Type.ARRAY,
        description: "Lista de registros financeiros a serem guardados.",
        items: {
          type: Type.OBJECT,
          properties: {
            financeType: { type: Type.STRING, description: "Receita ou Despesa" },
            amount: { type: Type.NUMBER, description: "Valor extraído" },
            category: { type: Type.STRING, description: "Categoria: Papelaria, Transporte, Alimentação, etc." },
            paymentMethod: { type: Type.STRING, description: "Dinheiro, Cartão, Pix, etc." },
            description: { type: Type.STRING, description: "Detalhes do registro." }
          },
          required: ["financeType", "amount", "description"]
        }
      },
      deletedEventIds: {
        type: Type.ARRAY,
        description: "Lista de IDs de eventos (agenda ou finanças) que o usuário solicitou excluir ou cancelar.",
        items: {
          type: Type.STRING
        }
      },
      reply: {
        type: Type.STRING,
        description: "Uma resposta amigável de voz sintetizando o que foi feito ou respondendo uma pergunta em texto curto. (ex: 'Gasto de 45 reais adicionado.', ou 'Você gastou 100 reais este mês.')"
      }
    },
    required: ["agenda", "finances", "deletedEventIds", "reply"]
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hoje é ${currentDate}.
Abaixo estão os dados atuais resumidos que o sistema já tem anotado, caso você precise deles para responder uma pergunta (em 'reply') ou para ver se o gasto/agenda mencionado já existia e era só uma atualização de contexto (não recrie gastos duplicados desnecessariamente, caso a transcrição indique que o evento apenas complementa a informação atual extraia novamente com informações adicionadas caso as extrações anteriores sejam incompletas), ou caso o usuário peça para excluir um evento.
Dados Atuais (JSON):
${currentDataSummary}

Transcrição do Áudio do Professor: "${transcript}"

Siga o System Prompt e extraia/responda e coloque os resultados de agenda e finanças (somente os novos/novamente preenchidos a serem adicionados), IDs para exclusão ('deletedEventIds') ou uma resposta.`,
    config: {
      systemInstruction: "Você é o 'Professor OS', um assistente virtual ultra-inteligente focado em ajudar professores com sua agenda diária e fluxo de caixa de forma zero-UI através da voz. Extraia dados de agenda e finanças com precisão baseados no texto. Se o professor fizer uma pergunta geral ou consultar algo, forneça a resposta em 'reply'.",
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.1
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Resposta em branco do Gemini");
  }

  return JSON.parse(text);
}
