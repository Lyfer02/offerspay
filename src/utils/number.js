// src/utils/number.js
export const formatNumber = (num, locale = 'en-IN') => {
    if (num == null) return 'N/A';
  
    const [integer, decimal] = String(num).split('.');
    const reversed = integer.split('').reverse();
    const parts = [];
  
    // Indian grouping: 3,2,2…
    for (let i = 0; i < reversed.length; i++) {
      if (i > 0 && i % 2 === 0 && i < reversed.length - 3) parts.push(',');
      parts.push(reversed[i]);
    }
  
    const formatted = parts.reverse().join('');
    return decimal ? `${formatted}.${decimal}` : formatted;
  };