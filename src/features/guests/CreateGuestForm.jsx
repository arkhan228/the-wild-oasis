import { Controller, useForm } from 'react-hook-form';
import Input from '../../ui/Input';
import FormRow from '../../ui/FormRow';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import { useCountries } from '../../hooks/useCountries';
import ReactSelect from 'react-select';
import styles from '../../styles/ReactSelectStyles';
import { useCreateGuest } from './useCreateGuest';
import { useUpdateGuest } from './useUpdateGuest';

/**
 * Renders a form for creating or updating a guest.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onCloseModal - The function to close the modal.
 * @param {Object} [props.guestData={}] - The guest data for editing.
 * @return {JSX.Element} The rendered form.
 */
function CreateGuestForm({ onCloseModal, guestData = {} }) {
  // Check if it's an edit session
  const editSession = guestData.id ? true : false;
  // Get countries to display in dropdown
  const { countries, isLoadingCountries } = useCountries();
  const { createGuest, isCreatingGuest } = useCreateGuest();
  const { updateGuest, isUpdatingGuest } = useUpdateGuest();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...guestData,
      nationality: guestData?.nationality
        ? {
            label: guestData?.nationality,
            value: guestData?.countryFlag.slice(-6, -4).toUpperCase(),
          }
        : null,
    },
  });

  const nationality = watch('nationality')?.label || null;
  const countryCode = watch('nationality')?.value || null;

  function onSubmit(data) {
    delete data?.bookings;
    if (editSession)
      return updateGuest(
        {
          ...data,
          nationality,
          countryFlag: `https://flagcdn.com/${countryCode?.toLowerCase()}.svg`,
        },
        {
          onSuccess: () => onCloseModal?.(),
        }
      );
    else
      return createGuest(
        {
          ...data,
          nationality,
          countryFlag: `https://flagcdn.com/${countryCode?.toLowerCase()}.svg`,
        },
        {
          onSuccess: () => onCloseModal?.(),
        }
      );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label='Full name' error={errors.fullName?.message}>
        <Input
          type='text'
          id='fullName'
          {...register('fullName', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label='Email address' error={errors.email?.message}>
        <Input
          type='email'
          id='email'
          disabled={editSession}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: 'Invalid email address',
            },
          })}
        />
      </FormRow>

      <FormRow label='Nationality' error={errors?.nationality?.message}>
        <Controller
          control={control}
          name='nationality'
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <ReactSelect
              {...field}
              options={countries?.map(country => {
                return {
                  label: country.name.common,
                  value: country.cca2,
                };
              })}
              noOptionsMessage={() => 'Countries could not be loaded'}
              styles={styles}
              placeholder='Select a country'
              isLoading={isLoadingCountries}
            />
          )}
        />
      </FormRow>

      <FormRow label='National ID' error={errors?.nationalID?.message}>
        <Input
          type='text'
          id='nationalID'
          {...register('nationalID', {
            required: 'This field is required',
            pattern: {
              value: /^[A-Za-z0-9]{9,16}$/,
              message: 'Invalid National ID',
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          type='reset'
          variation='secondary'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>

        <Button disabled={isCreatingGuest || isUpdatingGuest}>Add guest</Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
