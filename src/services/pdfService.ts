
import jsPDF from 'jspdf';

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

export const generateVoterIdPDF = (formData: FormData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(10, 10, pageWidth - 20, 270);
  
  // Header section
  pdf.setFontSize(8);
  pdf.text('Date of Notification:', pageWidth - 50, 18);
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ELECTION COMMISSION OF INDIA', pageWidth / 2, 25, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form-8', pageWidth / 2, 32, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('FORM No.', pageWidth - 35, 25);
  pdf.text('(To be filled by office)', pageWidth - 42, 30);
  
  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const subtitle = 'Voter Application Form for Shifting of Residence/Correction of Entries in Existing Electoral';
  const subtitle2 = 'Roll/Replacement of EPIC/Marking of PwD';
  pdf.text(subtitle, pageWidth / 2, 40, { align: 'center' });
  pdf.text(subtitle2, pageWidth / 2, 46, { align: 'center' });
  
  pdf.setFontSize(7);
  pdf.text('(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)', pageWidth / 2, 52, { align: 'center' });
  
  let yPos = 60;
  
  // To section
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('To,', 15, yPos);
  yPos += 5;
  pdf.text('The Electoral Registration Officer,', 15, yPos);
  yPos += 4;
  pdf.text('No. & Name of Assembly Constituency', 15, yPos);
  yPos += 8;
  
  // Assembly constituency
  pdf.text('No.', 15, yPos);
  drawSmallBoxes(pdf, 25, yPos - 3, formData.assemblyConstituencyNo, 3);
  pdf.text('Name', 50, yPos);
  drawLongBoxes(pdf, 65, yPos - 3, formData.assemblyConstituencyName, 25);
  yPos += 8;
  
  pdf.text('Or No. & Name of Parliamentary Constituency@', 15, yPos);
  pdf.text('No.', 15, yPos + 5);
  drawSmallBoxes(pdf, 25, yPos + 2, formData.parliamentaryConstituencyNo, 3);
  pdf.text('Name', 50, yPos + 5);
  drawLongBoxes(pdf, 65, yPos + 2, formData.parliamentaryConstituencyName, 25);
  yPos += 10;
  
  pdf.setFontSize(7);
  pdf.text('(# only for Union Territories not having Legislative Assembly)', 15, yPos);
  yPos += 10;
  
  // Name section
  pdf.setFontSize(8);
  pdf.text('(i) Name of the applicant', 15, yPos);
  yPos += 5;
  drawLongBoxes(pdf, 15, yPos, formData.applicantName, 35);
  yPos += 12;
  
  // EPIC section
  pdf.text('EPIC No.', 15, yPos);
  yPos += 5;
  drawMediumBoxes(pdf, 15, yPos, formData.epicNo, 15);
  yPos += 12;
  
  // Aadhaar section
  pdf.text('Aadhaar Details :- (Please tick the appropriate box)', 15, yPos);
  yPos += 6;
  
  pdf.text('(a)', 15, yPos);
  drawCheckbox(pdf, 23, yPos - 2, !!formData.aadhaarNumber);
  pdf.text('Aadhaar Number', 30, yPos);
  if (formData.aadhaarNumber) {
    drawMediumBoxes(pdf, 70, yPos - 2, formData.aadhaarNumber, 12);
  }
  pdf.text('or', 150, yPos);
  yPos += 6;
  
  pdf.text('(b)', 15, yPos);
  drawCheckbox(pdf, 23, yPos - 2, formData.noAadhaar);
  pdf.text('I am not able to furnish my Aadhaar Number because I don\'t have Aadhaar Number.', 30, yPos);
  yPos += 10;
  
  // Mobile numbers
  pdf.text('Mobile No. of Self (or)', 15, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, 15, yPos, formData.mobileNoSelf);
  yPos += 8;
  
  pdf.text('Mobile No. of Father/Mother/Any other relative (if available)', 15, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, 15, yPos, formData.mobileNoRelative);
  yPos += 10;
  
  // Email sections
  pdf.text('Email Id of Self (or)', 15, yPos);
  yPos += 2;
  pdf.line(15, yPos + 2, 180, yPos + 2);
  if (formData.emailSelf) {
    pdf.text(formData.emailSelf, 15, yPos + 1);
  }
  yPos += 8;
  
  pdf.text('Email Id of Father/Mother/Any other relative (if available)', 15, yPos);
  yPos += 2;
  pdf.line(15, yPos + 2, 180, yPos + 2);
  if (formData.emailRelative) {
    pdf.text(formData.emailRelative, 15, yPos + 1);
  }
  yPos += 12;
  
  // Application type
  pdf.text('(ii) I submit application for    (Tick any one of the following)', 15, yPos);
  yPos += 6;
  
  const appTypes = [
    'Shifting of Residence (or)',
    'Correction of Entries in Existing Electoral Roll (or)',
    'Issue of Replacement EPIC without correction (or)',
    'Request for marking as Person with Disability'
  ];
  
  appTypes.forEach((type, index) => {
    const isChecked = formData.applicationType === type.replace(' (or)', '');
    pdf.text(`${index + 1}.`, 15, yPos);
    drawCheckbox(pdf, 23, yPos - 2, isChecked);
    pdf.text(type, 30, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  
  // Address section
  pdf.text('Present Address', 15, yPos);
  yPos += 8;
  
  // Address fields layout to match template
  const addressFields = [
    { label: 'House/Building/Apartment No.', value: formData.presentAddress.houseNo, x: 15, width: 15 },
    { label: 'Street/Area/Locality/ Mohalla/Road', value: formData.presentAddress.streetArea, x: 105, width: 20 },
    { label: 'Town/Village', value: formData.presentAddress.townVillage, x: 15, width: 15 },
    { label: 'Post Office', value: formData.presentAddress.postOffice, x: 105, width: 15 },
    { label: 'PIN Code', value: formData.presentAddress.pinCode, x: 15, width: 8 },
    { label: 'Tehsil/Taluka/Mandal', value: formData.presentAddress.tehsilTaluka, x: 105, width: 15 },
    { label: 'District', value: formData.presentAddress.district, x: 15, width: 15 },
    { label: 'State/UT', value: formData.presentAddress.stateUt, x: 105, width: 15 }
  ];
  
  addressFields.forEach((field, index) => {
    const row = Math.floor(index / 2);
    const isRight = index % 2 === 1;
    const y = yPos + (row * 12);
    
    pdf.setFontSize(7);
    pdf.text(field.label, field.x, y);
    drawAddressBoxes(pdf, field.x, y + 3, field.value, field.width);
  });
  
  yPos += 50;
  
  // Check if we need a new page
  if (yPos > 240) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Documents section
  pdf.setFontSize(8);
  const docText = 'Self-attested copy of address proof either in the name of applicant or anyone of the parents/spouse/adult child,';
  const docText2 = 'if already enrolled with as elector at the same address (Attach any one of the documents mentioned below *):-';
  pdf.text(docText, 15, yPos);
  pdf.text(docText2, 15, yPos + 4);
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
    const x = col === 0 ? 15 : 105;
    const y = yPos + (row * 6);
    
    pdf.text(`${index + 1}.`, x, y);
    drawCheckbox(pdf, x + 8, y - 2, formData.documentsAvailable?.includes(doc) || false);
    
    // Wrap text for better fit
    const wrappedText = pdf.splitTextToSize(doc, 80);
    pdf.text(wrappedText[0], x + 15, y);
    if (wrappedText.length > 1) {
      pdf.text(wrappedText[1], x + 15, y + 3);
    }
  });
  
  yPos += 25;
  
  if (formData.otherDocument) {
    pdf.text('Any Other:- (Pl. Specify)', 15, yPos);
    yPos += 3;
    pdf.line(15, yPos + 2, 180, yPos + 2);
    pdf.text(formData.otherDocument, 15, yPos + 1);
  }
  
  // Save the PDF
  pdf.save('voter-id-application.pdf');
};

// Helper functions for different box types
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

const drawCheckbox = (pdf: jsPDF, x: number, y: number, checked: boolean) => {
  pdf.rect(x, y, 3, 3);
  if (checked) {
    pdf.setFontSize(8);
    pdf.text('✓', x + 0.5, y + 2.5);
  }
};
