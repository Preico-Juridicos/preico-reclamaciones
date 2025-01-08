export interface Claim {
  currentStep: string;
  id: string;
  entidadBancaria?: string;
  tipo?: ClaimType;
  dni?: string;
  nombreCompleto?: string;
  numeroCuenta?: string;
  fecha_reclamacion?: {
    seconds: number;
    nanoseconds: number;
  }| Date;
  logo?: string;
}

export type ClaimType = "descubierto";
