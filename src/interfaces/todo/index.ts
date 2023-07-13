import { ItineraryInterface } from 'interfaces/itinerary';
import { GetQueryInterface } from 'interfaces';

export interface TodoInterface {
  id?: string;
  task: string;
  itinerary_id?: string;
  created_at?: any;
  updated_at?: any;

  itinerary?: ItineraryInterface;
  _count?: {};
}

export interface TodoGetQueryInterface extends GetQueryInterface {
  id?: string;
  task?: string;
  itinerary_id?: string;
}
