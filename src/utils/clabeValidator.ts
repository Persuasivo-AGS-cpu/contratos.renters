export const BANK_CATALOG: Record<string, string> = {
  '002': 'Banamex',
  '012': 'BBVA',
  '014': 'Santander',
  '021': 'HSBC',
  '030': 'Banco del Bajío',
  '032': 'IXE',
  '036': 'Inbursa',
  '042': 'Mifel',
  '044': 'Scotiabank',
  '058': 'Banregio',
  '060': 'Bansi',
  '062': 'Afirme',
  '072': 'Banorte',
  '102': 'Invex',
  '103': 'American Express',
  '106': 'Ve por Más',
  '108': 'Tokyo',
  '110': 'JP Morgan',
  '112': 'Bmonex',
  '113': 'Multiva',
  '116': 'ING',
  '124': 'Deutsche',
  '126': 'Credit Suisse',
  '127': 'Azteca',
  '128': 'Autofin',
  '129': 'Barclays',
  '130': 'Compartamos',
  '131': 'Banco Famsa',
  '132': 'BM Interacciones',
  '133': 'Banco Actinver',
  '134': 'Wal-Mart / Inbursa',
  '135': 'Nacional Financiera',
  '136': 'Intercam',
  '137': 'Bancoppel',
  '138': 'ABC Capital',
  '139': 'UBS Bank',
  '140': 'Consubanco',
  '141': 'Volskwagen Bank',
  '143': 'CIBanco',
  '145': 'BBase',
  '147': 'Bankaool',
  '148': 'Pagatodo',
  '150': 'Inmobiliario Mexicano',
  '151': 'Donde',
  '152': 'Bancrea',
  '154': 'Banco Covalto',
  '155': 'ICBC',
  '156': 'SABADELL',
  '166': 'Banco del Bienestar',
  '168': 'HIPOTECARIA FEDERAL'
};

/**
 * Valida el dígito verificador de una CLABE
 * @param clabe String de 18 dígitos exactos numéricos
 */
export function validateClabeChecksum(clabe: string): boolean {
  if (clabe.length !== 18) return false;
  
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let sum = 0;
  
  // Sum=( (digito * peso) mod 10 )
  for (let i = 0; i < 17; i++) {
    const digit = parseInt(clabe[i], 10);
    const weight = weights[i];
    sum += (digit * weight) % 10;
  }
  
  const checksum = (10 - (sum % 10)) % 10;
  
  return checksum === parseInt(clabe[17], 10);
}

export function analyzeClabe(clabeInput: string) {
  // Limpia espacio y guiones
  const rawClabe = clabeInput.replace(/\D/g, '');
  
  if (rawClabe.length === 0) {
    return {
      rawClabe: '',
      formattedClabe: '',
      isValidLength: true,
      isValidChecksum: true,
      bankCode: '',
      bankName: '',
      errorType: 'none'
    };
  }

  // Format con espacios para UX (ej: 012 345 6789012345 6)
  let formattedClabe = rawClabe;
  if (rawClabe.length > 3) {
    formattedClabe = rawClabe.slice(0, 3) + ' ' + rawClabe.slice(3);
  }
  if (rawClabe.length > 6) {
    formattedClabe = formattedClabe.slice(0, 7) + ' ' + rawClabe.slice(6);
  }
  if (rawClabe.length > 17) {
    formattedClabe = formattedClabe.slice(0, 19) + ' ' + rawClabe.slice(17, 18);
  }

  const isValidLength = rawClabe.length === 18;
  const isValidChecksum = isValidLength ? validateClabeChecksum(rawClabe) : false;
  const bankCode = rawClabe.length >= 3 ? rawClabe.substring(0, 3) : '';
  const bankName = bankCode ? (BANK_CATALOG[bankCode] || 'No identificado') : '';

  let errorType: 'none' | 'length' | 'checksum' = 'none';
  if (rawClabe.length > 0 && rawClabe.length < 18) {
    errorType = 'length';
  } else if (rawClabe.length === 18 && !isValidChecksum) {
    errorType = 'checksum';
  }

  return {
    rawClabe,
    formattedClabe,
    isValidLength,
    isValidChecksum,
    bankCode,
    bankName,
    errorType
  };
}
