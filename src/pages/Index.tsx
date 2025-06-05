
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
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'credit-card',
      title: 'Credit Card Application',
      description: 'Apply for a new credit card',
      icon: CreditCard,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'loan-application',
      title: 'Loan Application Form',
      description: 'Personal or business loan application',
      icon: FileText,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'kyc-update',
      title: 'KYC Update Form',
      description: 'Update your Know Your Customer information',
      icon: User,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const handleFormSelect = (formId: string) => {
    navigate(`/form/${formId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Form Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Fill forms with ease using voice input and smart assistance
          </p>
          <p className="text-sm text-gray-500">
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
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                      <IconComponent className={`w-8 h-8 ${form.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {form.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-200">
                    Start Form
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Features Available
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Voice Input</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Auto-correction</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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
