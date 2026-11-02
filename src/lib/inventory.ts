// Nombres con los que el inventario aparece en el Anexo A del contrato (las 6 plantillas lo usan).
// Las claves son las que guardan los generadores; una clave sin nombre aquí se imprimía tal cual
// ("cama_matrimonial") en el PDF.
export const INVENTORY_LABELS: Record<string, string> = {
  sofas: 'Sofás o Sillones',
  camas: 'Camas / Colchones',
  cama_matrimonial: 'Cama matrimonial',
  cama_individual: 'Cama individual',
  tv: 'Televisiones',
  comedor: 'Mesas de Comedor y Sillas',
  refrigerador: 'Refrigerador',
  estufa: 'Estufa / Horno',
  microondas: 'Microondas',
  lavadora: 'Lavadora',
  climas: 'Aires Acondicionados / Minisplits',
  abanicos: 'Abanicos de Techo',
  boiler: 'Boiler / Calentador de Agua',
};

export function inventoryLabel(key: string): string {
  if (INVENTORY_LABELS[key]) return INVENTORY_LABELS[key];
  // Clave desconocida: mejor un texto legible que el identificador interno.
  const texto = key.replace(/_/g, ' ').trim();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
