export enum PassportStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  USED = 'USED',
  CANCELLED = 'CANCELLED',
}

export interface Location {
  id: string;
  name: string;
  type: 'REGION' | 'DISTRICT' | 'COMMUNE' | 'VILLAGE';
  code?: string;
  parentId?: string;
  regionId?: string;
  districtId?: string;
  communeId?: string;
}

export interface Applicant {
  id: string;
  name: string;
  cinNumber: string;
  cinIssueDate: string;
  cinIssueLocation: string;
  residenceCommuneId?: string;
  villageId?: string;
  communeId?: string;
  districtId?: string;
  regionId?: string;
  // Legacy fields
  residenceCommune?: string;
  village?: string;
  commune?: string;
  district?: string;
  region?: string;
}

export interface PassportCattleSnapshot {
  id: string;
  passportId: string;
  herdBookCattleId: string;
  nCarnet: string;
  characterName: string;
  name: string;
  brand: string;
  quantity: number;
  snapshotDate: string;
}

export interface HerdBookCattlePassport {
  id: string;
  passportId: string;
  herdBookCattleId: string;
  snapshotId?: string;
  snapshot?: PassportCattleSnapshot;
  herdBookCattle?: {
    id: string;
    nCarnet: string;
    cattle?: {
      id: string;
      name: string;
      brand: string;
      character?: {
        id: string;
        name: string;
      };
    };
  };
}

export interface PassportAudit {
  id: string;
  passportId: string;
  action: 'CREATED' | 'UPDATED' | 'GENERATED' | 'CANCELLED' | 'USED' | 'STATUS_CHANGED';
  previousStatus?: PassportStatus;
  newStatus?: PassportStatus;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  reason?: string;
  createdAt: string;
}

export interface Passport {
  id: string;
  passportNumber: string;
  // Emission information
  location: string;
  issueDate: string;
  district: string;
  // Applicant information
  applicantId?: string;
  applicant?: Applicant;
  // Legacy applicant fields
  applicantName?: string;
  cinNumber?: string;
  cinIssueDate?: string;
  cinIssueLocation?: string;
  // Residence information with Location references
  residenceCommuneId?: string;
  residenceCommune?: Location;
  villageId?: string;
  village?: Location;
  communeId?: string;
  commune?: Location;
  residenceDistrictId?: string;
  residenceDistrict?: Location;
  regionId?: string;
  region?: Location;
  // Legacy residence fields
  residenceCommuneLegacy?: string;
  villageLegacy?: string;
  communeLegacy?: string;
  residenceDistrictLegacy?: string;
  regionLegacy?: string;
  // Transfer information
  purchaseCommune: string;
  totalCattle: number;
  // Verification information
  verificationDate: string;
  arreteDate: string;
  // Status and metadata
  status: PassportStatus;
  generatedAt?: string;
  generatedBy?: string;
  qrCode?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  herdBookId: string;
  cattle: HerdBookCattlePassport[];
  snapshots?: PassportCattleSnapshot[];
  audits?: PassportAudit[];
}

export interface CreatePassportDto {
  passportNumber: string;
  location: string;
  issueDate: string;
  district: string;
  applicantName: string;
  cinNumber: string;
  cinIssueDate: string;
  cinIssueLocation: string;
  residenceCommune: string;
  village: string;
  commune: string;
  residenceDistrict: string;
  region: string;
  purchaseCommune: string;
  totalCattle: number;
  verificationDate: string;
  arreteDate: string;
  herdBookId: string;
  cattleIds: string[];
}
