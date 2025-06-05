
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface FormPreviewProps {
  formData: FormData;
  onBack: () => void;
}

const FormPreview = ({ formData, onBack }: FormPreviewProps) => {
  const handleSubmit = () => {
    toast({
      title: "Form Submitted Successfully!",
      description: "Your bank account opening form has been submitted for processing.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your form is being downloaded as PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/d3aeee09-31ae-4fd2-b005-ed8ee73cb35a.png" 
                  alt="SBI Logo" 
                  className="h-12 w-12 bg-white rounded p-1"
                />
                <div>
                  <CardTitle className="text-xl">
                    ACCOUNT OPENING FORM FOR RESIDENT INDIVIDUAL (PART - I)
                  </CardTitle>
                  <p className="text-blue-100 text-sm">
                    (Must accompanied with Terms and Conditions)
                  </p>
                  <p className="text-blue-100 text-sm">
                    CUSTOMER INFORMATION SHEET (CIF Creation/Amendment)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Date:</p>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className="w-6 h-6 border border-white bg-white/20"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Branch Information</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-sm font-medium">Branch Name:</span>
                    <span className="text-sm">{formData.branchName || 'Not provided'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-sm font-medium">Branch Code:</span>
                    <span className="text-sm">{formData.branchCode || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Application Details</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-sm font-medium">Customer ID:</span>
                    <span className="text-sm">{formData.customerId || 'Not provided'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-sm font-medium">CKYC No:</span>
                    <span className="text-sm">{formData.ckyc || 'Not provided'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-sm font-medium">Application Type:</span>
                    <span className="text-sm">{formData.applicationType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 text-lg bg-blue-50 p-3 rounded">
                A Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-600">1. Name:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">2. Maiden Name:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.maidenName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">3. Date of Birth:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.dateOfBirth || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">4. Gender:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.gender || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">5. Marital Status:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.maritalStatus || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-600">6. No of Dependents:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.dependents || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">7. Father's Name:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.fatherName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">8. Mother's Name:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.motherName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">9. Spouse Name:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.spouseName || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">10. Nationality:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.nationality || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-600">11. Citizenship:</span>
                    <p className="text-gray-800 border-b border-dotted border-gray-300 pb-1">
                      {formData.citizenship || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                Submit Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPreview;
