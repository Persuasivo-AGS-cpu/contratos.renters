export function numberToWords(num: number): string {
  const Unidades = [
    '', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ',
    'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE', 'VEINTE'
  ];

  const Decenas = [
    '', 'DIEZ', 'VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'
  ];

  const Centenas = [
    '', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
  ];

  if (num === 0) return 'CERO';

  const formatNumber = (n: number): string => {
    if (n === 100) return 'CIEN';
    if (n <= 20) return Unidades[n];
    if (n < 30) return Decenas[2] + Unidades[n - 20];
    
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      return Decenas[ten] + (unit > 0 ? ' Y ' + Unidades[unit] : '');
    }

    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      return Centenas[hundred] + (rest > 0 ? ' ' + formatNumber(rest) : '');
    }

    if (n === 1000) return 'MIL';
    
    if (n < 1000000) {
      const thousands = Math.floor(n / 1000);
      const rest = n % 1000;
      const thousandStr = thousands === 1 ? 'MIL' : formatNumber(thousands) + ' MIL';
      return thousandStr + (rest > 0 ? ' ' + formatNumber(rest) : '');
    }

    if (n === 1000000) return 'UN MILLON';
    
    if (n < 1000000000) {
      const millions = Math.floor(n / 1000000);
      const rest = n % 1000000;
      const millionStr = millions === 1 ? 'UN MILLON' : formatNumber(millions) + ' MILLONES';
      return millionStr + (rest > 0 ? ' ' + formatNumber(rest) : '');
    }

    return num.toString();
  };

  return formatNumber(Math.floor(num));
}

export function formatCurrencyText(amount: number): string {
  if (!amount || amount <= 0) return '';
  const integers = Math.floor(amount);
  const decimals = Math.round((amount - integers) * 100);
  const decimalStr = decimals.toString().padStart(2, '0');
  
  return `${numberToWords(integers)} PESOS ${decimalStr}/100 M.N.`;
}
