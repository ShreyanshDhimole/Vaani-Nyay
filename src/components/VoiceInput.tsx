
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, ArrowLeft, ArrowRight, HelpCircle, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  field: {
    key: string;
    label: string;
    type: string;
    section: string;
    options?: string[];
  };
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastField: boolean;
}

const VoiceInput = ({ 
  value, 
  onChange, 
  placeholder, 
  field, 
  onNext, 
  onPrevious, 
  canGoNext, 
  canGoPrevious, 
  isLastField 
}: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { translate } = useLanguage();

  const getFieldQuestion = (fieldKey: string) => {
    const questions = {
      'assemblyConstituencyNo': translate('question.assemblyConstituencyNo') || 'What is your Assembly Constituency Number?',
      'assemblyConstituencyName': translate('question.assemblyConstituencyName') || 'What is the name of your Assembly Constituency?',
      'parliamentaryConstituencyNo': translate('question.parliamentaryConstituencyNo') || 'What is your Parliamentary Constituency Number?',
      'parliamentaryConstituencyName': translate('question.parliamentaryConstituencyName') || 'What is the name of your Parliamentary Constituency?',
      'applicantName': translate('question.applicantName') || 'What is your full name?',
      'epicNo': translate('question.epicNo') || 'What is your EPIC (Voter ID) Number?',
      'aadhaarNumber': translate('question.aadhaarNumber') || 'What is your Aadhaar Number?',
      'mobileNoSelf': translate('question.mobileNoSelf') || 'What is your mobile number?',
      'mobileNoRelative': translate('question.mobileNoRelative') || 'What is your relative\'s mobile number?',
      'emailSelf': translate('question.emailSelf') || 'What is your email address?',
      'emailRelative': translate('question.emailRelative') || 'What is your relative\'s email address?',
      'shiftingReason': translate('question.shiftingReason') || 'What is the reason for shifting your residence?',
      'presentAddress.houseNo': translate('question.houseNo') || 'What is your house/building/apartment number?',
      'presentAddress.streetArea': translate('question.streetArea') || 'What is your street/area/locality/mohalla/road?',
      'presentAddress.townVillage': translate('question.townVillage') || 'What is your town/village name?',
      'presentAddress.postOffice': translate('question.postOffice') || 'What is your post office name?',
      'presentAddress.pinCode': translate('question.pinCode') || 'What is your PIN code?',
      'presentAddress.tehsilTaluka': translate('question.tehsilTaluka') || 'What is your tehsil/taluka/mandal name?',
      'presentAddress.district': translate('question.district') || 'What is your district name?',
      'presentAddress.stateUt': translate('question.stateUt') || 'What is your state/UT name?',
      'otherDocument': translate('question.otherDocument') || 'Please specify any other document you want to attach'
    };
    return questions[fieldKey] || field.label;
  };

  const getFieldExample = (fieldKey: string) => {
    const examples = {
      'assemblyConstituencyNo': translate('example.assemblyConstituencyNo') || 'e.g., 123',
      'assemblyConstituencyName': translate('example.assemblyConstituencyName') || 'e.g., Gandhi Nagar',
      'parliamentaryConstituencyNo': translate('example.parliamentaryConstituencyNo') || 'e.g., 45',
      'parliamentaryConstituencyName': translate('example.parliamentaryConstituencyName') || 'e.g., Delhi Central',
      'applicantName': translate('example.applicantName') || 'e.g., Raj Kumar Sharma',
      'epicNo': translate('example.epicNo') || 'e.g., ABC1234567',
      'aadhaarNumber': translate('example.aadhaarNumber') || 'e.g., 1234 5678 9012',
      'mobileNoSelf': translate('example.mobileNoSelf') || 'e.g., 9876543210',
      'mobileNoRelative': translate('example.mobileNoRelative') || 'e.g., 9876543210',
      'emailSelf': translate('example.emailSelf') || 'e.g., raj.sharma@gmail.com',
      'emailRelative': translate('example.emailRelative') || 'e.g., family@gmail.com',
      'shiftingReason': translate('example.shiftingReason') || 'e.g., Job transfer, Marriage, etc.',
      'presentAddress.houseNo': translate('example.houseNo') || 'e.g., A-123, Flat 405',
      'presentAddress.streetArea': translate('example.streetArea') || 'e.g., Main Street, Sector 15',
      'presentAddress.townVillage': translate('example.townVillage') || 'e.g., Delhi, Mumbai',
      'presentAddress.postOffice': translate('example.postOffice') || 'e.g., Central Post Office',
      'presentAddress.pinCode': translate('example.pinCode') || 'e.g., 110001',
      'presentAddress.tehsilTaluka': translate('example.tehsilTaluka') || 'e.g., Central Delhi',
      'presentAddress.district': translate('example.district') || 'e.g., New Delhi',
      'presentAddress.stateUt': translate('example.stateUt') || 'e.g., Delhi, Maharashtra',
      'otherDocument': translate('example.otherDocument') || 'e.g., Birth Certificate, Passport'
    };
    return examples[fieldKey] || '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canGoNext) {
        onNext();
      }
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value + ' ' + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Input Error",
          description: "Please try again or type your response.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Please type your response.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#141E28] flex flex-col">
      {/* Header */}
      <div className="bg-[#33FEBF] text-[#141E28] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-[#141E28] hover:bg-[#141E28]/10"
            >
              <Home className="w-4 h-4 mr-2" />
              {translate('button.home') || 'Home'}
            </Button>
            <div>
              <h1 className="text-xl font-bold">{translate('software.name') || 'Vaani Nyay'}</h1>
              <p className="text-sm opacity-80">{translate('forms.voterId') || 'Voter ID Application Form'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {translate('step.label') || 'Step'} {field.section.toUpperCase()} {translate('section.label') || 'SECTION'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl shadow-lg border border-[#33FEBF] bg-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Question */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#141E28] mb-2">
                  {getFieldQuestion(field.key)}
                </h2>
              </div>

              {/* Input with Help Icon */}
              <div className="relative">
                {field.type === 'textarea' ? (
                  <Textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="w-full text-lg p-4 border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-lg pr-12"
                    rows={4}
                  />
                ) : (
                  <Input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="w-full text-lg p-4 border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-lg pr-12"
                  />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#33FEBF] hover:bg-[#33FEBF]/10"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className="w-5 h-5" />
                </Button>
              </div>

              {/* Help Text */}
              {showHelp && (
                <div className="bg-[#33FEBF]/10 p-3 rounded-lg text-sm text-[#141E28]">
                  {getFieldExample(field.key)}
                </div>
              )}

              {/* Voice Input Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  className={`border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28] ${
                    isListening ? 'bg-[#33FEBF] text-[#141E28]' : ''
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      {translate('button.stopListening') || 'Stop Listening'}
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      {translate('button.useVoice') || 'Use Voice Input'}
                    </>
                  )}
                </Button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={onPrevious} 
                  disabled={!canGoPrevious}
                  className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {translate('button.previous') || 'Previous'}
                </Button>
                
                <Button 
                  onClick={onNext} 
                  disabled={!canGoNext}
                  className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
                >
                  {isLastField ? (translate('button.preview') || 'Preview Form') : (translate('button.next') || 'Next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceInput;
