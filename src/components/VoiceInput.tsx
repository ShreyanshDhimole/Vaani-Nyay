
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  field: {
    key: string;
    label: string;
    type: string;
    options?: string[];
  };
}

const VoiceInput = ({ value, onChange, placeholder, field }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
        });
      };

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          const correctedText = applyCorrectionRules(transcript, field);
          setSuggestion(correctedText);
          setShowSuggestion(correctedText !== transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
    }
  }, [field]);

  const applyCorrectionRules = (text: string, field: { key: string; type: string; options?: string[] }) => {
    let corrected = text.trim();
    
    // Common corrections
    corrected = corrected.replace(/\bwon\b/gi, 'one');
    corrected = corrected.replace(/\btoo\b/gi, 'two');
    corrected = corrected.replace(/\bfour\b/gi, '4');
    corrected = corrected.replace(/\bate\b/gi, 'eight');
    
    // Name corrections
    if (field.key.includes('Name') || field.key === 'name') {
      corrected = corrected.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    
    // Date corrections
    if (field.key === 'dateOfBirth') {
      corrected = corrected.replace(/slash/gi, '/');
      corrected = corrected.replace(/dash/gi, '/');
    }
    
    // Gender corrections
    if (field.key === 'gender') {
      if (corrected.toLowerCase().includes('male') && !corrected.toLowerCase().includes('female')) {
        corrected = 'Male';
      } else if (corrected.toLowerCase().includes('female')) {
        corrected = 'Female';
      }
    }
    
    // Branch code formatting
    if (field.key === 'branchCode') {
      corrected = corrected.replace(/\s/g, '').toUpperCase();
    }
    
    return corrected;
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setTranscript('');
      setSuggestion('');
      setShowSuggestion(false);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const acceptSuggestion = () => {
    onChange(suggestion);
    setShowSuggestion(false);
    setTranscript('');
    setSuggestion('');
  };

  const rejectSuggestion = () => {
    onChange(transcript);
    setShowSuggestion(false);
    setTranscript('');
    setSuggestion('');
  };

  const playText = () => {
    const utterance = new SpeechSynthesisUtterance(value || transcript);
    speechSynthesis.speak(utterance);
  };

  const playQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(field.label);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          value={value || transcript}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border-[#33FEBF] focus:ring-[#33FEBF]"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={playText}
          disabled={!value && !transcript}
          className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-white"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={playQuestion}
          className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-white"
          title="Listen to question"
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`w-16 h-16 rounded-full ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-[#33FEBF] hover:bg-[#33FEBF]/90'
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>
      </div>
      
      {isListening && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-[#33FEBF]/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-[#33FEBF] rounded-full animate-bounce"></div>
            <span className="text-[#33FEBF] text-sm">Listening...</span>
          </div>
        </div>
      )}
      
      {transcript && (
        <div className="bg-gray-50 p-3 rounded-lg border border-[#33FEBF]">
          <p className="text-sm text-gray-600 mb-1">Recognized:</p>
          <p className="text-gray-800">{transcript}</p>
        </div>
      )}
      
      {showSuggestion && (
        <div className="bg-[#33FEBF]/10 border border-[#33FEBF] p-4 rounded-lg">
          <p className="text-sm text-[#141E28] mb-2">Auto-correction suggestion:</p>
          <div className="flex items-center justify-between">
            <p className="text-[#141E28] font-medium">{suggestion}</p>
            <div className="flex space-x-2">
              <Button size="sm" onClick={acceptSuggestion} className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]">
                <Check className="w-4 h-4 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={rejectSuggestion} className="border-[#33FEBF] text-[#33FEBF]">
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
