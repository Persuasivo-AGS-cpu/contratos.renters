"use client";

import { useContractStore } from "@/store/useContractStore";
import { formatCurrencyText } from "@/utils/numberToWords";

export function NuevoLeonTemplate() {
  const { contract } = useContractStore();
  const c = contract;

  const rentText = formatCurrencyText(c.terms.monthly_rent);
  const depositText = formatCurrencyText(c.terms.deposit_amount);

  // Mapeo legal del tipo de propiedad
  const formatAddress = (addr: any) => {
    if (!addr || !addr.street) return null;
    return `${addr.street} ${addr.ext_num}${addr.int_num ? ` Int. ${addr.int_num}` : ''}, Col. ${addr.neighborhood}, ${addr.municipality}, C.P. ${addr.zip_code}, ${addr.state}`;
  };
  const formattedPropertyAddress = formatAddress(c.property.address);

  const propertyLabelMap: Record<string, string> = {
    casa: 'CASA-HABITACIÓN',
    departamento: 'DEPARTAMENTO',
    local: 'LOCAL COMERCIAL',
    oficina: 'OFICINA',
  };
  
  const propertyUsageMap: Record<string, string> = {
    casa: 'USO HABITACIONAL',
    departamento: 'USO HABITACIONAL',
    local: 'USO COMERCIAL',
    oficina: 'USO COMUNICACIÓN / OFICINA',
  };

  const propertyLabel = propertyLabelMap[c.property.type] || 'CASA-HABITACIÓN';
  const propertyUsage = propertyUsageMap[c.property.type] || 'USO HABITACIONAL';

  return (
    <div className="text-[10px] md:text-[11px] text-gray-800 leading-relaxed space-y-4 text-justify font-serif print:text-black">
      <div className="text-center font-bold mb-8">
        <h2 className="text-sm">C O N T R A T O &nbsp; D E &nbsp; A R R E N D A M I E N T O</h2>
      </div>

      <p>
        CONTRATO DE ARRENDAMIENTO QUE CELEBRAN, POR UNA PARTE, <span className="font-bold">{c.landlord.name || '___________________________'}</span>, A QUIEN EN LO SUCESIVO EN TÉRMINOS DEL PRESENTE CONTRATO SE LE DENOMINARÁ <span className="font-bold">"EL ARRENDADOR”</span>; POR LA OTRA PARTE, <span className="font-bold">{c.tenant.name || '___________________________'}</span>, A QUIEN EN LO SUCESIVO EN TÉRMINOS DEL PRESENTE CONTRATO SE LE DENOMINARÁ <span className="font-bold">“EL ARRENDATARIO"</span>{c.guarantor.includes && (<>; Y POR UNA TERCERA PARTE, <span className="font-bold">{c.guarantor.name || '___________________________'}</span>, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ <span className="font-bold">"EL FIADOR"</span></>)}; EN LOS TÉRMINOS QUE SE PRECISARÁN EN EL PRESENTE INSTRUMENTO LEGAL, “LAS PARTES” FORMALIZARÁN EL PRESENTE CONTRATO CONFORME A LAS SIGUIENTES DECLARACIONES y CLÁUSULAS:
      </p>

      <div className="text-center font-bold mt-6 mb-4">
        <h3>D E C L A R A C I O N E S</h3>
      </div>

      <p className="font-bold">I.- Declara “EL ARRENDADOR”:</p>
      <div className="pl-4 space-y-2">
        <p>a) Que cuenta con plena capacidad legal para obligarse y que desea llevar a cabo el presente acto.</p>
        <p>b) Que es propietario y tiene en legítima propiedad, posesión y pleno dominio el inmueble ubicado en <span className="font-bold">{formattedPropertyAddress || '___________________________'}</span>, que en lo sucesivo se le denominará “EL INMUEBLE”.</p>
        <p>c) Que no tiene conocimiento alguno sobre si “EL ARRENDATARIO” se encuentra o ha estado involucrado, directa o indirectamente, en la comisión de delitos, particularmente aquellos que establece la Ley Nacional De Extinción De Dominio y los que menciona La Constitución Política de Los Estados Unidos Mexicanos, por lo que hasta donde es de su conocimiento “EL ARRENDATARIO” se dedica exclusivamente a la realización de actividades lícitas.</p>
        <p>d) Que al no conocer sobre la realización de ninguno de los hechos ilícitos y delitos a los que se refieren la Ley Nacional De Extinción De Dominio por parte de “EL ARRENDATARIO”, actúa con absoluta buena fe en la celebración de este Contrato.</p>
        <p>e) Que es su deseo y voluntad dar en arrendamiento a “EL ARRENDATARIO” “EL INMUEBLE” para uso exclusivamente de <span className="font-bold uppercase">{propertyLabel}</span>.</p>
        <p>f) Que “EL INMUEBLE” incluye instalaciones eléctricas, sanitarias, mismo que se recibe en condiciones de uso normal.</p>
        <p>g) Que su domicilio convencional para oír y recibir notificaciones, en el ubicado <span className="font-bold">{c.landlord.address || '___________________________'}</span>.</p>
      </div>

      <p className="font-bold mt-4">II.- Declara “EL ARRENDATARIO”:</p>
      <div className="pl-4 space-y-2">
        <p>a) Que tiene plena capacidad legal para obligarse y que desea llevar a cabo el presente acto.</p>
        <p>b) Que conoce perfectamente “EL INMUEBLE” descrito en las declaraciones de “EL ARRENDADOR” y que desea llevar a cabo el presente contrato de arrendamiento.</p>
        <p>c) Que por así convenir a sus intereses es su deseo y está dispuesto a tomar en arrendamiento “EL INMUEBLE” que se describe en la declaración I inciso “b” de conformidad con los términos y condiciones establecidos en el presente contrato. Que en sus actividades jamás ha incurrido en la comisión de delito alguno, incluyendo los que establece la Ley Nacional De Extinción De Dominio y los que establece La Constitución Política de Los Estados Unidos Mexicanos.</p>
        <p>d) Que los recursos que destina y/o destinará al pago de la Renta y la constitución del Depósito provienen y/o provendrán de fuentes lícitas.</p>
        <p>e) Que es su deseo e intención celebrar el presente Contrato de arrendamiento y arrendar “EL INMUEBLE” a “EL ARRENDADOR” en los términos y bajo las condiciones que establece el presente Contrato, asegurando que todas sus declaraciones, manifestaciones y garantías hechas en el presente instrumento son verdaderas, precisas y ciertas.</p>
        <p>f) Que señala para todo efecto legal su domicilio convencional a fin de oír y recibir notificaciones el ubicado en <span className="font-bold">{c.tenant.address || formattedPropertyAddress || '___________________________'}</span>.</p>
      </div>

      <p>
        “LAS PARTES” reconocen la personalidad con que comparecen, deciden sujetar el presente contrato al tenor de las siguientes:
      </p>

      <div className="text-center font-bold mt-8 mb-4">
        <h3>C L Á U S U L A S</h3>
      </div>

      <p>
        <span className="font-bold">PRIMERA. - ARRENDAMIENTO.</span> En este acto y por medio del presente instrumento “EL ARRENDADOR” otorgan el uso y goce temporal a “EL ARRENDATARIO” de “EL INMUEBLE”, mismo que se encuentra en buenas condiciones generales, y cumple con los requisitos de salubridad e higiene necesarios para su debida utilización, mismo que en este acto acepta.
      </p>

      <p>
        <span className="font-bold">SEGUNDA. - DESTINO DEL BIEN ARRENDADO.</span> “EL ARRENDATARIO” destinará el inmueble arrendado, única y exclusivamente para <span className="font-bold uppercase">{propertyUsage}</span>, por lo que en ningún caso y por ningún motivo “EL ARRENDATARIO” podrán ampliar o variar el giro antes mencionado sin la previa autorización por escrito de “EL ARRENDADOR”.
      </p>

      <p>
        <span className="font-bold">TERCERA. - LIMITACIONES DEL INMUEBLE A SUBARRENDAMIENTO, CESIÓN Y TRASPASO.</span> “EL ARRENDATARIO” no podrá bajo ningún motivo o causa subarrendar todo o parte de “EL INMUEBLE” arrendado, así como ceder o traspasar total o parcialmente los derechos y obligaciones derivadas del presente contrato, salvo que “EL ARRENDADOR” dé su consentimiento en forma escrita.
      </p>

      <p>
        <span className="font-bold">CUARTA. - IMPORTE DE LAS RENTAS Y FORMAS DE PAGO.</span> El importe que fijan ambas “LAS PARTES” de mutuo acuerdo por concepto de pensión rentaría y cuota de mantenimiento para “EL INMUEBLE” objeto de este contrato será la cantidad de <span className="font-bold">${c.terms.monthly_rent} ({rentText || '____________ PESOS 00/100 M.N.'}) MENSUALES</span> por cada uno de los <span className="font-bold">{c.terms.lease_duration_months} MESES</span> de vigencia del presente Contrato, a pagar el día <span className="font-bold">{c.terms.payment_day} de cada mes</span>, mismos que se realizará mediante transferencia electrónica al banco denominado <span className="font-bold">{c.terms.bank_name || '___________'}</span>, cuenta <span className="font-bold">{c.terms.bank_account || '___________'}</span>, y cuenta CLABE <span className="font-bold">{c.terms.bank_clabe || '__________________'}</span>, y cuyo recibo correspondiente será el comprobante bancario CEP de la transferencia realizada.
      </p>

      <p>
        <span className="font-bold">QUINTA. - DEPÓSITO.</span> Para garantizar que “EL INMUEBLE” arrendado sea devuelto en buen estado, “EL ARRENDATARIO” constituye un depósito a favor de “EL ARRENDADOR” al momento de la firma del presente contrato, por un importe de <span className="font-bold">${c.terms.deposit_amount} ({depositText || '____________ PESOS 00/100 M.N.'})</span>. Este depósito no podrá ser usado para el pago de rentas y será devuelto a “EL ARRENDATARIO” 45 días naturales posteriores a la entrega de “EL INMUEBLE”, siempre que éste no presentare daño alguno y no existan adeudos.
      </p>

      <p>
        <span className="font-bold">SEXTA. - PLAZO DEL CONTRATO.</span> El plazo de arrendamiento será de <span className="font-bold">{c.terms.lease_duration_months} MESES forzosos</span> para ambas partes, iniciando el día <span className="font-bold">{c.terms.lease_start_date || '_________'}</span>. Si el contrato se celebra por un plazo forzoso y “EL ARRENDATARIO” desea desocupar antes de su término, para hacerlo deberá estar al corriente en el pago de la renta y pagar la penalidad de <span className="font-bold">{c.terms.early_termination_penalty_months} meses</span> de renta del presente contrato de arrendamiento.
      </p>

      <p>
        <span className="font-bold">SÉPTIMA. - REPORTE DE DESPERFECTOS.</span> “EL ARRENDATARIO” contará con un plazo improrrogable de 30-treinta días naturales, contados a partir de la fecha de entrega física, para notificar por escrito a “EL ARRENDADOR” sobre la existencia de cualquier vicio.
      </p>

      <p>
        <span className="font-bold">OCTAVA. - PAGO DE SERVICIOS.</span> “EL ARRENDATARIO” se obliga al pago del suministro de energía eléctrica, agua, gas, servicios de telefonía y/o internet, y cualquier otro servicio que utilice en la operación de “EL INMUEBLE”.
      </p>

      <p>
        <span className="font-bold">NOVENA. - INCUMPLIMIENTO Y PENALIDADES.</span> Convienen “LAS PARTES” que en caso de retraso en el pago de la pensión rentaria, “EL ARRENDATARIO” pagará como pena convencional y por concepto de intereses moratorios obligatorios un <span className="font-bold">{c.terms.late_penalty_percent}% ({c.terms.late_penalty_percent} por ciento)</span> mensual sobre los saldos insolutos, aplicables desde el día siguiente a la fecha límite de pago. Adicionalmente, el incumplimiento de cualquiera de las obligaciones contraídas será causa de RESCISIÓN del contrato, sin necesidad de declaración judicial previa.
      </p>

      {c.guarantor.includes && (
        <p>
          <span className="font-bold">DÉCIMA. - FIADOR Y OBLIGADO SOLIDARIO.</span> “EL FIADOR” se constituye expresamente como deudor solidario y fiador principal pagador de todas las obligaciones que “EL ARRENDATARIO” contrae en el presente documento, renunciando expresamente a los beneficios de orden y excusión, vigiendo su responsabilidad hasta la entrega a entera satisfacción del inmueble.
        </p>
      )}

      {/* Cláusulas Adicionales */}
      {c.additional_clauses && (
        <p>
          <span className="font-bold">DÉCIMA. - CLÁUSULAS ADICIONALES PACTADAS.</span> “LAS PARTES” convienen expresamente en las siguientes condiciones específicas relativas a este arrendamiento: <span className="italic">"{c.additional_clauses}"</span>.
        </p>
      )}

      <p>
        ENTERADAS “LAS PARTES” CONTRATANTES DEL VALOR Y ALCANCE LEGAL DE TODAS Y CADA UNA DE LAS CLÁUSULAS EXPRESADAS, FIRMAN DE ENTERA CONFORMIDAD EL PRESENTE CONTRATO EN <span className="font-bold">NUEVO LEÓN, MÉXICO</span>.
      </p>

      <div className={`grid ${c.guarantor.includes ? 'grid-cols-3 gap-6' : 'grid-cols-2 gap-12'} mt-16 text-center`}>
        <div>
          <div className="border-b border-black mb-2 mx-4"></div>
          <p className="font-bold font-sans">“EL ARRENDADOR”</p>
          <p>{c.landlord.name || 'Nombre y Firma'}</p>
          <p className="text-[9px] mt-1">{c.landlord.id_number}</p>
        </div>
        <div>
          <div className="border-b border-black mb-2 mx-4"></div>
          <p className="font-bold font-sans">“EL ARRENDATARIO”</p>
          <p>{c.tenant.name || 'Nombre y Firma'}</p>
          <p className="text-[9px] mt-1">{c.tenant.id_number}</p>
        </div>
        {c.guarantor.includes && (
          <div>
            <div className="border-b border-black mb-2 mx-4"></div>
            <p className="font-bold font-sans">“EL FIADOR”</p>
            <p>{c.guarantor.name || 'Nombre y Firma'}</p>
            <p className="text-[9px] mt-1">{c.guarantor.id_number}</p>
          </div>
        )}
      </div>

      {c.property.furnished && (
        <div className="mt-16 pt-8 border-t border-gray-300 page-break-before">
          <h3 className="text-center font-bold mb-6">“ANEXO A”<br/>INVENTARIO DE MUEBLES</h3>
          <p className="mb-4">El arrendamiento de “EL INMUEBLE” se pacta en condición <span className="font-bold mb-4">AMUEBLADO</span>, incluyéndose a la firma del contrato y entrega de posesión los siguientes bienes muebles en correcto estado de uso y funcionamiento:</p>
          
          <ul className="list-disc pl-8 space-y-2">
            {Object.entries(c.property.inventory).map(([key, qty]) => {
              if (qty <= 0) return null;

              const labelMap: Record<string, string> = {
                sofas: 'Sofás o Sillones',
                camas: 'Camas / Colchones',
                tv: 'Televisiones',
                comedor: 'Mesas de Comedor y Sillas',
                refrigerador: 'Refrigerador',
                estufa: 'Estufa / Horno',
                climas: 'Aires Acondicionados / Minisplits',
                abanicos: 'Abanicos de Techo',
                boiler: 'Boiler / Calentador de Agua',
              };

              return (
                <li key={key}>
                  <span className="font-bold">{qty}</span> x {labelMap[key] || key}
                </li>
              );
            })}
            {c.property.additional_items?.filter(i => i.name.trim() && i.qty > 0).map((item) => (
              <li key={item.id}>
                <span className="font-bold">{item.qty}</span> x {item.name}
              </li>
            ))}
          </ul>

          <p className="mt-8 italic text-xs text-gray-500 text-justify">
             "EL ARRENDATARIO" se obliga a mantener los bienes listados en correcto estado, respondiendo por el detrimento de los mismos más allá de su uso normal, pudiendo "EL ARRENDADOR" descontar de la garantía cualquier falta o afectación reportada al término del arrendamiento.
          </p>
        </div>
      )}
    </div>
  );
}
