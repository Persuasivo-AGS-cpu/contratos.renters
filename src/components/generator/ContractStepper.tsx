"use client";

import { useContractStore } from '@/store/useContractStore';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const STEPS = [
  { id: 1, title: 'Estado' },
  { id: 2, title: 'Propiedad' },
  { id: 3, title: 'Arrendador' },
  { id: 4, title: 'Inquilino' },
  { id: 5, title: 'Términos' },
  { id: 6, title: 'Condiciones' },
  { id: 7, title: 'Resumen' },
];

export function ContractStepper() {
  const currentStep = useContractStore((state) => state.currentStep);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = scrollContainerRef.current?.querySelector('[data-active="true"]');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStep]);

  return (
    <div ref={scrollContainerRef} className="flex items-center justify-start gap-2 md:gap-4 w-full mb-8 overflow-x-auto pb-4 scrollbar-hide shrink-0 snap-x">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} data-active={isCurrent} className="flex items-center shrink-0 snap-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors",
                  isCompleted
                    ? "bg-[#10b981] text-white"
                    : isCurrent
                    ? "bg-[#4F46E5] text-white"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[13px] font-bold whitespace-nowrap hidden md:block",
                  isCurrent || isCompleted ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("mx-2 md:mx-3 w-4 md:w-8 h-[2px]", isCompleted ? "bg-[#10b981]" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
