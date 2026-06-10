import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Map of language codes to SpeechRecognition language codes
const LANGUAGE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

export function useVoiceNav() {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [navigatedTo, setNavigatedTo] = useState('');
  
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
    
    return () => {
      if (recognitionRef.current) {
        shouldListenRef.current = false;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    shouldListenRef.current = true;
    setIsListening(true);
    
    const startRecognition = () => {
      if (!shouldListenRef.current) return;
      
      const recognition = new SpeechRecognition();
      recognition.lang = LANGUAGE_MAP[i18n.language] || 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setNavigatedTo('');
      };
      
      recognition.onend = () => {
        if (shouldListenRef.current) {
            setTimeout(() => {
               if (shouldListenRef.current) startRecognition();
            }, 100);
        } else {
            setIsListening(false);
        }
      };
      
      recognition.onerror = (event) => {
         console.warn("Speech recognition error", event.error);
         if (event.error === 'not-allowed' || event.error === 'audio-capture') {
            shouldListenRef.current = false;
            setIsListening(false);
         }
      };

      recognition.onresult = (event) => {
        if (!event.results || event.results.length === 0) return;
        const lastIndex = event.results.length - 1;
        const spoken = event.results[lastIndex][0].transcript.toLowerCase().trim();
        setTranscript(spoken);
        
        const commandsMap = t('voice.commandsMap', { returnObjects: true });
        const commands = t('voice.commands', { returnObjects: true });

        let routePath = '';
        let matchedPhrase = '';

        if (commandsMap && typeof commandsMap === 'object' && !Array.isArray(commandsMap)) {
          const routeKeys = {
            dashboard: '/dashboard',
            scam: '/scam',
            twin: '/twin',
            schemes: '/schemes',
            docs: '/docs',
          };
          for (const [key, phrases] of Object.entries(commandsMap)) {
            if (Array.isArray(phrases)) {
              const found = phrases.find(p => spoken.includes(p.toLowerCase()));
              if (found) {
                routePath = routeKeys[key];
                matchedPhrase = found;
                break;
              }
            }
          }
        }

        if (!routePath && Array.isArray(commands)) {
          const routeList = ['/dashboard', '/scam', '/twin', '/schemes', '/docs'];
          for (let i = 0; i < commands.length; i++) {
            if (spoken.includes(commands[i].toLowerCase())) {
              routePath = routeList[i];
              matchedPhrase = commands[i];
              break;
            }
          }
        }

        if (routePath) {
          shouldListenRef.current = false;
          setNavigatedTo(matchedPhrase);
          recognition.stop();
          setTimeout(() => {
            navigate(routePath);
            setNavigatedTo('');
          }, 800);
        }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    };
    
    startRecognition();
    
  }, [isListening, i18n.language, navigate, t]);

  return { toggleListening, isListening, transcript, supported, navigatedTo };
}
