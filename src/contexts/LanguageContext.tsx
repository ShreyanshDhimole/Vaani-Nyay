
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  translate: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    'forms.title': 'Government Forms',
    'forms.subtitle': 'Digital form filling made easy',
    'forms.bankAccount': 'Bank Account Opening Form',
    'forms.voterId': 'Voter ID Application Form',
    'forms.rti': 'RTI Application Form',
    'forms.unpaidSalary': 'Unpaid Salary Complaint',
    'forms.epf': 'EPF Grievance Form',
    'forms.consumer': 'Consumer Forum Complaint',
    'forms.grievance': 'Online Grievance Redressal Form',
    'forms.cyber': 'Cyber Crime Complaint',
    'forms.dowry': 'Dowry Harassment Representation',
    'forms.termination': 'Illegal Termination Complaint',
    'forms.domestic': 'Domestic Violence Incident Report',
    'forms.legal': 'Application for Legal Aid',
    'forms.pension': 'Pension Grievance Submission',
    'forms.traffic': 'Traffic Fine Dispute Letter',
    'forms.fir': 'FIR Drafting Assistance Form',
    'forms.divorce': 'Mutual Divorce First Motion Draft',
    'forms.partition': 'Partition Suit Draft',
    'forms.property': 'Property Dispute Affidavit Draft',
    'forms.nameChange': 'Name Change Affidavit Draft',
    'forms.address': 'Address Correction Support Letter',
    'forms.birth': 'Birth/Death Certificate Correction Form',
    'forms.aadhaar': 'Aadhaar/ID Correction Support Letter',
    'categories.banking': 'Banking & Financial',
    'categories.legal': 'Legal & RTI',
    'categories.civil': 'Civil & Property',
    'categories.identity': 'Identity & Documents',
    'language.select': 'Select Language',
    'language.hindi': 'हिन्दी',
    'language.bengali': 'বাংলা',
    'language.tamil': 'தமிழ்',
    'language.telugu': 'తెలుగు',
    'language.marathi': 'मराठी',
    'language.gujarati': 'ગુજરાતી',
    'search.placeholder': 'Search forms...',
    'button.back': 'Back to Forms',
    'button.previous': 'Previous',
    'button.next': 'Next',
    'button.submit': 'Submit Form',
    'button.download': 'Download PDF',
    'button.preview': 'Preview Form'
  },
  hi: {
    'forms.title': 'सरकारी फॉर्म',
    'forms.subtitle': 'डिजिटल फॉर्म भरना आसान बनाया गया',
    'forms.bankAccount': 'बैंक खाता खोलने का फॉर्म',
    'forms.voterId': 'मतदाता पहचान पत्र आवेदन फॉर्म',
    'language.select': 'भाषा चुनें',
    'search.placeholder': 'फॉर्म खोजें...',
    'button.back': 'फॉर्म पर वापस जाएं',
    'button.previous': 'पिछला',
    'button.next': 'अगला',
    'button.submit': 'फॉर्म जमा करें',
    'button.download': 'पीडीएफ डाउनलोड करें',
    'button.preview': 'फॉर्म पूर्वावलोकन'
  },
  bn: {
    'forms.title': 'সরকারি ফর্ম',
    'forms.subtitle': 'ডিজিটাল ফর্ম পূরণ সহজ করা হয়েছে',
    'forms.bankAccount': 'ব্যাংক অ্যাকাউন্ট খোলার ফর্ম',
    'forms.voterId': 'ভোটার আইডি আবেদন ফর্ম',
    'language.select': 'ভাষা নির্বাচন করুন',
    'search.placeholder': 'ফর্ম খুঁজুন...',
    'button.back': 'ফর্মে ফিরে যান',
    'button.previous': 'পূর্ববর্তী',
    'button.next': 'পরবর্তী',
    'button.submit': 'ফর্ম জমা দিন',
    'button.download': 'পিডিএফ ডাউনলোড করুন',
    'button.preview': 'ফর্ম প্রিভিউ'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const translate = (key: string): string => {
    return translations[selectedLanguage]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
