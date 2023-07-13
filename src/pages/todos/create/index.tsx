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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createTodo } from 'apiSdk/todos';
import { Error } from 'components/error';
import { todoValidationSchema } from 'validationSchema/todos';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ItineraryInterface } from 'interfaces/itinerary';
import { getItineraries } from 'apiSdk/itineraries';
import { TodoInterface } from 'interfaces/todo';

function TodoCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: TodoInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createTodo(values);
      resetForm();
      router.push('/todos');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TodoInterface>({
    initialValues: {
      task: '',
      itinerary_id: (router.query.itinerary_id as string) ?? null,
    },
    validationSchema: todoValidationSchema,
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
            Create Todo
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="task" mb="4" isInvalid={!!formik.errors?.task}>
            <FormLabel>Task</FormLabel>
            <Input type="text" name="task" value={formik.values?.task} onChange={formik.handleChange} />
            {formik.errors.task && <FormErrorMessage>{formik.errors?.task}</FormErrorMessage>}
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
    entity: 'todo',
    operation: AccessOperationEnum.CREATE,
  }),
)(TodoCreatePage);
