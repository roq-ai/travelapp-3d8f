import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getBudgetById, updateBudgetById } from 'apiSdk/budgets';
import { Error } from 'components/error';
import { budgetValidationSchema } from 'validationSchema/budgets';
import { BudgetInterface } from 'interfaces/budget';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ItineraryInterface } from 'interfaces/itinerary';
import { getItineraries } from 'apiSdk/itineraries';

function BudgetEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BudgetInterface>(
    () => (id ? `/budgets/${id}` : null),
    () => getBudgetById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BudgetInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBudgetById(id, values);
      mutate(updated);
      resetForm();
      router.push('/budgets');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BudgetInterface>({
    initialValues: data,
    validationSchema: budgetValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Budget
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                name="amount"
                value={formik.values?.amount}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ItineraryInterface>
              formik={formik}
              name={'itinerary_id'}
              label={'Select Itinerary'}
              placeholder={'Select Itinerary'}
              fetcher={getItineraries}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'budget',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BudgetEditPage);
