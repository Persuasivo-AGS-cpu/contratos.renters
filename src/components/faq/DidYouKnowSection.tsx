export function DidYouKnowSection() {
  const facts = [
    {
      emoji: "⚖️",
      text: "Un contrato verbal de arrendamiento en México NO es ejecutable ante notario ni juez en caso de conflicto."
    },
    {
      emoji: "📆",
      text: "La ley obliga a incluir la fecha exacta de inicio y duración en todo contrato de arrendamiento para que tenga validez."
    },
    {
      emoji: "🏠",
      text: "El depósito de garantía no puede exceder el equivalente a 2 meses de renta según la mayoría de los códigos civiles estatales."
    }
  ];

  return (
    <section className="w-full bg-[#f8f9fa] py-24 px-6 border-t border-gray-200">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-[#6b7280] text-[13px] font-bold tracking-[0.2em] mb-12 uppercase text-center">
          ¿Sabías que?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {facts.map((fact, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col">
              <span className="text-3xl mb-6 block">{fact.emoji}</span>
              <p className="text-[#4b5563] text-[15px] font-medium leading-relaxed">
                {fact.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
