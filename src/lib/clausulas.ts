// Cláusulas que lleva el contrato (las 6 plantillas estatales comparten estas 10).
// `titulo` es el encabezado tal como está en las plantillas; clausulas.test.mjs verifica que siga ahí.
export const CLAUSULAS = [
  { nombre: 'Objeto del arrendamiento', titulo: 'ARRENDAMIENTO' },
  { nombre: 'Destino del inmueble', titulo: 'DESTINO DEL BIEN ARRENDADO' },
  { nombre: 'Subarrendamiento, cesión y traspaso', titulo: 'LIMITACIONES DEL INMUEBLE A SUBARRENDAMIENTO, CESIÓN Y TRASPASO' },
  { nombre: 'Renta y formas de pago', titulo: 'IMPORTE DE LAS RENTAS Y FORMAS DE PAGO' },
  { nombre: 'Depósito en garantía', titulo: 'DEPÓSITO' },
  { nombre: 'Plazo del contrato', titulo: 'PLAZO DEL CONTRATO' },
  { nombre: 'Reporte de desperfectos', titulo: 'REPORTE DE DESPERFECTOS' },
  { nombre: 'Pago de servicios', titulo: 'PAGO DE SERVICIOS' },
  { nombre: 'Incumplimiento y penalidades', titulo: 'INCUMPLIMIENTO Y PENALIDADES' },
  { nombre: 'Fiador y obligado solidario', titulo: 'FIADOR Y OBLIGADO SOLIDARIO' },
] as const;
