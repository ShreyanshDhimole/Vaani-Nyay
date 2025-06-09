
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, FileText, Users, Shield, Gavel, Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const formCategories = [
    {
      id: 'banking',
      title: 'Banking & Financial',
      description: 'Bank account, EPF, pension related forms',
      icon: Building2,
      forms: [
        { id: 'bank-account', title: 'Bank Account Opening Form', description: 'SBI Account Opening Form for Resident Individual' },
        { id: 'epf-grievance', title: 'EPF Grievance Form', description: 'Employee Provident Fund complaint form' },
        { id: 'pension-grievance', title: 'Pension Grievance Submission', description: 'Submit pension related complaints' }
      ]
    },
    {
      id: 'government',
      title: 'Government Services',
      description: 'RTI, voter ID, birth/death certificates',
      icon: FileText,
      forms: [
        { id: 'rti-application', title: 'RTI Application Form', description: 'Right to Information application' },
        { id: 'voter-id', title: 'Voter ID Application/Correction', description: 'Election Commission Form-8 for voter registration' },
        { id: 'birth-death-correction', title: 'Birth/Death Certificate Correction', description: 'Correct errors in birth or death certificates' },
        { id: 'aadhaar-correction', title: 'Aadhaar/ID Correction Support', description: 'Support letter for ID corrections' }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Court Forms',
      description: 'FIR, legal aid, divorce, property disputes',
      icon: Gavel,
      forms: [
        { id: 'fir-drafting', title: 'FIR Drafting Assistance', description: 'Help with First Information Report drafting' },
        { id: 'legal-aid-application', title: 'Application for Legal Aid', description: 'NALSA/State legal aid application' },
        { id: 'mutual-divorce', title: 'Mutual Divorce First Motion', description: 'Draft for mutual divorce proceedings' },
        { id: 'partition-suit', title: 'Partition Suit Draft', description: 'Property partition legal document' },
        { id: 'property-dispute', title: 'Property Dispute Affidavit', description: 'Affidavit for property related disputes' },
        { id: 'name-change-affidavit', title: 'Name Change Affidavit', description: 'Legal document for name change' }
      ]
    },
    {
      id: 'complaints',
      title: 'Complaints & Grievances',
      description: 'Consumer, cyber crime, workplace complaints',
      icon: Shield,
      forms: [
        { id: 'unpaid-salary', title: 'Unpaid Salary Complaint', description: 'Complaint for salary related issues' },
        { id: 'consumer-complaint', title: 'Consumer Forum Complaint', description: 'Consumer protection complaint form' },
        { id: 'online-grievance', title: 'Online Grievance Redressal', description: 'General online complaint form' },
        { id: 'cyber-crime', title: 'Cyber Crime Complaint', description: 'Report cyber crime incidents' },
        { id: 'illegal-termination', title: 'Illegal Termination Complaint', description: 'Complaint against wrongful termination' },
        { id: 'traffic-fine-dispute', title: 'Traffic Fine Dispute Letter', description: 'Dispute traffic violation fines' }
      ]
    },
    {
      id: 'social',
      title: 'Social Issues',
      description: 'Domestic violence, dowry harassment reports',
      icon: Users,
      forms: [
        { id: 'dowry-harassment', title: 'Dowry Harassment Representation', description: 'Report dowry related harassment' },
        { id: 'domestic-violence', title: 'Domestic Violence Incident Report', description: 'DIR for domestic violence cases' },
        { id: 'address-correction', title: 'Address Correction Support', description: 'Support letter for address corrections' }
      ]
    }
  ];

  const allForms = formCategories.flatMap(category => 
    category.forms.map(form => ({ ...form, category: category.title }))
  );

  const filteredCategories = formCategories.map(category => ({
    ...category,
    forms: category.forms.filter(form => 
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.forms.length > 0);

  const handleFormSelect = (formId: string) => {
    navigate(`/form/${formId}`);
  };

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Digital Form Assistant
          </h1>
          <p className="text-xl text-[#33FEBF] mb-4">
            Fill forms with ease using voice input and smart assistance
          </p>
          <p className="text-sm text-gray-300 mb-8">
            Choose a form category to get started with our step-by-step guided process
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#33FEBF] w-5 h-5" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#33FEBF] focus:ring-[#33FEBF] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Form Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="bg-white border-2 border-[#33FEBF] hover:bg-[#33FEBF]/10 transition-all duration-300"
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#141E28] rounded-full flex items-center justify-center shadow-md">
                      <IconComponent className="w-8 h-8 text-[#33FEBF]" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-[#141E28]">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.forms.slice(0, 3).map((form) => (
                      <Button
                        key={form.id}
                        variant="outline"
                        onClick={() => handleFormSelect(form.id)}
                        className="w-full text-left justify-start border-[#33FEBF] text-[#141E28] hover:bg-[#33FEBF] hover:text-white text-sm"
                      >
                        {form.title}
                      </Button>
                    ))}
                    {category.forms.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{category.forms.length - 3} more forms
                      </p>
                    )}
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>Voice Input</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>Multi-language</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>Auto-correction</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#33FEBF] rounded-full"></div>
                <span>PDF Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
