"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export type Duda = { q: string; a: string; accion?: { label: string; href: string } };

export function DudasAccordion({ items }: { items: Duda[] }) {
  return (
    <Accordion.Root type="single" collapsible defaultValue="d0" className="space-y-3">
      {items.map((d, i) => (
        <Accordion.Item
          key={d.q}
          value={`d${i}`}
          className="overflow-hidden rounded-2xl border border-border-layout bg-white transition-all data-[state=open]:border-[#3563E9]/40 data-[state=open]:shadow-lg data-[state=open]:shadow-blue-900/5"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-text-main">
              {d.q}
              <ChevronDown className="size-5 shrink-0 text-[#3563E9] transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-6 pb-5 leading-relaxed text-text-muted">
            <p>{d.a}</p>
            {d.accion && (
              <Link href={d.accion.href} className="mt-3 inline-block font-semibold text-[#3563E9] hover:underline">
                {d.accion.label}
              </Link>
            )}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
