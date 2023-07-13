import * as yup from 'yup';

export const todoValidationSchema = yup.object().shape({
  task: yup.string().required(),
  itinerary_id: yup.string().nullable(),
});
