
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
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Header
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ELECTION COMMISSION OF INDIA', pageWidth / 2, 20, { align: 'center' });
  pdf.text('Form-8', pageWidth / 2, 28, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Voter Application Form for Shifting of Residence/Correction of Entries in Existing Electoral Roll/Replacement of EPIC/Marking of PwD', pageWidth / 2, 35, { align: 'center' });
  pdf.text('(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)', pageWidth / 2, 42, { align: 'center' });
  
  let yPosition = 55;
  
  // Draw border around entire form
  pdf.rect(10, 50, pageWidth - 20, pageHeight - 70);
  
  // To section
  pdf.setFont('helvetica', 'bold');
  pdf.text('To,', 15, yPosition);
  yPosition += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('The Electoral Registration Officer,', 15, yPosition);
  yPosition += 6;
  pdf.text('No. & Name of Assembly Constituency', 15, yPosition);
  yPosition += 8;
  
  // Assembly Constituency boxes
  pdf.text('No.', 15, yPosition);
  drawCharacterBoxes(pdf, 35, yPosition - 3, formData.assemblyConstituencyNo, 3);
  pdf.text('Name', 80, yPosition);
  drawCharacterBoxes(pdf, 100, yPosition - 3, formData.assemblyConstituencyName, 25);
  yPosition += 12;
  
  // Parliamentary Constituency
  pdf.text('Or No. & Name of Parliamentary Constituency#', 15, yPosition);
  yPosition += 6;
  pdf.text('(# only for Union Territories not having Legislative Assembly)', 15, yPosition);
  yPosition += 8;
  
  pdf.text('No.', 15, yPosition);
  drawCharacterBoxes(pdf, 35, yPosition - 3, formData.parliamentaryConstituencyNo, 3);
  pdf.text('Name', 80, yPosition);
  drawCharacterBoxes(pdf, 100, yPosition - 3, formData.parliamentaryConstituencyName, 25);
  yPosition += 15;
  
  // Applicant name
  pdf.text('(i) Name of the applicant', 15, yPosition);
  yPosition += 8;
  drawCharacterBoxes(pdf, 15, yPosition - 3, formData.applicantName, 30);
  yPosition += 15;
  
  // EPIC Number
  pdf.text('EPIC No.', 15, yPosition);
  yPosition += 8;
  drawCharacterBoxes(pdf, 15, yPosition - 3, formData.epicNo, 10);
  yPosition += 15;
  
  // Aadhaar Details
  pdf.text('Aadhaar Details :- (Please tick the appropriate box)', 15, yPosition);
  yPosition += 8;
  
  // Aadhaar number checkbox
  pdf.text('(a)', 15, yPosition);
  drawCheckbox(pdf, 25, yPosition - 2, !!formData.aadhaarNumber);
  pdf.text('Aadhaar Number', 35, yPosition);
  if (formData.aadhaarNumber) {
    drawCharacterBoxes(pdf, 80, yPosition - 3, formData.aadhaarNumber, 12);
  }
  pdf.text('or', 170, yPosition);
  yPosition += 8;
  
  // No Aadhaar checkbox
  pdf.text('(b)', 15, yPosition);
  drawCheckbox(pdf, 25, yPosition - 2, formData.noAadhaar);
  pdf.text('I am not able to furnish my Aadhaar Number because I don\'t have Aadhaar Number.', 35, yPosition);
  yPosition += 15;
  
  // Mobile numbers
  pdf.text('Mobile No. of Self (or)', 15, yPosition);
  yPosition += 8;
  drawCharacterBoxes(pdf, 15, yPosition - 3, formData.mobileNoSelf, 10);
  yPosition += 12;
  
  pdf.text('Mobile No. of Father/Mother/Any other relative (if available)', 15, yPosition);
  yPosition += 8;
  drawCharacterBoxes(pdf, 15, yPosition - 3, formData.mobileNoRelative, 10);
  yPosition += 12;
  
  // Email addresses
  pdf.text('Email Id of Self (or)', 15, yPosition);
  yPosition += 6;
  pdf.text(formData.emailSelf || '', 15, yPosition);
  pdf.line(15, yPosition + 2, 180, yPosition + 2);
  yPosition += 10;
  
  pdf.text('Email Id of Father/Mother/Any other relative (if available)', 15, yPosition);
  yPosition += 6;
  pdf.text(formData.emailRelative || '', 15, yPosition);
  pdf.line(15, yPosition + 2, 180, yPosition + 2);
  yPosition += 15;
  
  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = 20;
  }
  
  // Application type
  pdf.text('(ii) I submit application for (Tick any one of the following)', 15, yPosition);
  yPosition += 8;
  
  const applicationTypes = [
    'Shifting of Residence',
    'Correction of Entries in Existing Electoral Roll',
    'Issue of Replacement EPIC without correction',
    'Request for marking as Person with Disability'
  ];
  
  applicationTypes.forEach((type, index) => {
    pdf.text(`${index + 1}.`, 15, yPosition);
    drawCheckbox(pdf, 25, yPosition - 2, formData.applicationType === type);
    pdf.text(type, 35, yPosition);
    yPosition += 6;
  });
  yPosition += 10;
  
  // Present Address
  pdf.text('Present Address', 15, yPosition);
  yPosition += 10;
  
  // Address fields in two columns
  const leftColumn = [
    { label: 'House/Building/Apartment No.', value: formData.presentAddress.houseNo, maxLength: 15 },
    { label: 'Town/Village', value: formData.presentAddress.townVillage, maxLength: 20 },
    { label: 'PIN Code', value: formData.presentAddress.pinCode, maxLength: 6 },
    { label: 'District', value: formData.presentAddress.district, maxLength: 20 }
  ];
  
  const rightColumn = [
    { label: 'Street/Area/Locality/Mohalla/Road', value: formData.presentAddress.streetArea, maxLength: 25 },
    { label: 'Post Office', value: formData.presentAddress.postOffice, maxLength: 20 },
    { label: 'Tehsil/Taluka/Mandal', value: formData.presentAddress.tehsilTaluka, maxLength: 20 },
    { label: 'State/UT', value: formData.presentAddress.stateUt, maxLength: 20 }
  ];
  
  const startY = yPosition;
  
  // Left column
  leftColumn.forEach((field, index) => {
    const y = startY + (index * 20);
    pdf.text(field.label, 15, y);
    drawCharacterBoxes(pdf, 15, y + 5, field.value, field.maxLength);
  });
  
  // Right column
  rightColumn.forEach((field, index) => {
    const y = startY + (index * 20);
    pdf.text(field.label, 105, y);
    drawCharacterBoxes(pdf, 105, y + 5, field.value, field.maxLength);
  });
  
  yPosition = startY + 85;
  
  // Documents section
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.text('Self-attested copy of address proof (Attach any one of the documents mentioned below):', 15, yPosition);
  yPosition += 10;
  
  const documents = [
    'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
    'Current passbook of Nationalised/Scheduled Bank/Post Office',
    'Revenue Department\'s Land Owning records including Kisan Bahi',
    'Registered Rent Lease Deed (In case of tenant)',
    'Aadhaar Card',
    'Indian Passport',
    'Registered Sale Deed (In case of own house)'
  ];
  
  documents.forEach((doc, index) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(`${index + 1}.`, 15, yPosition);
    drawCheckbox(pdf, 25, yPosition - 2, formData.documentsAvailable?.includes(doc) || false);
    pdf.text(doc, 35, yPosition);
    yPosition += 6;
  });
  
  if (formData.otherDocument) {
    yPosition += 5;
    pdf.text('Any Other:- (Pl. Specify)', 15, yPosition);
    yPosition += 6;
    pdf.text(formData.otherDocument, 15, yPosition);
    pdf.line(15, yPosition + 2, 180, yPosition + 2);
  }
  
  // Save the PDF
  pdf.save('voter-id-application.pdf');
};

// Helper function to draw character boxes
const drawCharacterBoxes = (pdf: jsPDF, x: number, y: number, text: string, maxLength: number) => {
  const boxWidth = 4;
  const boxHeight = 6;
  
  for (let i = 0; i < maxLength; i++) {
    const boxX = x + (i * (boxWidth + 1));
    pdf.rect(boxX, y, boxWidth, boxHeight);
    
    if (i < text.length) {
      pdf.text(text[i].toUpperCase(), boxX + 1.5, y + 4);
    }
  }
};

// Helper function to draw checkbox
const drawCheckbox = (pdf: jsPDF, x: number, y: number, checked: boolean) => {
  pdf.rect(x, y, 3, 3);
  if (checked) {
    pdf.text('✓', x + 0.5, y + 2.5);
  }
};
