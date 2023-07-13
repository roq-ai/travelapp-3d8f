import { BudgetInterface } from 'interfaces/budget';
import { TodoInterface } from 'interfaces/todo';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ItineraryInterface {
  id?: string;
  name: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  budget?: BudgetInterface[];
  todo?: TodoInterface[];
  organization?: OrganizationInterface;
  _count?: {
    budget?: number;
    todo?: number;
  };
}

export interface ItineraryGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  organization_id?: string;
}
