
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
  
  enableCorrectionSection?: boolean;
  enableReplacementSection?: boolean;
  enableDisabilitySection?: boolean;
  
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
  
  replacementReason?: string;
  oldEpicStatus?: string;
  epicCondition?: {
    lost: boolean;
    destroyed: boolean;
    mutilated: boolean;
  };
  mutilatedDetails?: string;
  
  disabilityCategory?: string;
  disabilityType?: {
    locomotive: boolean;
    visual: boolean;
    deafDumb: boolean;
    other: boolean;
  };
  otherDisability?: string;
  disabilityPercentage?: string;
  certificateAttached?: boolean;
  
  declarationDate?: string;
  declarationPlace?: string;
}

export const generateVoterIdPDF = async (formData: FormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(9);
  pdf.text('Date of Notification:', pageWidth - 60, 18);
  
  // ECI Logo (using the updated logo)
  const logoX = margin + 5;
  const logoY = 15;
  pdf.rect(logoX, logoY, 20, 15);
  
  // Add the logo image
  try {
    // This will be replaced with the actual logo from the uploaded image
    pdf.setFillColor(255, 165, 0); // Orange color for ECI logo background
    pdf.rect(logoX + 2, logoY + 2, 6, 4, 'F');
    pdf.setFillColor(255, 255, 255); // White
    pdf.rect(logoX + 2, logoY + 6, 6, 3, 'F');
    pdf.setFillColor(0, 128, 0); // Green
    pdf.rect(logoX + 2, logoY + 9, 6, 4, 'F');
    pdf.setFillColor(0, 0, 0); // Reset to black
  } catch (error) {
    console.log('Logo loading failed, using placeholder');
  }
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ELECTION COMMISSION OF INDIA', pageWidth / 2, 25, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form-8', pageWidth / 2, 32, { align: 'center' });
  
  // Form number box
  pdf.setFontSize(8);
  pdf.text('FORM No.', pageWidth - 40, 25);
  pdf.text('(To be filled by office)', pageWidth - 50, 30);
  pdf.rect(pageWidth - 35, 18, 25, 8);
  
  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const subtitle = 'Voter Application Form for shifting of Residence/Correction of Entries in Existing Electoral';
  const subtitle2 = 'Roll/Replacement of EPIC/Marking of PwD';
  pdf.text(subtitle, pageWidth / 2, 40, { align: 'center' });
  pdf.text(subtitle2, pageWidth / 2, 46, { align: 'center' });
  
  pdf.setFontSize(7);
  pdf.text('(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)', pageWidth / 2, 52, { align: 'center' });
  
  let yPos = 60;
  
  // To section
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('To,', margin + 5, yPos);
  yPos += 4;
  pdf.text('The Electoral Registration Officer,', margin + 5, yPos);
  yPos += 4;
  pdf.text('No. & Name of Assembly Constituency', margin + 5, yPos);
  yPos += 8;
  
  // Assembly constituency
  pdf.text('No.', margin + 5, yPos);
  drawSmallBoxes(pdf, margin + 15, yPos - 3, translatedData.assemblyConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos);
  drawLongBoxes(pdf, margin + 50, yPos - 3, translatedData.assemblyConstituencyName, 30);
  yPos += 8;
  
  pdf.text('Or No. & Name of Parliamentary Constituency@', margin + 5, yPos);
  pdf.text('No.', margin + 5, yPos + 5);
  drawSmallBoxes(pdf, margin + 15, yPos + 2, translatedData.parliamentaryConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos + 5);
  drawLongBoxes(pdf, margin + 50, yPos + 2, translatedData.parliamentaryConstituencyName, 30);
  yPos += 10;
  
  pdf.setFontSize(7);
  pdf.text('(@ only for Union Territories not having Legislative Assembly)', margin + 5, yPos);
  yPos += 10;
  
  // Name section
  pdf.setFontSize(8);
  pdf.text('(i) Name of the applicant', margin + 5, yPos);
  yPos += 5;
  drawLongBoxes(pdf, margin + 5, yPos, translatedData.applicantName, 50);
  yPos += 10;
  
  // EPIC section
  pdf.text('EPIC No.', margin + 5, yPos);
  yPos += 5;
  drawMediumBoxes(pdf, margin + 5, yPos, translatedData.epicNo, 10);
  yPos += 10;
  
  // Aadhaar section
  pdf.text('Aadhaar Details :- (Please tick the appropriate box)', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('(a)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, !!translatedData.aadhaarNumber);
  pdf.text('Aadhaar Number', margin + 20, yPos);
  if (translatedData.aadhaarNumber) {
    drawMediumBoxes(pdf, margin + 55, yPos - 2, translatedData.aadhaarNumber, 12);
  } else {
    drawMediumBoxes(pdf, margin + 55, yPos - 2, '', 12);
  }
  pdf.text('or', contentWidth - 15, yPos);
  yPos += 5;
  
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
    'Shifting of Residence (or)',
    'Correction of Entries in Existing Electoral Roll (or)',
    'Issue of Replacement EPIC without correction (or)',
    'Request for marking as Person with Disability'
  ];
  
  appTypes.forEach((type, index) => {
    const isChecked = translatedData.applicationType === type.replace(' (or)', '') || 
                      translatedData.applicationType.includes(type.split(' ')[0]);
    pdf.text(`${index + 1}.`, margin + 5, yPos);
    drawCheckbox(pdf, margin + 13, yPos - 2, isChecked);
    pdf.text(type, margin + 20, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  
  // Check if we need a new page
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Shifting of Residence section
  pdf.text('1. Application for Shifting of Residence', margin + 5, yPos);
  yPos += 5;
  pdf.text('My name shall not be deleted from the previous address and shifted to the current', margin + 5, yPos);
  yPos += 4;
  pdf.text('address mentioned below. I request that my replacement EPIC may be issued to me to reflect', margin + 5, yPos);
  yPos += 4;
  pdf.text('my old EPIC.', margin + 5, yPos);
  yPos += 8;
  
  // Address section with proper layout matching the image
  pdf.text('Present', margin + 5, yPos);
  pdf.text('House/Building/Apartment No.', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.houseNo, 15);
  
  pdf.text('Street/Area/Locality/ Mohalla/Road', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.streetArea, 20);
  yPos += 12;
  
  pdf.text('Ordinary', margin + 5, yPos);
  pdf.text('Town/Village', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.townVillage, 15);
  
  pdf.text('Post Office', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.postOffice, 20);
  yPos += 12;
  
  pdf.text('Residence', margin + 5, yPos);
  pdf.text('PIN Code', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.pinCode, 6);
  
  pdf.text('Tehsil/Taluka/Mandal', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.tehsilTaluka, 15);
  yPos += 12;
  
  pdf.text('(Full Address)', margin + 5, yPos);
  pdf.text('District', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.district, 15);
  
  pdf.text('State/UT', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.stateUt, 15);
  yPos += 15;
  
  // Documents section
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
  
  // Two column layout for documents
  documents.forEach((doc, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    pdf.text(`${index + 1}.`, x, y);
    drawCheckbox(pdf, x + 8, y - 2, translatedData.documentsAvailable?.includes(doc) || false);
    
    const maxWidth = (contentWidth / 2) - 20;
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
    pdf.line(margin + 50, yPos + 2, contentWidth - 5, yPos + 2);
    pdf.text(translatedData.otherDocument, margin + 52, yPos + 1);
    yPos += 8;
  }
  
  // Check if we need a new page for the next sections
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }

  // Section 2: Correction of Entries (always show structure, populate if enabled)
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

  // Correction fields grid (2x4 layout as in image)
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

  // Draw correction fields in 2 columns as shown in image
  correctionFields.forEach((field, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    pdf.text(field.num, x, y);
    const isChecked = formData.enableCorrectionSection && 
                     formData.correctionFields?.[field.key as keyof typeof formData.correctionFields];
    drawCheckbox(pdf, x + 10, y - 2, isChecked || false);
    pdf.text(field.label, x + 18, y);
  });
  yPos += 30;

  // Photo space (as shown in image)
  pdf.rect(contentWidth - 60, yPos - 25, 55, 20);
  pdf.setFontSize(6);
  pdf.text('SPACE FOR PASTING ONE', contentWidth - 58, yPos - 20);
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
  if (formData.enableCorrectionSection && formData.correctParticulars) {
    pdf.text(formData.correctParticulars, margin + 7, yPos + 4);
  }
  yPos += 20;

  pdf.text('Name of Document in support of above claim attached', margin + 5, yPos);
  yPos += 6;
  pdf.rect(margin + 5, yPos, contentWidth - 10, 8);
  if (formData.enableCorrectionSection && formData.documentName) {
    pdf.text(formData.documentName, margin + 7, yPos + 4);
  }
  yPos += 15;

  // Section 3: Replacement EPIC
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. Application for Issue of Replacement EPIC without correction', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('I request that a replacement EPIC may be issued to me as my original EPIC is-', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Put a tick in appropriate box.)', margin + 5, yPos);
  yPos += 8;

  // EPIC condition checkboxes (horizontal layout as in image)
  const epicConditions = [
    { key: 'lost', label: 'Lost' },
    { key: 'destroyed', label: 'Destroyed due to reason beyond control like floods, fire, other natural disaster etc.' },
    { key: 'mutilated', label: 'Mutilated' }
  ];

  epicConditions.forEach((condition, index) => {
    const isChecked = formData.enableReplacementSection && 
                     formData.epicCondition?.[condition.key as keyof typeof formData.epicCondition];
    drawCheckbox(pdf, margin + 5, yPos - 2, isChecked || false);
    pdf.text(condition.label, margin + 13, yPos);
    yPos += 5;
  });
  
  pdf.text('I hereby return my mutilated/ old EPIC (OR) I have attached copy of FIR/Police report for lost EPIC & I undertake to return', margin + 5, yPos);
  pdf.text('the earlier EPIC issued to me if the same is recovered at a later stage.', margin + 5, yPos + 4);
  yPos += 15;

  // Section 4: Disability
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
    
    const isChecked = formData.enableDisabilitySection && 
                     formData.disabilityType?.[type.key as keyof typeof formData.disabilityType];
    drawCheckbox(pdf, x, y - 2, isChecked || false);
    pdf.text(type.label, x + 10, y);
  });
  yPos += 15;

  pdf.text('Percentage of disability', margin + 5, yPos);
  const percentage = formData.enableDisabilitySection ? (formData.disabilityPercentage || '') : '';
  drawSmallBoxes(pdf, margin + 60, yPos - 3, percentage, 3);
  pdf.text('%, Certificate attached (Tick the appropriate box)', margin + 75, yPos);
  
  const certYes = formData.enableDisabilitySection && formData.certificateAttached;
  const certNo = formData.enableDisabilitySection && !formData.certificateAttached;
  drawCheckbox(pdf, margin + 160, yPos - 2, certYes);
  pdf.text('Yes', margin + 168, yPos);
  drawCheckbox(pdf, margin + 185, yPos - 2, certNo);
  pdf.text('No', margin + 193, yPos);
  yPos += 15;

  // Declaration section (matching the second image)
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  const declarationText = 'I HEREBY DECLARE that to the best of my knowledge and belief that I am a citizen of India and that I am not a ' +
                         'statement or declaration which is false and which I know or believe to be false or do not believe to be true, is punishable ' +
                         'under Section 31 of Representation of the People Act,1950 (43 of 1950) with imprisonment for a term which may extend to ' +
                         'one year or with fine or with both.';
  
  const wrappedDeclaration = pdf.splitTextToSize(declarationText, contentWidth - 10);
  wrappedDeclaration.forEach((line: string, index: number) => {
    pdf.text(line, margin + 5, yPos + (index * 4));
  });
  yPos += wrappedDeclaration.length * 4 + 10;
  
  // Date and place
  pdf.setFontSize(8);
  pdf.text('Date:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 60, yPos + 2);
  if (formData.declarationDate) {
    pdf.text(formData.declarationDate, margin + 22, yPos + 1);
  }
  
  pdf.text('Place:', margin + 70, yPos);
  pdf.line(margin + 85, yPos + 2, margin + 130, yPos + 2);
  if (formData.declarationPlace) {
    pdf.text(formData.declarationPlace, margin + 87, yPos + 1);
  }
  
  pdf.text('Signature of Applicant/Thumb Impression', contentWidth - 70, yPos);
  yPos += 15;
  
  // Accessibility instructions
  pdf.setFontSize(6);
  pdf.text('Accessibility Instructions:- In the light of provisions of Rights of Persons with Disabilities Act 2016 and Rights of Persons with', margin + 5, yPos);
  pdf.text('Disabilities Rules, 2017. In case of person with intellectual disability, autism, cerebral palsy and multiple disabilities the', margin + 5, yPos + 3);
  pdf.text('signature or left hand thumb impression of person with disability, or signature or left hand thumb impression of his/her', margin + 5, yPos + 6);
  pdf.text('legal guardian will be required.', margin + 5, yPos + 9);
  yPos += 15;
  
  pdf.text('* Submission of self-attested copy of mentioned documents will ensure speedy delivery of services.', margin + 5, yPos);
  yPos += 5;
  
  // Office use section
  pdf.rect(margin + 5, yPos, contentWidth - 10, 25);
  pdf.text('For office use:-', margin + 10, yPos + 5);
  pdf.text('Acknowledgment/Receipt for application', margin + 10, yPos + 10);
  pdf.line(contentWidth - 20, yPos + 10, contentWidth - 5, yPos + 10);
  
  pdf.text('Acknowledgment Number', margin + 10, yPos + 15);
  pdf.line(margin + 60, yPos + 17, margin + 120, yPos + 17);
  pdf.text('Date', margin + 130, yPos + 15);
  pdf.line(margin + 145, yPos + 17, contentWidth - 10, yPos + 17);
  
  pdf.text('Received the application in Form 8 of Shri/Smt./Ms.', margin + 10, yPos + 20);
  pdf.line(margin + 90, yPos + 22, contentWidth - 10, yPos + 22);
  
  pdf.text('Name/Signature of ERO/AERO/BLO', pageWidth / 2, yPos + 30, { align: 'center' });

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

// Enhanced checkbox with better tick marks
const drawCheckbox = (pdf: jsPDF, x: number, y: number, checked: boolean) => {
  pdf.rect(x, y, 3, 3);
  if (checked) {
    // Draw a more visible tick mark similar to the images
    pdf.setLineWidth(0.8);
    pdf.line(x + 0.5, y + 1.5, x + 1.2, y + 2.2);
    pdf.line(x + 1.2, y + 2.2, x + 2.5, y + 0.8);
    pdf.setLineWidth(0.2); // Reset line width
  }
};
