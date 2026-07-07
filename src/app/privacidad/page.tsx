import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock } from "lucide-react";

export const metadata = {
  title: "Aviso de Privacidad | Renters",
  description: "Conoce cómo protegemos y encriptamos tus datos personales y documentos en Renters.mx.",
};

export default function PrivacidadPage() {
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
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4D6BFE] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header content */}
        <div className="mb-10 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#3B5998] bg-[#1A2352]/80 backdrop-blur-sm text-xs font-bold text-[#4D6BFE] uppercase tracking-wide mb-6">
             <ShieldCheck className="w-4 h-4" /> Legal y Transparencia
           </div>
           <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">Aviso de Privacidad</h1>
           <p className="text-gray-400">Última actualización: 8 de Abril de 2026</p>
        </div>
        
        {/* Prose Container */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-layout p-8 md:p-12">
          
          <div className="flex items-start gap-4 p-4 md:p-5 bg-blue-50/50 border border-blue-100 rounded-2xl mb-10">
             <Lock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
             <p className="text-sm text-blue-900 leading-relaxed font-medium">
               En <strong>Renters.mx</strong>, el resguardo de tu información es nuestra prioridad técnica y legal. Los datos sensibles que proporcionas (nombres, INEs, direcciones) son procesados exclusivamente para el ensamblaje inteligente de tu Contrato de Arrendamiento y no son compartidos con terceros con fines de lucro.
             </p>
          </div>

          <div className="prose prose-blue max-w-none text-text-muted prose-headings:text-gray-900 prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:mb-4 prose-p:leading-relaxed prose-li:leading-relaxed">
             
             <h2>1. Identidad y Domicilio del Responsable</h2>
             <p>Renters de México (en adelante "Renters"), con domicilio virtual y legal radicado en Monterrey, Nuevo León, México, es el responsable del uso y protección de sus datos personales, en estricto apego a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>

             <h2>2. Datos Personales que Recabamos</h2>
             <p>Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, el sistema motor de Renters recabará los siguientes datos, ya sea del Arrendador o del Inquilino:</p>
             <ul>
               <li><strong>Datos de Identificación:</strong> Nombre completo, Clave de Elector (INE de 18 dígitos), firma electrónica o física.</li>
               <li><strong>Datos de Contacto:</strong> Correo electrónico y número telefónico.</li>
               <li><strong>Datos Patrimoniales:</strong> Dirección del inmueble a arrendar, montos de renta, depósitos de garantía y especificaciones del inventario del inmueble.</li>
             </ul>

             <h2>3. Finalidades del Tratamiento de Datos</h2>
             <p>Los datos personales que recabamos de usted los utilizaremos automatizadamente para las siguientes finalidades primarias y necesarias:</p>
             <ul>
               <li>Asignación y redacción paramétrica del Contrato de Arrendamiento según la jurisdicción local aplicable (Ej. Nuevo León, Jalisco).</li>
               <li>Envío del formato digitalizado a su bandeja de correo electrónico institucional o personal tras la validación del pago.</li>
               <li>Asistencia de Soporte Técnico en caso de solicitud explícita de corrección de datos durante las preventivas 24 horas posteriores.</li>
             </ul>

             <h2>4. Transferencia de Datos</h2>
             <p>Renters certifica rotundamente que <strong>no</strong> comercializa, cede, ni transfiere su información a terceros para campañas de mercadeo, agencias de bienes raíces ni entidades de <i>data-brokering</i>. Los únicos entes que podrían visualizar los paquetes de datos cifrados son las pasarelas de pago y proveedores de infraestructura en la nube indispensables para despachar su documento, bajo estrictos contratos de confidencialidad de nivel Enterprise.</p>

             <h2>5. Derechos ARCO</h2>
             <p>Usted tiene derecho a conocer qué datos personales tenemos de usted (Acceso), solicitar la rectificación de sus datos si son inexactos (Rectificación), que los cancelemos de nuestros servidores transaccionales inmediatos (Cancelación) o a oponerse al uso de sus datos para fines específicos (Oposición). Para ejercer cualquiera de sus Derechos ARCO, por favor envíe una solicitud legal al área de privacidad a través de nuestra página de Contacto.</p>

             <h2>6. Cambios al Aviso</h2>
             <p>Este aviso de privacidad puede sufrir modificaciones derivadas de nuevos requerimientos macro-legales, actualizaciones en la redacción de los Códigos Civiles Estatales o cambios en nuestro modelo de servicio. Mantendremos a su disposición el borrador actualizado mediante nuestra página web <strong>renters.mx/privacidad</strong>.</p>
          </div>

        </div>

      </div>
      <Footer />
    </main>
  );
}
