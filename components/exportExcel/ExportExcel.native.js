// ExportExcel.native.js
import { Platform, PermissionsAndroid } from 'react-native';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

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

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission",
        message: "App needs access to storage to save the Excel file",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const exportToExcel = async () => {
  try {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        throw new Error('Storage permission denied');
      }
    }

    const data = getDemoData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Earnings Report");
    
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    
    // Convert to bytes array
    const buffer = new Array(wbout.length);
    for (let i = 0; i < wbout.length; i++) {
      buffer[i] = wbout.charCodeAt(i) & 0xFF;
    }
    
    const fileName = 'earnings_report.xlsx';
    const filePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    
    await RNFS.writeFile(filePath, buffer.toString(), 'ascii');
    console.log(`File saved to: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};