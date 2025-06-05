
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';
import FormPreview from './FormPreview';

interface FormData {
  branchName: string;
  branchCode: string;
  customerId: string;
  accountNo: string;
  ckyc: string;
  applicationType: string;
  name: string;
  maidenName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  dependents: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  guardianName: string;
  guardianRelation: string;
  nationality: string;
  citizenship: string;
}

const BankAccountForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    branchName: '',
    branchCode: '',
    customerId: '',
    accountNo: '',
    ckyc: '',
    applicationType: 'New',
    name: '',
    maidenName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    dependents: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    guardianName: '',
    guardianRelation: '',
    nationality: '',
    citizenship: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [useVoice, setUseVoice] = useState(false);

  const formFields = [
    { key: 'branchName', label: 'Branch Name', type: 'text', required: true },
    { key: 'branchCode', label: 'Branch Code', type: 'text', required: true },
    { key: 'customerId', label: 'Customer ID', type: 'text', required: false },
    { key: 'ckyc', label: 'CKYC Number', type: 'text', required: true },
    { key: 'name', label: 'Full Name', type: 'text', required: true },
    { key: 'maidenName', label: 'Maiden Name (if applicable)', type: 'text', required: false },
    { key: 'dateOfBirth', label: 'Date of Birth (DD/MM/YYYY)', type: 'date', required: true },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Third Gender'], required: true },
    { key: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Married', 'Unmarried', 'Others'], required: true },
    { key: 'dependents', label: 'Number of Dependents', type: 'number', required: false },
    { key: 'fatherName', label: 'Father\'s Name', type: 'text', required: true },
    { key: 'motherName', label: 'Mother\'s Name', type: 'text', required: false },
    { key: 'spouseName', label: 'Spouse Name (if married)', type: 'text', required: false },
    { key: 'nationality', label: 'Nationality', type: 'select', options: ['In-Indian', 'Others'], required: true },
    { key: 'citizenship', label: 'Citizenship', type: 'text', required: true }
  ];

  const currentField = formFields[currentStep];
  const progress = ((currentStep + 1) / formFields.length) * 100;

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentField.key]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < formFields.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setShowPreview(true);
  };

  const canProceed = () => {
    if (currentField.required) {
      return formData[currentField.key as keyof FormData].trim() !== '';
    }
    return true;
  };

  if (showPreview) {
    return <FormPreview formData={formData} onBack={() => setShowPreview(false)} onEdit={(field) => {
      const fieldIndex = formFields.findIndex(f => f.key === field);
      if (fieldIndex !== -1) {
        setCurrentStep(fieldIndex);
        setShowPreview(false);
      }
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#33FEBF]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {formFields.length}
              </span>
              <span className="text-sm font-medium text-[#33FEBF]">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="shadow-lg border border-[#33FEBF]">
          <CardHeader className="bg-[#33FEBF] text-[#141E28] rounded-t-lg">
            <CardTitle className="text-center">
              SBI Account Opening Form - Part I
            </CardTitle>
            <p className="text-center text-[#141E28]/80 text-sm">
              Customer Information Sheet (CIF Creation/Amendment)
            </p>
          </CardHeader>
          
          <CardContent className="p-8 bg-white">
            <div className="mb-6">
              <Label className="text-lg font-medium text-[#141E28]">
                {currentField.label}
                {currentField.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Field {currentStep + 1} of {formFields.length}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant={!useVoice ? "default" : "outline"}
                  onClick={() => setUseVoice(false)}
                  className={`flex-1 ${!useVoice ? 'bg-[#33FEBF] text-[#141E28] hover:bg-[#33FEBF]/90' : 'border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]'}`}
                >
                  Text Input
                </Button>
                <Button
                  variant={useVoice ? "default" : "outline"}
                  onClick={() => setUseVoice(true)}
                  className={`flex-1 ${useVoice ? 'bg-[#33FEBF] text-[#141E28] hover:bg-[#33FEBF]/90' : 'border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]'}`}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Input
                </Button>
              </div>

              {useVoice ? (
                <VoiceInput
                  value={formData[currentField.key as keyof FormData]}
                  onChange={handleInputChange}
                  placeholder={`Speak your ${currentField.label.toLowerCase()}...`}
                  field={currentField}
                />
              ) : (
                <div>
                  {currentField.type === 'select' ? (
                    <select
                      value={formData[currentField.key as keyof FormData]}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full p-3 border border-[#33FEBF] rounded-lg focus:ring-2 focus:ring-[#33FEBF] focus:border-transparent"
                    >
                      <option value="">Select {currentField.label}</option>
                      {currentField.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={currentField.type}
                      value={formData[currentField.key as keyof FormData]}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={`Enter your ${currentField.label.toLowerCase()}`}
                      className="w-full p-3 text-lg border-[#33FEBF] focus:ring-[#33FEBF]"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28] disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="text-[#33FEBF] border-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              {currentStep === formFields.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28] disabled:opacity-50"
                >
                  Complete Form
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28] disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankAccountForm;
