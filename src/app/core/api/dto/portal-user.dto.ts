export interface PortalUserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roles: string[];
}
