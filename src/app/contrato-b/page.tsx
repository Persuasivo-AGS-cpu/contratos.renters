import { Suspense } from "react";
import { ContratoBEngine } from "@/components/generator/variant-b/ContratoBEngine";

export default function ContratoBPage() {
  return (
    <Suspense>
      <ContratoBEngine />
    </Suspense>
  );
}
