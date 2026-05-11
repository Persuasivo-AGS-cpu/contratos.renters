import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContractState = {
  state: 'nuevo-leon' | 'jalisco' | 'cdmx' | 'edomex' | '';
  property: {
    address: {
      street: string;
      ext_num: string;
      int_num: string;
      neighborhood: string;
      municipality: string;
      zip_code: string;
      state: string;
    };
    type: 'departamento' | 'casa' | 'local' | 'oficina' | '';
    furnished: boolean;
    inventory: Record<string, number>;
    additional_items: Array<{ id: string; name: string; qty: number }>;
  };
  landlord: { name: string; id_number: string; email: string; phone: string; address: string };
  tenant: { name: string; id_number: string; email: string; phone: string; address: string };
  terms: {
    monthly_rent: number;
    deposit_amount: number;
    lease_duration_months: number;
    lease_start_date: string;
    payment_method: string;
    payment_day: number;
    late_penalty_percent: number;
    bank_name: string;
    bank_account: string;
    bank_clabe: string;
    is_valid_clabe: boolean;
    early_termination_penalty_months: number;
  };
  guarantor: { 
    includes: boolean; 
    name: string; 
    id_number: string;
    address: string;
    phone: string;
    email: string;
  };
  additional_clauses: string;
  status: 'pending' | 'paid' | 'completed';
  selectedPlan: 'basico' | 'proteccion' | 'pack' | null;
};

type ContractStore = {
  contract: ContractState;
  currentStep: number;
  updateContract: (section: keyof ContractState, data: any) => void;
  resetContract: () => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const initialState: ContractState = {
  state: '',
  property: { 
    address: { street: '', ext_num: '', int_num: '', neighborhood: '', municipality: '', zip_code: '', state: '' }, 
    type: '', 
    furnished: false, 
    inventory: {},
    additional_items: []
  },
  landlord: { name: '', id_number: '', email: '', phone: '', address: '' },
  tenant: { name: '', id_number: '', email: '', phone: '', address: '' },
  terms: {
    monthly_rent: 0,
    deposit_amount: 0,
    lease_duration_months: 12,
    lease_start_date: '',
    payment_method: 'transferencia',
    payment_day: 5,
    late_penalty_percent: 10,
    bank_name: 'BANORTE',
    bank_account: '',
    bank_clabe: '',
    is_valid_clabe: false,
    early_termination_penalty_months: 2,
  },
  guarantor: { 
    includes: false, 
    name: '', 
    id_number: '',
    address: '',
    phone: '',
    email: ''
  },
  additional_clauses: '',
  status: 'pending',
  selectedPlan: 'basico',
};

export const useContractStore = create<ContractStore>()(
  persist(
    (set) => ({
      contract: initialState,
      currentStep: 1,
  updateContract: (section, data) =>
    set((state) => ({
      contract: {
        ...state.contract,
        [section]: typeof data === 'object' && !Array.isArray(data)
          ? { ...(state.contract[section] as any), ...data }
          : data,
      },
    })),
  resetContract: () => set({ contract: initialState, currentStep: 1 }),
  setStep: (step: number) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    }),
    {
      name: 'renters-contract-storage',
    }
  )
);
