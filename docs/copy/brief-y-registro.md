# Brief de mensajes y registro de afirmaciones

## La idea en una línea
**El contrato es el documento. La póliza jurídica es el documento más el respaldo legal durante la renta.**

## Qué es cada cosa
| | Contrato en línea | Póliza jurídica |
|---|---|---|
| Dónde se vende | contratos.renters.mx | www.renters.mx |
| Estados | Nuevo León, Jalisco, Querétaro, Mérida, San Luis Potosí y Coahuila de Zaragoza | Solo Nuevo León |
| Para quién | Quien solo necesita el documento | Quien además quiere respaldo legal durante la renta |
| Qué incluye | Contrato personalizado por estado, PDF para firmar, enlace de descarga 90 días, corrección gratis 24 h | Un contrato personalizado (mismos abogados, misma lógica) más los servicios de su paquete |
| Precio | $499 MXN, IVA incluido | Según paquete |

## Reglas de redacción
1. Decir **qué es**, **para quién es** y **dónde aplica**. Si algo solo aplica en Nuevo León, la frase dice "Nuevo León".
2. La póliza **no se menciona** a quien está en otro estado, salvo la frase de la pregunta "¿Qué diferencia hay…?", que aclara que fuera de Nuevo León solo hay contratos.
3. Nada de absolutos: no "legalmente válido", "válido ante autoridades", "100% protegido", "redactado por abogados" sin la frase aprobada, "te blinda", "sin despachos costosos", "cobranza y desalojo incluidos".
4. Nada de cifras sin fuente. Un dato se publica solo si existe un registro de dónde sale.
5. Nada de promesas de factura. Nada de "no compartimos tus datos con terceros".
6. Tiempo: no prometer "menos de X minutos" como garantía; un cliente real tardó 31 minutos.
7. Las frases de autoría usan `COPY.autoria` (src/lib/copy.ts): se cambian en un solo lugar.

## Vocabulario
| Usar | Evitar |
|---|---|
| contrato en línea, plantilla, contrato personalizado | contrato legal, contrato blindado |
| póliza jurídica (solo Nuevo León) | seguro de arrendamiento, garantía, fianza |
| basado en el Código Civil de [estado] | conforme / válido ante tribunales |
| respaldo legal durante la renta | "protección total" |

## Registro de afirmaciones
| Afirmación | Dónde está hoy | Estado | Acción |
|---|---|---|---|
| "Legalmente válido" | layout.tsx, opengraph-image.tsx, estado/[slug] (texto) | Absoluta, pendiente de abogado | Reemplazar por "basado en el Código Civil de [estado]" |
| "Redactado por abogados" / "Validado por abogados expertos" | estado/[slug], opengraph-image, PurchaseValue, ContratoBEngine | Autoría; pendiente de G1 | Reemplazar por `COPY.autoria` |
| "Plenamente exigible ante los tribunales locales" | estado/[slug] (FAQ) | Absoluta | Reemplazar |
| "Te blinda en papel… cobranza y desalojo incluidos" | success/page.tsx | Absoluta; depende del paquete (G4) | Reemplazar |
| "Protege / asegura tu patrimonio" | CtaSection, PricingSection, Footer | Promesa absoluta | Reemplazar |
| "Contrato legal completo", "PDF legal", "Contrato Legal" | PricingSection, SummaryStep, CheckoutModal | Ambigua | Reemplazar |
| "Un despacho tradicional: $2,500–$5,000" | (ya retirado) | Sin sustento | No volver a usar |
| "+500 propiedades protegidas en México" | www HeroSection | Sin fuente (G3); póliza solo en NL | Reemplazar o documentar fuente |
| "98% casos resueltos exitosamente" | www HeroSection | Sin fuente (G3) | Reemplazar o documentar fuente |
| "Respaldo legal 24/7", "Asesoría 24/7 incluida" | www HeroSection | Sin sustento (G3) | Reemplazar |
| "Póliza… garantiza el cumplimiento" | www FAQSection | Absoluta | Reemplazar |
| "…en México" (póliza) | www Paquetes (título), Footer | Engañosa: póliza solo en NL | Cambiar a "Nuevo León" |
| "Menos de 6 minutos" | Héroe de contratos (estadística) | Promedio sin dato | Reportar; no tocar en este plan |
| Datos de compra: 90 días, 24 horas, menos de 1 día | `src/lib/compra.ts` | Verificado (el test compara con la vigencia real) | Mantener |
