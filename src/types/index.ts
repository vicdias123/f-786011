
// Legal Case Types
export enum CaseType {
  CIVIL = "Cível",
  CRIMINAL = "Criminal",
  LABOR = "Trabalhista",
  FAMILY = "Família",
  CORPORATE = "Empresarial"
}

export enum CaseStatus {
  ACTIVE = "Em Andamento",
  SUSPENDED = "Suspenso",
  CLOSED = "Encerrado",
  APPEALING = "Em Recurso"
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  type: CaseType;
  clientName: string;
  description: string;
  openingDate: string;
  lastUpdate: string;
  status: CaseStatus;
  estimatedValue: number;
  responsibleLawyer: string;
}

// Lawyer Types
export enum LawyerRole {
  JUNIOR = "Advogado Júnior",
  SENIOR = "Advogado Sênior",
  PARTNER = "Sócio",
  PARALEGAL = "Paralegal"
}

export enum CertificateStatus {
  REGULAR = "Regular",
  WARNING = "Próximo do Vencimento",
  EXPIRED = "Vencido"
}

export interface Lawyer {
  id: string;
  name: string;
  role: LawyerRole;
  oab: string;
  contact: string;
  specialization: string;
  registrationDate: string;
  oabExpirationDate: string;
  cppExpirationDate: string;
  oabStatus: CertificateStatus;
  cppStatus: CertificateStatus;
}

// Legal Activity Types
export interface LegalActivity {
  id: string;
  lawyerId: string;
  lawyerName: string;
  caseId: string;
  caseNumber: string;
  activityType: string;
  description: string;
  initialTime: number;
  currentTime?: number;
  billableHours?: number;
  startTime: string;
  endTime?: string;
  status: "active" | "completed";
}

// Document Management Types
export enum DocumentStatus {
  PENDING = "Pendente",
  IN_REVIEW = "Em Revisão",
  COMPLETED = "Concluído"
}

export interface Document {
  id: string;
  caseId: string;
  caseNumber: string;
  documentType: string;
  createdBy: string;
  creationDate: string;
  status: DocumentStatus;
  deadline?: string;
}

// Billing Types
export interface Billing {
  id: string;
  date: string;
  caseId: string;
  caseNumber: string;
  hours: number;
  hourlyRate: number;
  totalAmount: number;
  lawyer: string;
}

// Dashboard Types
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  suspendedCases: number;
  closedCases: number;
  totalLawyers: number;
  lawyersWithValidCertificates: number;
  lawyersWithWarningCertificates: number;
  lawyersWithExpiredCertificates: number;
  activeActivities: number;
  pendingDocuments: number;
}

// Common Component Props
export interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  status?: "success" | "warning" | "danger" | "info" | "neutral";
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
}

// Legacy types for compatibility
export type Operation = LegalActivity;
export type User = Lawyer;
export type Forklift = LegalCase;
export type Maintenance = Document;
export type GasSupply = Billing;

export enum ForkliftType {
  GAS = "Gás",
  ELECTRIC = "Elétrica", 
  RETRACTABLE = "Retrátil"
}

export enum ForkliftStatus {
  OPERATIONAL = "Em Operação",
  STOPPED = "Parada",
  MAINTENANCE = "Aguardando Manutenção"
}

export enum UserRole {
  OPERATOR = "Operador",
  SUPERVISOR = "Supervisor", 
  ADMIN = "Administrador"
}

export enum MaintenanceStatus {
  WAITING = "Aguardando",
  IN_PROGRESS = "Em andamento",
  COMPLETED = "Concluído"
}
