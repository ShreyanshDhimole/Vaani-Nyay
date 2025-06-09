import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { translate } = useLanguage();
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
    if (field.key.includes('Name') || field.key === 'name' || field.key === 'applicantName') {
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
    
    // Address corrections
    if (field.key.includes('address') || field.key.includes('Address')) {
      corrected = corrected.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
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
    <>
      {/* Full screen overlay when listening */}
      {isListening && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto p-12">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-[#141E28] mb-6">
                {field.label}
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                Speak clearly into your microphone
              </p>
            </div>
            
            <div className="mb-12">
              <Button
                type="button"
                onClick={stopListening}
                className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-600 animate-pulse text-white"
              >
                <MicOff className="w-12 h-12" />
              </Button>
            </div>
            
            {transcript && (
              <div className="bg-[#33FEBF]/20 p-8 rounded-xl border-2 border-[#33FEBF] max-w-2xl mx-auto">
                <p className="text-lg text-[#141E28] mb-4 font-medium">Recognized:</p>
                <p className="text-2xl text-[#141E28] font-bold">{transcript}</p>
              </div>
            )}
            
            <div className="mt-12">
              <div className="inline-flex items-center space-x-3 bg-[#33FEBF]/20 px-8 py-4 rounded-full">
                <div className="w-4 h-4 bg-[#33FEBF] rounded-full animate-bounce"></div>
                <span className="text-[#33FEBF] text-xl font-semibold">Listening...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full screen input interface when not listening */}
      {!isListening && (
        <div className="fixed inset-0 bg-white z-40 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#141E28] mb-4">
                {field.label}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <Input
                  value={value || transcript}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 border-2 border-[#33FEBF] focus:ring-[#33FEBF] text-xl p-6 rounded-xl"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={playText}
                  disabled={!value && !transcript}
                  className="border-2 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-white h-16 w-16 rounded-xl"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={playQuestion}
                  className="border-2 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-white h-16 w-16 rounded-xl"
                  title="Listen to question"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className="w-24 h-24 rounded-full bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
                >
                  <Mic className="w-10 h-10" />
                </Button>
              </div>
              
              {showSuggestion && (
                <div className="bg-[#33FEBF]/10 border-2 border-[#33FEBF] p-6 rounded-xl max-w-2xl mx-auto">
                  <p className="text-lg text-[#141E28] mb-4 font-medium">Auto-correction suggestion:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#141E28] font-semibold text-xl">{suggestion}</p>
                    <div className="flex space-x-3">
                      <Button size="lg" onClick={acceptSuggestion} className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]">
                        <Check className="w-5 h-5 mr-2" />
                        Accept
                      </Button>
                      <Button size="lg" variant="outline" onClick={rejectSuggestion} className="border-2 border-[#33FEBF] text-[#33FEBF]">
                        <X className="w-5 h-5 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceInput;
