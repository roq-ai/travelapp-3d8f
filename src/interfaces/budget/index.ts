import { ItineraryInterface } from 'interfaces/itinerary';
import { GetQueryInterface } from 'interfaces';

export interface BudgetInterface {
  id?: string;
  amount: number;
  itinerary_id?: string;
  created_at?: any;
  updated_at?: any;

  itinerary?: ItineraryInterface;
  _count?: {};
}

export interface BudgetGetQueryInterface extends GetQueryInterface {
  id?: string;
  itinerary_id?: string;
}
