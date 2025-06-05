
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CreditCard, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const forms = [
    {
      id: 'bank-account',
      title: 'Bank Account Opening Form',
      description: 'SBI Account Opening Form for Resident Individual',
      icon: Building2,
      color: 'bg-white border-[#33FEBF] hover:bg-[#33FEBF]/10',
      iconColor: 'text-[#33FEBF]'
    },
    {
      id: 'credit-card',
      title: 'Credit Card Application',
      description: 'Apply for a new credit card',
      icon: CreditCard,
      color: 'bg-white border-[#33FEBF] hover:bg-[#33FEBF]/10',
      iconColor: 'text-[#33FEBF]'
    },
    {
      id: 'loan-application',
      title: 'Loan Application Form',
      description: 'Personal or business loan application',
      icon: FileText,
      color: 'bg-white border-[#33FEBF] hover:bg-[#33FEBF]/10',
      iconColor: 'text-[#33FEBF]'
    },
    {
      id: 'kyc-update',
      title: 'KYC Update Form',
      description: 'Update your Know Your Customer information',
      icon: User,
      color: 'bg-white border-[#33FEBF] hover:bg-[#33FEBF]/10',
      iconColor: 'text-[#33FEBF]'
    }
  ];

  const handleFormSelect = (formId: string) => {
    navigate(`/form/${formId}`);
  };

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Digital Form Assistant
          </h1>
          <p className="text-xl text-[#33FEBF] mb-2">
            Fill forms with ease using voice input and smart assistance
          </p>
          <p className="text-sm text-gray-300">
            Choose a form to get started with our step-by-step guided process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map((form) => {
            const IconComponent = form.icon;
            return (
              <Card
                key={form.id}
                className={`${form.color} transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg border-2`}
                onClick={() => handleFormSelect(form.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#141E28] rounded-full flex items-center justify-center shadow-md">
                      <IconComponent className={`w-8 h-8 ${form.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#141E28]">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-[#141E28] text-white hover:bg-[#141E28]/90 border border-[#33FEBF]">
                    Start Form
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto border border-[#33FEBF]">
            <h3 className="text-lg font-semibold text-[#141E28] mb-3">
              Features Available
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>Voice Input</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>Auto-correction</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>Form Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
