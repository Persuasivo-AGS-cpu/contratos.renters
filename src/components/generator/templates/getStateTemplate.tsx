import { NuevoLeonTemplate } from "./NuevoLeonTemplate";
import { JaliscoTemplate } from "./JaliscoTemplate";
import { QueretaroTemplate } from "./QueretaroTemplate";
import { MeridaTemplate } from "./MeridaTemplate";
import { SanLuisPotosiTemplate } from "./SanLuisPotosiTemplate";

export function getStateTemplate(state: string) {
  switch (state) {
    case 'jalisco': return JaliscoTemplate;
    case 'queretaro': return QueretaroTemplate;
    case 'merida': return MeridaTemplate;
    case 'san-luis-potosi': return SanLuisPotosiTemplate;
    default: return NuevoLeonTemplate;
  }
}

export function getStateName(state: string): string {
  switch (state) {
    case 'nuevo-leon': return 'NUEVO LEÓN';
    case 'jalisco': return 'JALISCO';
    case 'queretaro': return 'QUERÉTARO';
    case 'merida': return 'YUCATÁN';
    case 'san-luis-potosi': return 'SAN LUIS POTOSÍ';
    case 'cdmx': return 'CIUDAD DE MÉXICO';
    case 'edomex': return 'ESTADO DE MÉXICO';
    default: return '[ESTADO SELECCIONADO]';
  }
}
