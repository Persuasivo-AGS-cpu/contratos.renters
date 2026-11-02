const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// "2026-11-09" -> "9 de noviembre de 2026". Se parte el texto a mano: new Date('2026-11-09') es UTC y
// en México mostraría el día anterior. Un valor que no es AAAA-MM-DD válido se devuelve igual.
export function formatDateEs(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  const mes = MESES[Number(mo) - 1];
  const dia = Number(d);
  if (!mes || dia < 1 || dia > 31) return iso;
  return `${dia} de ${mes} de ${y}`;
}
