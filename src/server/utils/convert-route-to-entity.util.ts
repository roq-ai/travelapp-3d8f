const mapping: Record<string, string> = {
  budgets: 'budget',
  itineraries: 'itinerary',
  organizations: 'organization',
  todos: 'todo',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
