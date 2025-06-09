import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, Check, X, ArrowLeft, ArrowRight, Home, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

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
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastField?: boolean;
}

const getFieldExample = (fieldKey: string) => {
  const examples: { [key: string]: string } = {
    assemblyConstituencyNo: 'e.g., 123',
    assemblyConstituencyName: 'e.g., Rajouri Garden',
    parliamentaryConstituencyNo: 'e.g., 7',
    parliamentaryConstituencyName: 'e.g., New Delhi',
    applicantName: 'e.g., John Doe',
    epicNo: 'e.g., ABC1234567',
    aadhaarNumber: 'e.g., 1234 5678 9012',
    mobileNoSelf: 'e.g., 9876543210',
    mobileNoRelative: 'e.g., 9876543211',
    emailSelf: 'e.g., john@example.com',
    emailRelative: 'e.g., parent@example.com',
    shiftingReason: 'e.g., Job transfer',
    'presentAddress.houseNo': 'e.g., A-123',
    'presentAddress.streetArea': 'e.g., Main Street',
    'presentAddress.townVillage': 'e.g., Delhi',
    'presentAddress.postOffice': 'e.g., Central Post Office',
    'presentAddress.pinCode': 'e.g., 110001',
    'presentAddress.tehsilTaluka': 'e.g., Central Delhi',
    'presentAddress.district': 'e.g., New Delhi',
    'presentAddress.stateUt': 'e.g., Delhi',
    otherDocument: 'e.g., Property tax receipt'
  };
  return examples[fieldKey] || 'Enter your information here';
};

const VoiceInput = ({ 
  value, 
  onChange, 
  placeholder, 
  field, 
  onNext, 
  onPrevious, 
  canGoNext = true, 
  canGoPrevious = true,
  isLastField = false 
}: VoiceInputProps) => {
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [showExample, setShowExample] = useState(false);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onNext && canGoNext) {
      onNext();
    }
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
        <div className="fixed inset-0 bg-white z-40 flex flex-col">
          {/* Header with navigation */}
          <div className="bg-[#33FEBF] text-[#141E28] p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="text-[#141E28] hover:bg-[#141E28] hover:text-[#33FEBF]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {translate('button.previous')}
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-[#141E28] hover:bg-[#141E28] hover:text-[#33FEBF]"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <h2 className="text-xl font-bold text-center flex-1">
                {field.label}?
              </h2>
              
              <Button
                variant="ghost"
                onClick={onNext}
                disabled={!canGoNext}
                className="text-[#141E28] hover:bg-[#141E28] hover:text-[#33FEBF]"
              >
                {isLastField ? translate('button.preview') : translate('button.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      value={value || transcript}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={placeholder}
                      className="border-2 border-[#33FEBF] focus:ring-[#33FEBF] text-xl p-6 rounded-xl pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowExample(!showExample)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#33FEBF] hover:bg-[#33FEBF] hover:text-white"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </Button>
                  </div>
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

                {showExample && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                    <p className="text-blue-800 font-medium">Example:</p>
                    <p className="text-blue-600">{getFieldExample(field.key)}</p>
                  </div>
                )}
                
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
        </div>
      )}
    </>
  );
};

export default VoiceInput;
