import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type DownloadFormat = 'pdf' | 'image';

export const useDownloadReceipt = () => {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const downloadReceipt = async (format: DownloadFormat = 'pdf') => {
    if (!receiptRef.current) return;
    
    try {
      if (format === 'pdf') {
        setIsPdfLoading(true);
      } else {
        setIsImageLoading(true);
      }
      
      const receiptElement = receiptRef.current;
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imageData = canvas.toDataURL('image/png');
      
      if (format === 'image') {
        // Download as PNG image
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'HelloMe-receipt.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Download as PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('HelloMe-receipt.pdf');
      }
    } catch (error) {
      console.error('Error generating receipt download:', error);
    } finally {
      if (format === 'pdf') {
        setIsPdfLoading(false);
      } else {
        setIsImageLoading(false);
      }
    }
  };

  return {
    receiptRef,
    downloadReceipt,
    isPdfLoading,
    isImageLoading,
    isLoading: isPdfLoading || isImageLoading, // Keeping the original isLoading for backward compatibility
  };
};