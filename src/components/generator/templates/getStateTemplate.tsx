import { NuevoLeonTemplate } from "./NuevoLeonTemplate";
import { JaliscoTemplate } from "./JaliscoTemplate";
import { QueretaroTemplate } from "./QueretaroTemplate";
import { MeridaTemplate } from "./MeridaTemplate";
import { SanLuisPotosiTemplate } from "./SanLuisPotosiTemplate";
import { CoahuilaTemplate } from "./CoahuilaTemplate";
import { getLegalStateName } from "@/lib/states";

export function getStateTemplate(state: string) {
  switch (state) {
    case 'jalisco': return JaliscoTemplate;
    case 'queretaro': return QueretaroTemplate;
    case 'merida': return MeridaTemplate;
    case 'san-luis-potosi': return SanLuisPotosiTemplate;
    case 'coahuila': return CoahuilaTemplate;
    default: return NuevoLeonTemplate;
  }
}

export function getStateName(state: string): string {
  return getLegalStateName(state).toUpperCase();
}
