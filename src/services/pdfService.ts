import jsPDF from 'jspdf';
import { translateFormData } from './translationService';

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
  uploadedFiles?: File[];
  correctionFields?: {
    name: boolean;
    gender: boolean;
    dobAge: boolean;
    relationType: boolean;
    relationName: boolean;
    address: boolean;
    mobileNumber: boolean;
    photo: boolean;
  };
  correctParticulars?: string;
  documentName?: string;
  epicCondition?: {
    lost: boolean;
    destroyed: boolean;
    mutilated: boolean;
  };
  disabilityType?: {
    locomotive: boolean;
    visual: boolean;
    deafDumb: boolean;
    other: boolean;
  };
  disabilityPercentage?: string;
  certificateAttached?: boolean;
}

export const generateVoterIdPDF = async (formData: FormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border - within margins
  pdf.rect(margin, margin, contentWidth, 270);
  
  // Header section
  pdf.setFontSize(8);
  pdf.text('Date of Notification:', pageWidth - 55, 23);
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ELECTION COMMISSION OF INDIA', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form-8', pageWidth / 2, 37, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('FORM No.', pageWidth - 40, 30);
  pdf.text('(To be filled by office)', pageWidth - 47, 35);
  
  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const subtitle = 'Voter Application Form for Shifting of Residence/Correction of Entries in Existing Electoral';
  const subtitle2 = 'Roll/Replacement of EPIC/Marking of PwD';
  pdf.text(subtitle, pageWidth / 2, 45, { align: 'center' });
  pdf.text(subtitle2, pageWidth / 2, 51, { align: 'center' });
  
  pdf.setFontSize(7);
  pdf.text('(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)', pageWidth / 2, 57, { align: 'center' });
  
  let yPos = 65;
  
  // To section
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('To,', margin + 5, yPos);
  yPos += 5;
  pdf.text('The Electoral Registration Officer,', margin + 5, yPos);
  yPos += 4;
  pdf.text('No. & Name of Assembly Constituency', margin + 5, yPos);
  yPos += 8;
  
  // Assembly constituency - properly constrained
  pdf.text('No.', margin + 5, yPos);
  drawSmallBoxes(pdf, margin + 20, yPos - 3, translatedData.assemblyConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos);
  drawLongBoxes(pdf, margin + 50, yPos - 3, translatedData.assemblyConstituencyName, Math.floor((contentWidth - 60) / 4)); 
  yPos += 8;
  
  pdf.text('Or No. & Name of Parliamentary Constituency@', margin + 5, yPos);
  pdf.text('No.', margin + 5, yPos + 5);
  drawSmallBoxes(pdf, margin + 20, yPos + 2, translatedData.parliamentaryConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos + 5);
  drawLongBoxes(pdf, margin + 50, yPos + 2, translatedData.parliamentaryConstituencyName, Math.floor((contentWidth - 60) / 4));
  yPos += 10;
  
  pdf.setFontSize(7);
  pdf.text('(# only for Union Territories not having Legislative Assembly)', margin + 5, yPos);
  yPos += 10;
  
  // Name section
  pdf.setFontSize(8);
  pdf.text('(i) Name of the applicant', margin + 5, yPos);
  yPos += 5;
  drawLongBoxes(pdf, margin + 5, yPos, translatedData.applicantName, Math.floor(contentWidth / 4));
  yPos += 12;
  
  // EPIC section
  pdf.text('EPIC No.', margin + 5, yPos);
  yPos += 5;
  drawMediumBoxes(pdf, margin + 5, yPos, translatedData.epicNo, Math.floor((contentWidth - 10) / 8));
  yPos += 12;
  
  // Aadhaar section
  pdf.text('Aadhaar Details :- (Please tick the appropriate box)', margin + 5, yPos);
  yPos += 6;
  
  pdf.text('(a)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, !!translatedData.aadhaarNumber);
  pdf.text('Aadhaar Number', margin + 20, yPos);
  if (translatedData.aadhaarNumber) {
    drawMediumBoxes(pdf, margin + 60, yPos - 2, translatedData.aadhaarNumber, Math.floor((contentWidth - 70) / 6));
  }
  pdf.text('or', contentWidth - 20, yPos);
  yPos += 6;
  
  pdf.text('(b)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, translatedData.noAadhaar);
  pdf.text('I am not able to furnish my Aadhaar Number because I don\'t have Aadhaar Number.', margin + 20, yPos);
  yPos += 10;
  
  // Mobile numbers
  pdf.text('Mobile No. of Self (or)', margin + 5, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, margin + 5, yPos, translatedData.mobileNoSelf);
  yPos += 8;
  
  pdf.text('Mobile No. of Father/Mother/Any other relative (if available)', margin + 5, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, margin + 5, yPos, translatedData.mobileNoRelative);
  yPos += 10;
  
  // Email sections
  pdf.text('Email Id of Self (or)', margin + 5, yPos);
  yPos += 2;
  pdf.line(margin + 5, yPos + 2, contentWidth - 5, yPos + 2);
  if (translatedData.emailSelf) {
    pdf.text(translatedData.emailSelf, margin + 5, yPos + 1);
  }
  yPos += 8;
  
  pdf.text('Email Id of Father/Mother/Any other relative (if available)', margin + 5, yPos);
  yPos += 2;
  pdf.line(margin + 5, yPos + 2, contentWidth - 5, yPos + 2);
  if (translatedData.emailRelative) {
    pdf.text(translatedData.emailRelative, margin + 5, yPos + 1);
  }
  yPos += 12;
  
  // Application type
  pdf.text('(ii) I submit application for    (Tick any one of the following)', margin + 5, yPos);
  yPos += 6;
  
  const appTypes = [
    'Shifting of Residence',
    'Correction of Entries in Existing Electoral Roll',
    'Issue of Replacement EPIC without correction',
    'Request for marking as Person with Disability'
  ];
  
  appTypes.forEach((type, index) => {
    const isChecked = translatedData.applicationType === type || 
                      translatedData.applicationType.includes(type.split(' ')[0]);
    pdf.text(`${index + 1}.`, margin + 5, yPos);
    drawCheckbox(pdf, margin + 13, yPos - 2, isChecked);
    pdf.text(`${type} ${index < 3 ? '(or)' : ''}`, margin + 20, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  
  // Check if we need a new page
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, 270);
  }
  
  // Address section
  pdf.text('Present Address', margin + 5, yPos);
  yPos += 8;
  
  // Left column addresses - properly constrained
  pdf.setFontSize(7);
  const midPoint = contentWidth / 2;
  
  pdf.text('House/Building/Apartment No.', margin + 5, yPos);
  drawAddressBoxes(pdf, margin + 5, yPos + 3, translatedData.presentAddress.houseNo, Math.floor((midPoint - 10) / 4));
  
  pdf.text('Street/Area/Locality/ Mohalla/Road', margin + midPoint, yPos);
  drawAddressBoxes(pdf, margin + midPoint, yPos + 3, translatedData.presentAddress.streetArea, Math.floor((midPoint - 5) / 4));
  yPos += 12;
  
  pdf.text('Town/Village', margin + 5, yPos);
  drawAddressBoxes(pdf, margin + 5, yPos + 3, translatedData.presentAddress.townVillage, Math.floor((midPoint - 10) / 4));
  
  pdf.text('Post Office', margin + midPoint, yPos);
  drawAddressBoxes(pdf, margin + midPoint, yPos + 3, translatedData.presentAddress.postOffice, Math.floor((midPoint - 5) / 4));
  yPos += 12;
  
  pdf.text('PIN Code', margin + 5, yPos);
  drawAddressBoxes(pdf, margin + 5, yPos + 3, translatedData.presentAddress.pinCode, 6);
  
  pdf.text('Tehsil/Taluka/Mandal', margin + midPoint, yPos);
  drawAddressBoxes(pdf, margin + midPoint, yPos + 3, translatedData.presentAddress.tehsilTaluka, Math.floor((midPoint - 5) / 4));
  yPos += 12;
  
  pdf.text('District', margin + 5, yPos);
  drawAddressBoxes(pdf, margin + 5, yPos + 3, translatedData.presentAddress.district, Math.floor((midPoint - 10) / 4));
  
  pdf.text('State/UT', margin + midPoint, yPos);
  drawAddressBoxes(pdf, margin + midPoint, yPos + 3, translatedData.presentAddress.stateUt, Math.floor((midPoint - 5) / 4));
  yPos += 15;
  
  // Check if we need a new page for documents
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, 270);
  }
  
  // Documents section
  pdf.setFontSize(8);
  const docText = 'Self-attested copy of address proof either in the name of applicant or anyone of the parents/spouse/adult child,';
  const docText2 = 'if already enrolled with as elector at the same address (Attach any one of the documents mentioned below *):-';
  pdf.text(docText, margin + 5, yPos);
  pdf.text(docText2, margin + 5, yPos + 4);
  yPos += 12;
  
  const documents = [
    'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
    'Current passbook of Nationalised/Scheduled Bank/Post Office',
    'Revenue Department\'s Land Owning records including Kisan Bahi',
    'Registered Rent Lease Deed (In case of tenant)',
    'Aadhaar Card',
    'Indian Passport',
    'Registered Sale Deed (In case of own house)'
  ];
  
  // Two column layout for documents - properly constrained
  documents.forEach((doc, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + midPoint;
    const y = yPos + (row * 6);
    
    pdf.text(`${index + 1}.`, x, y);
    drawCheckbox(pdf, x + 8, y - 2, translatedData.documentsAvailable?.includes(doc) || false);
    
    // Wrap text for better fit
    const maxWidth = midPoint - 20;
    const wrappedText = pdf.splitTextToSize(doc, maxWidth);
    pdf.text(wrappedText[0], x + 15, y);
    if (wrappedText.length > 1) {
      pdf.text(wrappedText[1], x + 15, y + 3);
    }
  });
  
  yPos += 25;
  
  if (translatedData.otherDocument) {
    pdf.text('Any Other:- (Pl. Specify)', margin + 5, yPos);
    yPos += 3;
    pdf.line(margin + 5, yPos + 2, contentWidth - 5, yPos + 2);
    pdf.text(translatedData.otherDocument, margin + 5, yPos + 1);
    yPos += 8;
  }
  
  // Add uploaded files information if any
  if (formData.uploadedFiles && formData.uploadedFiles.length > 0) {
    yPos += 5;
    pdf.text('Attached Documents:', margin + 5, yPos);
    yPos += 5;
    formData.uploadedFiles.forEach((file, index) => {
      pdf.text(`${index + 1}. ${file.name}`, margin + 10, yPos);
      yPos += 4;
    });
  }
  
  // Check if we need a new page for correction section
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, 270);
  }

  // Correction of Entries Section
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. Application for Correction of Entries in Existing Electoral Roll', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Please correct my following details in Electoral Roll/EPIC:', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Maximum of 4 entries/particulars can be corrected)', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Put a tick ☑ in appropriate box below.)', margin + 5, yPos);
  yPos += 4;
  pdf.text('Copy of self-attested Documentary Proof in support of claim to be attached.', margin + 5, yPos);
  yPos += 8;

  // Correction fields grid
  const correctionFields = [
    { key: 'name', label: 'Name', num: '1.' },
    { key: 'gender', label: 'Gender', num: '2.' },
    { key: 'dobAge', label: 'DoB/Age', num: '3.' },
    { key: 'relationType', label: 'Relation Type', num: '4.' },
    { key: 'relationName', label: 'Relation Name', num: '5.' },
    { key: 'address', label: 'Address', num: '6.' },
    { key: 'mobileNumber', label: 'Mobile Number', num: '7.' },
    { key: 'photo', label: 'Photo', num: '8.' }
  ];

  // Draw correction fields in 2 columns
  correctionFields.forEach((field, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    pdf.text(field.num, x, y);
    drawCheckbox(pdf, x + 10, y - 2, formData.correctionFields?.[field.key as keyof typeof formData.correctionFields] || false);
    pdf.text(field.label, x + 18, y);
  });
  yPos += 30;

  // Photo requirement box
  pdf.rect(contentWidth - 60, yPos - 25, 55, 20);
  pdf.setFontSize(6);
  pdf.text('AFFIX FOR PASTING ONE', contentWidth - 58, yPos - 20);
  pdf.text('RECENT PASSPORT SIZE', contentWidth - 58, yPos - 17);
  pdf.text('UNSIGNED COLOR', contentWidth - 58, yPos - 14);
  pdf.text('PHOTOGRAPH (4.5 CM X', contentWidth - 58, yPos - 11);
  pdf.text('3.5 CM) SHOWING', contentWidth - 58, yPos - 8);
  pdf.text('FRONTAL VIEW OF FULL', contentWidth - 58, yPos - 5);
  pdf.text('FACE WITH WHITE', contentWidth - 58, yPos - 2);
  pdf.text('BACKGROUND ONLY IF', contentWidth - 58, yPos + 1);
  pdf.text('PHOTO IS TO BE CHANGED)', contentWidth - 58, yPos + 4);

  pdf.setFontSize(8);
  pdf.text('The correct particulars in the entry to be corrected are as under:-', margin + 5, yPos);
  yPos += 6;

  // Correction particulars box
  pdf.rect(margin + 5, yPos, contentWidth - 10, 15);
  if (formData.correctParticulars) {
    pdf.text(formData.correctParticulars, margin + 7, yPos + 4);
  }
  yPos += 20;

  pdf.text('Name of Document in support of above claim attached', margin + 5, yPos);
  yPos += 6;
  pdf.rect(margin + 5, yPos, contentWidth - 10, 8);
  if (formData.documentName) {
    pdf.text(formData.documentName, margin + 7, yPos + 4);
  }
  yPos += 15;

  // Replacement EPIC Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. Application for Issue of Replacement EPIC without correction', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('I request that a replacement EPIC may be issued to me due to change in my personal details.', margin + 5, yPos);
  yPos += 4;
  pdf.text('I hereby return my old EPIC', margin + 5, yPos);
  yPos += 8;

  // EPIC condition checkboxes
  const epicConditions = [
    { key: 'lost', label: 'Lost' },
    { key: 'destroyed', label: 'Destroyed due to reason beyond control like floods, fire, other natural disaster etc.' },
    { key: 'mutilated', label: 'Mutilated' }
  ];

  epicConditions.forEach((condition, index) => {
    drawCheckbox(pdf, margin + 5, yPos - 2, formData.epicCondition?.[condition.key as keyof typeof formData.epicCondition] || false);
    pdf.text(condition.label, margin + 13, yPos);
    yPos += 5;
  });
  yPos += 5;

  // Disability Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. Application for Marking Person with Disability', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Category of disability (Tick the appropriate box for category of disability)', margin + 5, yPos);
  yPos += 8;

  const disabilityTypes = [
    { key: 'locomotive', label: 'Locomotive' },
    { key: 'visual', label: 'Visual' },
    { key: 'deafDumb', label: 'Deaf & Dumb' },
    { key: 'other', label: 'If any other (Give description)' }
  ];

  disabilityTypes.forEach((type, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    drawCheckbox(pdf, x, y - 2, formData.disabilityType?.[type.key as keyof typeof formData.disabilityType] || false);
    pdf.text(type.label, x + 10, y);
  });
  yPos += 15;

  pdf.text('Percentage of disability', margin + 5, yPos);
  drawSmallBoxes(pdf, margin + 60, yPos - 3, formData.disabilityPercentage || '', 3);
  pdf.text('%, Certificate attached (Tick the appropriate box)', margin + 75, yPos);
  drawCheckbox(pdf, margin + 160, yPos - 2, formData.certificateAttached);
  pdf.text('Yes', margin + 168, yPos);
  drawCheckbox(pdf, margin + 185, yPos - 2, !formData.certificateAttached);
  pdf.text('No', margin + 193, yPos);
  yPos += 10;

  // Save the PDF
  pdf.save('voter-id-application.pdf');
};

