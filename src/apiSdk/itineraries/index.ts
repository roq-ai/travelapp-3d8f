import axios from 'axios';
import queryString from 'query-string';
import { ItineraryInterface, ItineraryGetQueryInterface } from 'interfaces/itinerary';
import { GetQueryInterface } from '../../interfaces';

export const getItineraries = async (query?: ItineraryGetQueryInterface) => {
  const response = await axios.get(`/api/itineraries${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createItinerary = async (itinerary: ItineraryInterface) => {
  const response = await axios.post('/api/itineraries', itinerary);
  return response.data;
};

export const updateItineraryById = async (id: string, itinerary: ItineraryInterface) => {
  const response = await axios.put(`/api/itineraries/${id}`, itinerary);
  return response.data;
};

export const getItineraryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/itineraries/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteItineraryById = async (id: string) => {
  const response = await axios.delete(`/api/itineraries/${id}`);
  return response.data;
};
