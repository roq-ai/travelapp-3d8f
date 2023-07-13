import * as yup from 'yup';

export const budgetValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  itinerary_id: yup.string().nullable(),
});
