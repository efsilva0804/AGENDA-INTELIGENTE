import { useState, useEffect, useRef } from 'react';

export function useSpeech(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onerror = (event: any) => {
      console.error('Erro de gravação:', event.error);
      setIsRecording(false);
      setError(`Erro no microfone: ${event.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      onTranscript(transcript);
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  return { isRecording, startRecording, stopRecording, error };
}
