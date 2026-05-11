/** Matches backend enum numeric serialization (camelCase JSON). */
export type OutageSeverity = 0 | 1 | 2 | 3;

/** Detected..Cancelled */
export type OutageStatus = 0 | 1 | 2 | 3 | 4 | 5;

/** PowerOutage, Planned, Network, Water, Other */
export type OutageType = 0 | 1 | 2 | 3 | 4;

/** OperatorAdmin, CitizenReport, AnonymousReport */
export type OutageReportSource = 0 | 1 | 2;

/** NewReport, Escalation, ResolvedConfirmation */
export type OutageNotificationKind = 0 | 1 | 2;

export const OUTAGE_SEVERITY_LABELS = ['Low', 'Medium', 'High', 'Critical'] as const;

export const OUTAGE_TYPE_LABELS = [
  'Power outage',
  'Planned',
  'Network',
  'Water',
  'Other',
] as const;

export const OUTAGE_STATUS_LABELS = [
  'Detected',
  'Confirmed',
  'Dispatched',
  'Restoring',
  'Restored',
  'Cancelled',
] as const;

export const OUTAGE_SOURCE_LABELS = [
  'Operator',
  'Citizen',
  'Anonymous',
] as const;

export interface AffectedServiceDto {
  id: number;
  name: string;
  environment: string;
  owner: string;
  criticality: string;
  createdAtUtc: string;
}

export interface OutageUpdateDto {
  id: number;
  message: string;
  createdAtUtc: string;
  createdByUserId: number | null;
}

/** Citizen-facing published outage (also client GET list). */
export interface PublicOutageDto {
  id: number;
  title: string;
  outageType: OutageType;
  severity: OutageSeverity;
  status: OutageStatus;
  publicMessage: string;
  postalCode: string | null;
  areaLabel: string | null;
  startedAtUtc: string;
  estimatedRestorationUtc: string | null;
  lastUpdateAtUtc: string;
}

export interface AdminOutageListDto {
  id: number;
  title: string;
  outageType: OutageType;
  severity: OutageSeverity;
  status: OutageStatus;
  isPublished: boolean;
  source: OutageReportSource;
  startedAtUtc: string;
  resolvedAtUtc: string | null;
  estimatedRestorationUtc: string | null;
  postalCode: string | null;
  reporterEmail: string;
  updatedAtUtc: string;
}

/** Operator full view + authenticated client detail. */
export interface AdminOutageDetailDto {
  id: number;
  title: string;
  description: string;
  publicMessage: string;
  outageType: OutageType;
  severity: OutageSeverity;
  status: OutageStatus;
  startedAtUtc: string;
  resolvedAtUtc: string | null;
  estimatedRestorationUtc: string | null;
  postalCode: string | null;
  areaLabel: string | null;
  street: string | null;
  assignedCrew: string;
  isPublished: boolean;
  source: OutageReportSource;
  contactEmail: string | null;
  reporterUserId: number | null;
  reporterEmail: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  affectedServices: AffectedServiceDto[];
  updates: OutageUpdateDto[];
}

export interface CreateOutageReportRequestDto {
  title: string;
  description: string;
  severity: OutageSeverity;
  status: OutageStatus;
  startedAtUtc: string;
  outageType: OutageType;
  publicMessage?: string | null;
  postalCode?: string | null;
  areaLabel?: string | null;
  street?: string | null;
  estimatedRestorationUtc?: string | null;
  contactEmail?: string | null;
  affectedServiceIds?: number[];
}

export interface UpdateOutageReportRequestDto {
  title: string;
  description: string;
  publicMessage: string;
  outageType: OutageType;
  severity: OutageSeverity;
  status: OutageStatus;
  startedAtUtc: string;
  resolvedAtUtc: string | null;
  estimatedRestorationUtc: string | null;
  postalCode: string | null;
  areaLabel: string | null;
  street: string | null;
  assignedCrew: string;
  isPublished: boolean;
  affectedServiceIds?: number[];
}

export interface AddOutageUpdateRequestDto {
  message: string;
}

export interface PublishOutageRequestDto {
  published: boolean;
}

export interface AnonymousPublicReportRequestDto {
  title: string;
  description: string;
  outageType: OutageType;
  severity: OutageSeverity;
  postalCode?: string | null;
  areaLabel?: string | null;
  street?: string | null;
  contactEmail?: string | null;
}

export interface AnonymousPublicReportResponseDto {
  id: number;
  message: string;
}

export interface OutageNotificationDto {
  id: number;
  outageReportId: number;
  kind: OutageNotificationKind;
  message: string;
  createdAtUtc: string;
  readAtUtc: string | null;
}

export interface AnalyticsKpisDto {
  activeOutageCount: number;
  mttrMinutes: number | null;
  openByType: KeyCountDto[];
  openBySeverity: KeyCountDto[];
  resolvedLast14Days: DailyCountDto[];
}

export interface KeyCountDto {
  key: string;
  count: number;
}

export interface DailyCountDto {
  day: string;
  resolvedCount: number;
}

export interface CreateAffectedServiceRequestDto {
  name: string;
  environment: string;
  owner: string;
  criticality: string;
}

export interface UpdateAffectedServiceRequestDto {
  name: string;
  environment: string;
  owner: string;
  criticality: string;
}
