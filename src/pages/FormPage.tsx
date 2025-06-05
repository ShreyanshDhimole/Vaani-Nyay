
import { useParams } from 'react-router-dom';
import BankAccountForm from '@/components/BankAccountForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FormPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  if (formId === 'bank-account') {
    return <BankAccountForm />;
  }

  // Placeholder for other forms
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Button>
        
        <Card className="text-center py-12">
          <CardHeader>
            <Construction className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <CardTitle className="text-2xl text-gray-800">Form Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              This form is currently under development. We're working hard to bring you the best form-filling experience.
            </p>
            <p className="text-sm text-gray-500">
              Form ID: {formId}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPage;
