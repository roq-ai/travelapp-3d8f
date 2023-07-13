import axios from 'axios';
import queryString from 'query-string';
import { BudgetInterface, BudgetGetQueryInterface } from 'interfaces/budget';
import { GetQueryInterface } from '../../interfaces';

export const getBudgets = async (query?: BudgetGetQueryInterface) => {
  const response = await axios.get(`/api/budgets${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBudget = async (budget: BudgetInterface) => {
  const response = await axios.post('/api/budgets', budget);
  return response.data;
};

export const updateBudgetById = async (id: string, budget: BudgetInterface) => {
  const response = await axios.put(`/api/budgets/${id}`, budget);
  return response.data;
};

export const getBudgetById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/budgets/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBudgetById = async (id: string) => {
  const response = await axios.delete(`/api/budgets/${id}`);
  return response.data;
};
