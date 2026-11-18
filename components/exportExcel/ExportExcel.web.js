// ExportExcel.web.js
import { Platform } from 'react-native';
import XLSX from 'xlsx';

// Demo data for the Excel file
const getDemoData = () => {
  return [
    {
      date: '2024-05-01',
      transactionId: 'TRX001',
      amount: 500.00,
      status: 'Completed',
      description: 'Service Payment'
    },
    {
      date: '2024-05-02',
      transactionId: 'TRX002',
      amount: 750.00,
      status: 'Pending',
      description: 'Consultation Fee'
    },
    {
      date: '2024-05-03',
      transactionId: 'TRX003',
      amount: 1200.00,
      status: 'Completed',
      description: 'Project Payment'
    }
  ];
};

export const exportToExcel = async () => {
  try {
    const data = getDemoData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Earnings Report");
    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings_report.xlsx';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};