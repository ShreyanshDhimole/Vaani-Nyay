
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';
import VoterIdPreview from './VoterIdPreview';

interface FormData {
  assemblyConstituencyNo: string;
  assemblyConstituencyName: string;
  parliamentaryConstituencyNo: string;
  parliamentaryConstituencyName: string;
  applicantName: string;
  epicNo: string;
  aadhaarNumber: string;
  noAadhaar: boolean;
  mobileNoSelf: string;
  mobileNoRelative: string;
  emailSelf: string;
  emailRelative: string;
  applicationType: string;
  shiftingReason: string;
  presentAddress: {
    houseNo: string;
    streetArea: string;
    ordinary: string;
    townVillage: string;
    postOffice: string;
    residence: string;
    pinCode: string;
    tehsilTaluka: string;
    district: string;
    stateUt: string;
  };
  documentsAvailable: string[];
  otherDocument: string;
}

const VoterIdForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    assemblyConstituencyNo: '',
    assemblyConstituencyName: '',
    parliamentaryConstituencyNo: '',
    parliamentaryConstituencyName: '',
    applicantName: '',
    epicNo: '',
    aadhaarNumber: '',
    noAadhaar: false,
    mobileNoSelf: '',
    mobileNoRelative: '',
    emailSelf: '',
    emailRelative: '',
    applicationType: '',
    shiftingReason: '',
    presentAddress: {
      houseNo: '',
      streetArea: '',
      ordinary: '',
      townVillage: '',
      postOffice: '',
      residence: '',
      pinCode: '',
      tehsilTaluka: '',
      district: '',
      stateUt: ''
    },
    documentsAvailable: [],
    otherDocument: ''
  });

  const formFields = [
    { key: 'assemblyConstituencyNo', label: 'Assembly Constituency Number', type: 'text', section: 'constituency' },
    { key: 'assemblyConstituencyName', label: 'Assembly Constituency Name', type: 'text', section: 'constituency' },
    { key: 'parliamentaryConstituencyNo', label: 'Parliamentary Constituency Number', type: 'text', section: 'constituency' },
    { key: 'parliamentaryConstituencyName', label: 'Parliamentary Constituency Name', type: 'text', section: 'constituency' },
    { key: 'applicantName', label: 'Name of the Applicant', type: 'text', section: 'personal' },
    { key: 'epicNo', label: 'EPIC Number', type: 'text', section: 'personal' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', section: 'personal' },
    { key: 'mobileNoSelf', label: 'Mobile Number of Self', type: 'text', section: 'contact' },
    { key: 'mobileNoRelative', label: 'Mobile Number of Father/Mother/Any other relative', type: 'text', section: 'contact' },
    { key: 'emailSelf', label: 'Email ID of Self', type: 'email', section: 'contact' },
    { key: 'emailRelative', label: 'Email ID of Father/Mother/Any other relative', type: 'email', section: 'contact' },
    { 
      key: 'applicationType', 
      label: 'I submit application for (Tick any one of the following)', 
      type: 'radio', 
      section: 'application',
      options: [
        'Shifting of Residence',
        'Correction of Entries in Existing Electoral Roll',
        'Issue of Replacement EPIC without correction',
        'Request for marking as Person with Disability'
      ]
    },
    { key: 'shiftingReason', label: 'Application for Shifting of Residence - Reason', type: 'textarea', section: 'application' },
    { key: 'presentAddress.houseNo', label: 'House/Building/Apartment Number', type: 'text', section: 'address' },
    { key: 'presentAddress.streetArea', label: 'Street/Area/Locality/Mohalla/Road', type: 'text', section: 'address' },
    { key: 'presentAddress.townVillage', label: 'Town/Village', type: 'text', section: 'address' },
    { key: 'presentAddress.postOffice', label: 'Post Office', type: 'text', section: 'address' },
    { key: 'presentAddress.pinCode', label: 'PIN Code', type: 'text', section: 'address' },
    { key: 'presentAddress.tehsilTaluka', label: 'Tehsil/Taluka/Mandal', type: 'text', section: 'address' },
    { key: 'presentAddress.district', label: 'District', type: 'text', section: 'address' },
    { key: 'presentAddress.stateUt', label: 'State/UT', type: 'text', section: 'address' },
    {
      key: 'documentsAvailable',
      label: 'Self-attested copy of address proof (Tick relevant documents)',
      type: 'checkbox',
      section: 'documents',
      options: [
        'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
        'Current passbook of Nationalised/Scheduled Bank/Post Office',
        'Revenue Department\'s Land Owning records including Kisan Bahi',
        'Registered Rent Lease Deed (In case of tenant)',
        'Aadhaar Card',
        'Indian Passport',
        'Registered Sale Deed (In case of own house)'
      ]
    },
    { key: 'otherDocument', label: 'Any Other Document (Please Specify)', type: 'text', section: 'documents' }
  ];

  const handleInputChange = (key: string, value: string | boolean | string[]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const getCurrentValue = (key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      return (formData[parent as keyof FormData] as any)?.[child] || '';
    }
    return formData[key as keyof FormData] as string || '';
  };

  const nextStep = () => {
    if (currentStep < formFields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentField = formFields[currentStep];

  if (showPreview) {
    return (
      <VoterIdPreview
        formData={formData}
        onBack={() => setShowPreview(false)}
        onEdit={(field: string) => {
          const fieldIndex = formFields.findIndex(f => f.key === field);
          if (fieldIndex !== -1) {
            setCurrentStep(fieldIndex);
            setShowPreview(false);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#141E28] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="mb-4 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forms
          </Button>
          
          <div className="bg-[#33FEBF] text-[#141E28] p-2 rounded mb-4">
            <p className="text-sm font-medium">
              Step {currentStep + 1} of {formFields.length} - {currentField.section.toUpperCase()} SECTION
            </p>
            <div className="w-full bg-[#141E28] rounded-full h-2 mt-2">
              <div 
                className="bg-[#33FEBF] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentStep + 1) / formFields.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-[#33FEBF] text-[#141E28]">
            <CardTitle className="text-xl text-center">
              Voter Application Form - Election Commission of India (Form-8)
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 bg-white">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#141E28] mb-4">
                  {currentField.label}
                </h2>
              </div>

              {currentField.type === 'radio' && (
                <div className="space-y-4">
                  {currentField.options?.map((option) => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={currentField.key}
                        value={option}
                        checked={getCurrentValue(currentField.key) === option}
                        onChange={(e) => handleInputChange(currentField.key, e.target.value)}
                        className="w-4 h-4 text-[#33FEBF]"
                      />
                      <span className="text-[#141E28]">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentField.type === 'checkbox' && (
                <div className="space-y-4">
                  {currentField.options?.map((option) => (
                    <label key={option} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option}
                        checked={(formData.documentsAvailable || []).includes(option)}
                        onChange={(e) => {
                          const currentDocs = formData.documentsAvailable || [];
                          if (e.target.checked) {
                            handleInputChange('documentsAvailable', [...currentDocs, option]);
                          } else {
                            handleInputChange('documentsAvailable', currentDocs.filter(doc => doc !== option));
                          }
                        }}
                        className="w-4 h-4 text-[#33FEBF] mt-1"
                      />
                      <span className="text-[#141E28] text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {!['radio', 'checkbox'].includes(currentField.type) && (
                <VoiceInput
                  value={getCurrentValue(currentField.key)}
                  onChange={(value) => handleInputChange(currentField.key, value)}
                  placeholder={`Enter ${currentField.label.toLowerCase()}`}
                  field={currentField}
                />
              )}

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button 
                  onClick={nextStep} 
                  className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
                >
                  {currentStep === formFields.length - 1 ? 'Preview Form' : 'Next'}
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

export default VoterIdForm;