// Helper functions for different box types - all properly constrained
const drawSmallBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 4;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 1));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i].toUpperCase(), boxX + 1, y + 3);
    }
  }
};

const drawMediumBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 4;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.5));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i].toUpperCase(), boxX + 1, y + 3);
    }
  }
};

const drawLongBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3.5;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.3));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(7);
      pdf.text(text[i].toUpperCase(), boxX + 0.8, y + 2.5);
    }
  }
};

const drawMobileBoxes = (pdf: jsPDF, x: number, y: number, text: string) => {
  const boxSize = 4;
  for (let i = 0; i < 10; i++) {
    const boxX = x + (i * (boxSize + 0.5));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i], boxX + 1.5, y + 3);
    }
  }
};

const drawAddressBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.2));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(6);
      pdf.text(text[i].toUpperCase(), boxX + 0.5, y + 2.2);
    }
  }
};

// Update the drawCheckbox function to make ticks more visible
const drawCheckbox = (pdf: jsPDF, x: number, y: number, checked: boolean) => {
  pdf.rect(x, y, 3, 3);
  if (checked) {
    // Draw a bold, more visible tick mark
    pdf.setLineWidth(0.5);
    pdf.line(x + 0.5, y + 1.5, x + 1.2, y + 2.2);
    pdf.line(x + 1.2, y + 2.2, x + 2.5, y + 0.8);
    pdf.setLineWidth(0.2); // Reset line width
  }
};
