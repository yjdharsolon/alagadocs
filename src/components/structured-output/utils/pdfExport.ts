
import { MedicalSections } from '../types';
import toast from 'react-hot-toast';

export const exportAsPDF = (sections: MedicalSections) => {
  if (!sections) {
    toast.error('No data to export');
    return;
  }
  
  try {
    // Create a hidden iframe to generate the PDF-like document
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    document.body.appendChild(printFrame);
    
    // Generate HTML content with proper styling for PDF
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Documentation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 30px;
              color: #333;
            }
            h1 {
              text-align: center;
              color: #2563eb;
              margin-bottom: 20px;
            }
            h2 {
              color: #1d4ed8;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
              margin-top: 20px;
            }
            .date {
              text-align: right;
              margin-bottom: 20px;
              color: #666;
            }
            .section {
              margin-bottom: 15px;
            }
            .content {
              white-space: pre-line;
              padding-left: 10px;
            }
            @media print {
              body {
                margin: 0;
                padding: 15px;
              }
              h1, h2 {
                page-break-after: avoid;
              }
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>Medical Documentation</h1>
          <div class="date">Date: ${new Date().toLocaleDateString()}</div>
          
          <div class="section">
            <h2>CHIEF COMPLAINT</h2>
            <div class="content">${sections.chiefComplaint || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>HISTORY OF PRESENT ILLNESS</h2>
            <div class="content">${sections.historyOfPresentIllness || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>PAST MEDICAL HISTORY</h2>
            <div class="content">${sections.pastMedicalHistory || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>MEDICATIONS</h2>
            <div class="content">${sections.medications || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>ALLERGIES</h2>
            <div class="content">${sections.allergies || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>PHYSICAL EXAMINATION</h2>
            <div class="content">${sections.physicalExamination || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>ASSESSMENT</h2>
            <div class="content">${sections.assessment || 'None documented'}</div>
          </div>
          
          <div class="section">
            <h2>PLAN</h2>
            <div class="content">${sections.plan || 'None documented'}</div>
          </div>
        </body>
      </html>
    `;
    
    // Write the HTML content to the iframe
    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(content);
      frameDoc.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        
        // Clean up after printing is done
        printFrame.onload = () => {
          document.body.removeChild(printFrame);
          toast.success('Document exported for printing/saving as PDF');
        };
      }, 500);
    } else {
      throw new Error('Could not access frame document');
    }
  } catch (error) {
    console.error('Export error:', error);
    
    // Fallback to text export if print fails
    importTextExport().then(module => {
      module.exportAsText(sections);
    });
  }
};

// Dynamically import the text export module to avoid circular dependencies
const importTextExport = async () => {
  return await import('./textExport');
};
