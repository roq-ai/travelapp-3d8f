interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Travel Planner'],
  customerRoles: [],
  tenantRoles: ['Travel Planner'],
  tenantName: 'Organization',
  applicationName: 'Travelapp',
  addOns: ['chat', 'notifications', 'file'],
};
