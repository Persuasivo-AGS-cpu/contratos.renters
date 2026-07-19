import { Footer } from "@/components/layout/Footer";
import { CopyCheck, Scale } from "lucide-react";
import { getAvailableStatesList } from "@/lib/states";

export const metadata = {
  title: "Términos y Condiciones | Renters",
  description: "Condiciones de uso y limitación de responsabilidad de la plataforma de generación legal Renters.mx.",
};

export default function TerminosPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface-subtle flex flex-col font-sans relative">
      
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-[#0a0f1c] z-0 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.1
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4D6BFE] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header content */}
        <div className="mb-10 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#3B5998] bg-[#1A2352]/80 backdrop-blur-sm text-xs font-bold text-[#4D6BFE] uppercase tracking-wide mb-6">
             <Scale className="w-4 h-4" /> Normativa de Plataforma
           </div>
           <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">Términos y Condiciones</h1>
           <p className="text-gray-400">Última actualización: 8 de Abril de 2026</p>
        </div>
        
        {/* Prose Container */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-layout p-8 md:p-12">
          
          <div className="flex items-start gap-4 p-4 md:p-5 bg-amber-50 border border-amber-100 rounded-2xl mb-10">
             <CopyCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
             <p className="text-sm text-amber-900 leading-relaxed font-medium">
               Renters.mx es una plataforma tecnológica automatizada de <strong>Software Legal</strong> (LegalTech). Si bien nuestros algoritmos y plantillas son redactados por despachos de abogados capacitados en materia inmobiliaria local, <strong>Renters no funge como tu representante legal humano privado.</strong> 
             </p>
          </div>

          <div className="prose prose-blue max-w-none text-text-muted prose-headings:text-gray-900 prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:mb-4 prose-p:leading-relaxed prose-li:leading-relaxed">
             
             <h2>1. Aceptación del Servicio</h2>
             <p>Al acceder, navegar o realizar cualquier uso del Generador de Contratos de Renters.mx ("La Plataforma"), usted declara conocer y acatar los presentes Términos y Condiciones, obligándose a no malversar el uso del sistema tecnológico aquí proporcionado.</p>

             <h2>2. Descripción de la Herramienta "Generador"</h2>
             <p>Renters facilita la elaboración electrónica de Contratos de Arrendamiento Residencial y Comercial, adaptando automáticamente el clausulado basándose en el Código Civil de la Entidad Federativa seleccionada (Actualmente operando limitadamente en: {getAvailableStatesList()}). La plataforma inserta los datos inyectados por el usuario ("Usted") dentro de estas planillas pre-fijadas.</p>

             <h2>3. Obligación de Veracidad de Datos</h2>
             <p>Renters procesa de "buena fe" la información inyectada por el cliente. Queda bajo su estricta y exclusiva responsabilidad la veracidad de:</p>
             <ul>
               <li>Las identificaciones (Claves INE/IFE correspondientes).</li>
               <li>Capacidad jurídica para disponer del bien mueble o inmueble a arrendar.</li>
               <li>Dominios, números, registros fiscales o nombres propios de las partes involucradas.</li>
             </ul>
             <p>Nos reservamos el derecho de revocar servicios en caso de detectar dolo, fraude de identidad (phishing) o generación de contratos falsos.</p>

             <h2>4. Pagos, Entregables y Política de Reembolso</h2>
             <p>El uso del sistema finaliza al realizar el desembolso por Honorarios Operativos del Software (Costo expresado en MXN, sujeto a los recargos con tarjeta en Stripe). Tras un pago exitoso, la Plataforma librará la descarga inmediata del Contrato en extensión <strong>.pdf</strong>, e intentará mandarlo por vías secundarias de correo.</p>
             <p><strong>Devoluciones:</strong> Por la naturaleza instantánea y enteramente digital e inteligible de los documentos producidos por nuestro ecosistema, <strong>no existen cancelaciones ni reembolsos monetarios</strong> después del envío del contrato a su cuenta de correo u ordenador.</p>
             <p><strong>Enmiendas:</strong> Como cortesía, Renters otorga 24 horas continuas, sin costo alguno, si el cliente desea rehacer un contrato expedido para arreglar los errores ortográficos o de captura de los cuales él mismo fuera responsable (Por vía del Módulo de Contacto).</p>

             <h2>5. Renuncia Legal y Limitación de Responsabilidad</h2>
             <p>Renters.mx le otorga soporte tecnológico y plantillas fidedignas; sin embargo, no representa ningún Despacho de Abogados, no establece relación Abogado-Cliente, ni asume responsabilidad por la invalidez del documento en corte si éste fuere contravenido por leyes de otra índole por mal accionar de las partes. Es su responsabilidad revisar el documento con su jurista personal en caso de recaer en circunstancias extraordinarias o agravadas.</p>

             <h2>6. Propiedad Intelectual e Industrial</h2>
             <p>Los algoritmos lógicos determinantes, las plantillas blindadas, logotipos y el sistema de ruteo de información de esta plataforma están estrictamente protegidos bajo las leyes de Derechos de Autor sobre Código de Software en los Estados Unidos Mexicanos y Tratados Internacionales. Prohibida la utilización de nuestros contratos base para la comercialización a terceros por abogados externos. Queda estrictamente vetado automatizar peticiones a la API del generador.</p>

             <h2>7. Ley Aplicable</h2>
             <p>El uso de la presente plataforma se constriñe y ampara bajo las Disposiciones Legales de los Estados Unidos Mexicanos, sometiéndose de mutuo acuerdo para cualquier disputa comercial al tribunal especializado ubicado en San Pedro Garza García, N.L., México, renunciando explícitamente a cualquier otro foro o jurisprudencia transaccional.</p>

          </div>

        </div>

      </div>
      <Footer />
    </main>
  );
}
