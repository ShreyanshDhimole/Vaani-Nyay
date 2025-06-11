import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface FormData {
  accountHolderName: string;
  dateOfBirth: Date | undefined;
  mobileNumber: string;
  emailAddress: string;
  panNumber: string;
  aadhaarNumber: string;
  occupation: string;
  annualIncome: string;
  currentAddress: string;
  permanentAddress: string;
  nomineName: string;
  nomineeRelation: string;
  accountType: string;
  initialDeposit: number;
  termsAndConditions: boolean;
}

const BankAccountForm = () => {
  const [formData, setFormData] = useState<FormData>({
    accountHolderName: '',
    dateOfBirth: undefined,
    mobileNumber: '',
    emailAddress: '',
    panNumber: '',
    aadhaarNumber: '',
    occupation: '',
    annualIncome: '',
    currentAddress: '',
    permanentAddress: '',
    nomineName: '',
    nomineeRelation: '',
    accountType: '',
    initialDeposit: 0,
    termsAndConditions: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({
      ...prevData,
      dateOfBirth: date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };

  const formFields = [
    { key: 'accountHolderName', label: 'Account Holder Name', type: 'text', section: 'personal', required: true },
    { key: 'dateOfBirth', label: 'Date of Birth', type: 'date', section: 'personal', required: true },
    { key: 'mobileNumber', label: 'Mobile Number', type: 'tel', section: 'contact', required: true },
    { key: 'emailAddress', label: 'Email Address', type: 'email', section: 'contact', required: true },
    { key: 'panNumber', label: 'PAN Number', type: 'text', section: 'documents', required: true },
    { key: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', section: 'documents', required: true },
    { key: 'occupation', label: 'Occupation', type: 'select', section: 'personal', options: ['Salaried', 'Self-Employed', 'Business', 'Student', 'Retired', 'Homemaker', 'Other'], required: true },
    { key: 'annualIncome', label: 'Annual Income', type: 'select', section: 'financial', options: ['Below 1 Lakh', '1-5 Lakhs', '5-10 Lakhs', '10-25 Lakhs', '25-50 Lakhs', 'Above 50 Lakhs'], required: true },
    { key: 'currentAddress', label: 'Current Address', type: 'textarea', section: 'address', required: true },
    { key: 'permanentAddress', label: 'Permanent Address', type: 'textarea', section: 'address', required: true },
    { key: 'nomineName', label: 'Nominee Name', type: 'text', section: 'nominee', required: false },
    { key: 'nomineeRelation', label: 'Relationship with Nominee', type: 'text', section: 'nominee', required: false },
    { key: 'accountType', label: 'Account Type', type: 'radio', section: 'account', options: ['Savings', 'Current', 'Fixed Deposit'], required: true },
    { key: 'initialDeposit', label: 'Initial Deposit Amount', type: 'number', section: 'account', required: true }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Bank Account Opening Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        {formData.dateOfBirth ? (
                          format(formData.dateOfBirth, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    type="text"
                    id="panNumber"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                  <Input
                    type="text"
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Select onValueChange={(value) => handleSelectChange('occupation', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Homemaker">Homemaker</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Select onValueChange={(value) => handleSelectChange('annualIncome', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select annual income" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Below 1 Lakh">Below 1 Lakh</SelectItem>
                      <SelectItem value="1-5 Lakhs">1-5 Lakhs</SelectItem>
                      <SelectItem value="5-10 Lakhs">5-10 Lakhs</SelectItem>
                      <SelectItem value="10-25 Lakhs">10-25 Lakhs</SelectItem>
                      <SelectItem value="25-50 Lakhs">25-50 Lakhs</SelectItem>
                      <SelectItem value="Above 50 Lakhs">Above 50 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentAddress">Current Address</Label>
                  <Textarea
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Textarea
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nomineName">Nominee Name</Label>
                  <Input
                    type="text"
                    id="nomineName"
                    name="nomineName"
                    value={formData.nomineName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="nomineeRelation">Relationship with Nominee</Label>
                  <Input
                    type="text"
                    id="nomineeRelation"
                    name="nomineeRelation"
                    value={formData.nomineeRelation}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Account Type</Label>
                  <RadioGroup defaultValue="savings" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="savings" id="account-type-savings"  onClick={() => handleSelectChange('accountType', 'Savings')}/>
                      <Label htmlFor="account-type-savings">Savings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current" id="account-type-current" onClick={() => handleSelectChange('accountType', 'Current')}/>
                      <Label htmlFor="account-type-current">Current</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed-deposit" id="account-type-fixed-deposit" onClick={() => handleSelectChange('accountType', 'Fixed Deposit')}/>
                      <Label htmlFor="account-type-fixed-deposit">Fixed Deposit</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="initialDeposit">Initial Deposit Amount</Label>
                  <Input
                    type="number"
                    id="initialDeposit"
                    name="initialDeposit"
                    value={formData.initialDeposit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" name="termsAndConditions" onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="terms">I agree to the terms and conditions</Label>
                  </div>
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BankAccountForm;
