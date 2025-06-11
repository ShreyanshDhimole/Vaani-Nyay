import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CharacterBoxes from './CharacterBoxes';
import { generateVoterIdPDF } from '@/services/pdfService';
import { useLanguage } from '@/contexts/LanguageContext';

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

interface VoterIdPreviewProps {
  formData: FormData;
  onBack: () => void;
  onEdit: (field: string) => void;
}

const VoterIdPreview = ({ formData, onBack, onEdit }: VoterIdPreviewProps) => {
  const { translate, selectedLanguage } = useLanguage();

  const handleSubmit = () => {
    toast({
      title: translate('toast.submitSuccess') || "Form Submitted Successfully!",
      description: translate('toast.submitDescription') || "Your voter ID application has been submitted for processing.",
    });
  };

  const handleDownload = async () => {
    try {
      await generateVoterIdPDF(formData, selectedLanguage);
      toast({
        title: translate('toast.downloadStarted') || "Download Started",
        description: translate('toast.downloadDescription') || "Your form is being downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: translate('toast.downloadFailed') || "Download Failed", 
        description: translate('toast.downloadError') || "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="mb-4 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {translate('button.back')}
          </Button>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-white border-b border-black">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 border border-black bg-white flex items-center justify-center">
                  <img src="/lovable-uploads/d3aeee09-31ae-4fd2-b005-ed8ee73cb35a.png" alt="ECI Logo" className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-sm font-medium">{translate('preview.dateNotification') || 'Date of Notification:'}</p>
                  <CardTitle className="text-lg font-bold mt-2">
                    {translate('preview.electionCommission') || 'ELECTION COMMISSION OF INDIA'}
                  </CardTitle>
                  <p className="text-sm font-medium">{translate('preview.form8') || 'Form-8'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{translate('preview.formNo') || 'FORM No.'}</p>
                  <p className="text-xs">{translate('preview.filledByOffice') || '(To be filled by office)'}</p>
                </div>
              </div>
              <p className="text-sm font-medium">
                {translate('preview.formTitle') || 'Voter Application Form for Shifting of Residence/Correction of Entries in Existing Electoral Roll/Replacement of EPIC/Marking of PwD'}
              </p>
              <p className="text-xs">
                {translate('preview.rules') || '(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)'}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6 bg-white">
            {/* Address Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">{translate('preview.to')}</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm">{translate('preview.electoralOfficer')}</span><br/>
                    <span className="text-sm">{translate('preview.assemblyConstituency')}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm">{translate('preview.no') || 'No.'}</span>
                      <CharacterBoxes text={formData.assemblyConstituencyNo} maxLength={3} onEdit={() => onEdit('assemblyConstituencyNo')} />
                      <span className="text-sm ml-4">{translate('preview.name') || 'Name'}</span>
                      <CharacterBoxes text={formData.assemblyConstituencyName} maxLength={25} onEdit={() => onEdit('assemblyConstituencyName')} />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm">{translate('preview.parliamentaryConstituency')}</span><br/>
                    <span className="text-xs">{translate('preview.unionTerritory')}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm">{translate('preview.no') || 'No.'}</span>
                      <CharacterBoxes text={formData.parliamentaryConstituencyNo} maxLength={3} onEdit={() => onEdit('parliamentaryConstituencyNo')} />
                      <span className="text-sm ml-4">{translate('preview.name') || 'Name'}</span>
                      <CharacterBoxes text={formData.parliamentaryConstituencyName} maxLength={25} onEdit={() => onEdit('parliamentaryConstituencyName')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name Section */}
            <div className="border border-black">
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm font-medium">{translate('preview.applicantName')}</span>
                  <CharacterBoxes text={formData.applicantName} maxLength={30} onEdit={() => onEdit('applicantName')} />
                </div>
              </div>
            </div>

            {/* EPIC and Aadhaar Section */}
            <div className="border border-black">
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">{translate('preview.epicNo')}</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.epicNo} maxLength={10} onEdit={() => onEdit('epicNo')} />
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">{translate('preview.aadhaarDetails')}</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">(a)</span>
                      <input type="checkbox" checked={!!formData.aadhaarNumber} readOnly />
                      <span className="text-sm">{translate('preview.aadhaarNumber')}</span>
                      <CharacterBoxes text={formData.aadhaarNumber} maxLength={12} onEdit={() => onEdit('aadhaarNumber')} />
                      <span className="text-sm">{translate('preview.or') || 'or'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">(b)</span>
                      <input type="checkbox" checked={formData.noAadhaar} readOnly />
                      <span className="text-sm">{translate('preview.noAadhaar')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border border-black">
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">{translate('preview.mobileNoSelf')}</span>
                  <div className="mt-1">
                    <CharacterBoxes text={formData.mobileNoSelf} maxLength={10} onEdit={() => onEdit('mobileNoSelf')} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">{translate('preview.mobileNoRelative')}</span>
                  <div className="mt-1">
                    <CharacterBoxes text={formData.mobileNoRelative} maxLength={10} onEdit={() => onEdit('mobileNoRelative')} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">{translate('preview.emailSelf')}</span>
                  <div className="mt-1 border-b border-black pb-1">
                    <span className="text-sm">{formData.emailSelf}</span>
                    {formData.emailSelf && (
                      <button onClick={() => onEdit('emailSelf')} className="ml-2 text-[#33FEBF] text-xs underline">
                        {translate('preview.edit')}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">{translate('preview.emailRelative')}</span>
                  <div className="mt-1 border-b border-black pb-1">
                    <span className="text-sm">{formData.emailRelative}</span>
                    {formData.emailRelative && (
                      <button onClick={() => onEdit('emailRelative')} className="ml-2 text-[#33FEBF] text-xs underline">
                        {translate('preview.edit')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Type */}
            <div className="border border-black">
              <div className="p-4">
                <div className="text-sm font-medium mb-2">{translate('preview.applicationType')}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">1.</span>
                    <input type="checkbox" checked={formData.applicationType === 'Shifting of Residence'} readOnly />
                    <span className="text-sm">{translate('appType.shifting') || 'Shifting of Residence (or)'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">2.</span>
                    <input type="checkbox" checked={formData.applicationType === 'Correction of Entries in Existing Electoral Roll'} readOnly />
                    <span className="text-sm">{translate('appType.correction') || 'Correction of Entries in Existing Electoral Roll (or)'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">3.</span>
                    <input type="checkbox" checked={formData.applicationType === 'Issue of Replacement EPIC without correction'} readOnly />
                    <span className="text-sm">{translate('appType.replacement') || 'Issue of Replacement EPIC without correction (or)'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">4.</span>
                    <input type="checkbox" checked={formData.applicationType === 'Request for marking as Person with Disability'} readOnly />
                    <span className="text-sm">{translate('appType.disability') || 'Request for marking as Person with Disability'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Present Address */}
            <div className="border border-black">
              <div className="p-4">
                <div className="text-sm font-medium mb-4">{translate('preview.presentAddress')}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm">{translate('preview.houseNo')}</span>
                      <CharacterBoxes text={formData.presentAddress.houseNo} maxLength={15} onEdit={() => onEdit('presentAddress.houseNo')} />
                    </div>
                    <div>
                      <span className="text-sm">{translate('preview.townVillage')}</span>
                      <CharacterBoxes text={formData.presentAddress.townVillage} maxLength={20} onEdit={() => onEdit('presentAddress.townVillage')} />
                    </div>
                    <div>
                      <span className="text-sm">{translate('preview.pinCode')}</span>
                      <CharacterBoxes text={formData.presentAddress.pinCode} maxLength={6} onEdit={() => onEdit('presentAddress.pinCode')} />
                    </div>
                    <div>
                      <span className="text-sm">{translate('preview.district')}</span>
                      <CharacterBoxes text={formData.presentAddress.district} maxLength={20} onEdit={() => onEdit('presentAddress.district')} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm">{translate('preview.streetArea')}</span>
                      <CharacterBoxes text={formData.presentAddress.streetArea} maxLength={25} onEdit={() => onEdit('presentAddress.streetArea')} />
                    </div>
                    <div>
                      <span className="text-sm">{translate('preview.postOffice')}</span>
                      <CharacterBoxes text={formData.presentAddress.postOffice} maxLength={20} onEdit={() => onEdit('presentAddress.postOffice')} />
                    </div>
                    <div>
                      <span className="text-sm">{translate('preview.tehsilTaluka')}</span>
                      <CharacterBoxes text={formData.presentAddress.tehsilTaluka} maxLength={20} onEdit={() => onEdit('presentAddress.tehsilTaluka')} />
                    </div>
                    <div>
                      <span className="text-sm">{translate('preview.stateUt')}</span>
                      <CharacterBoxes text={formData.presentAddress.stateUt} maxLength={20} onEdit={() => onEdit('presentAddress.stateUt')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="border border-black">
              <div className="p-4">
                <div className="text-sm font-medium mb-3">
                  {translate('preview.documents')}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
                    'Current passbook of Nationalised/Scheduled Bank/Post Office',
                    'Revenue Department\'s Land Owning records including Kisan Bahi',
                    'Registered Rent Lease Deed (In case of tenant)',
                    'Aadhaar Card',
                    'Indian Passport',
                    'Registered Sale Deed (In case of own house)'
                  ].map((doc, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span>{index + 1}.</span>
                      <input 
                        type="checkbox" 
                        checked={formData.documentsAvailable?.includes(doc)} 
                        readOnly 
                        className="mt-1"
                      />
                      <span className="text-xs">{doc}</span>
                    </div>
                  ))}
                </div>
                {formData.otherDocument && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">{translate('preview.otherDocument')}</span>
                    <div className="border-b border-black mt-1 pb-1">
                      <span className="text-sm">{formData.otherDocument}</span>
                      <button onClick={() => onEdit('otherDocument')} className="ml-2 text-[#33FEBF] text-xs underline">
                        {translate('preview.edit')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Files Section */}
            {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
              <div className="border border-black">
                <div className="p-4">
                  <div className="text-sm font-medium mb-3">
                    {translate('preview.uploadedFiles') || 'Uploaded Files'}
                  </div>
                  <div className="space-y-2">
                    {formData.uploadedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
              >
                <Download className="w-4 h-4 mr-2" />
                {translate('button.download')}
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
              >
                <Send className="w-4 h-4 mr-2" />
                {translate('button.submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoterIdPreview;

</edits_to_apply>
