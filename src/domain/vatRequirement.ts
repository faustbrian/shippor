export type VatRequirementLevel =
  | 'mandatory'
  | 'required'
  | 'often_required'
  | 'usually_required'
  | 'sometimes_required'
  | 'can_be_required'
  | 'occasionally_required'
  | 'may_be_required'
  | 'often_needed'
  | 'frequently_required'
  | 'commonly_required'
  | 'optional';

export const VAT_REQUIREMENTS_BY_COUNTRY: Record<
  string,
  {
    level: VatRequirementLevel;
    taxIdTypes: string[];
  }
> = {
  BR: { level: 'mandatory', taxIdTypes: ['CPF (individual)', 'CNPJ (business)'] },
  KR: { level: 'mandatory', taxIdTypes: ['PCCC (Personal Customs Clearance Code)'] },
  CN: { level: 'required', taxIdTypes: ['Resident ID', 'Customs Reg. Code'] },
  TW: { level: 'required', taxIdTypes: ['National ID', 'GUI number'] },
  TR: { level: 'required', taxIdTypes: ['TCKN (individual)', 'VKN (business)'] },
  AR: { level: 'often_required', taxIdTypes: ['CUIT', 'CUIL'] },
  CO: { level: 'often_required', taxIdTypes: ['NIT', 'Cedula de Ciudadania'] },
  ID: { level: 'often_required', taxIdTypes: ['NPWP'] },
  VN: { level: 'often_needed', taxIdTypes: ['Tax Code', 'ID'] },
  CL: { level: 'usually_required', taxIdTypes: ['RUT'] },
  PE: { level: 'sometimes_required', taxIdTypes: ['RUC', 'DNI'] },
  CR: { level: 'sometimes_required', taxIdTypes: ['DNI', 'ID number'] },
  AE: { level: 'sometimes_required', taxIdTypes: ['Emirates ID', 'Trade license'] },
  EC: { level: 'can_be_required', taxIdTypes: ['RUC', 'Cedula'] },
  ZA: { level: 'can_be_required', taxIdTypes: ['National ID', 'Tax ID'] },
  PA: { level: 'occasionally_required', taxIdTypes: ['RUC'] },
  IN: { level: 'may_be_required', taxIdTypes: ['PAN (Permanent Account Number)'] },
  NG: { level: 'may_be_required', taxIdTypes: ['National ID', 'Tax ID'] },
  TH: { level: 'frequently_required', taxIdTypes: ['Tax ID', 'Passport'] },
  SA: { level: 'commonly_required', taxIdTypes: ['National ID', 'Iqama', 'CR Number'] },
};

export function shouldShowVatField(country: string): boolean {
  return country in VAT_REQUIREMENTS_BY_COUNTRY;
}

export function isVatFieldRequired(country: string): boolean {
  const level = VAT_REQUIREMENTS_BY_COUNTRY[country]?.level;
  return level === 'mandatory' || level === 'required';
}

export function getVatTaxIdTypes(country: string): string[] {
  return VAT_REQUIREMENTS_BY_COUNTRY[country]?.taxIdTypes ?? [];
}
