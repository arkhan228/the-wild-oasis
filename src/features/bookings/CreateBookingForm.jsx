import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from 'react-select';
import { addDays, eachDayOfInterval, format, isToday } from 'date-fns';
import { formatCurrency, subtractDates } from '../../utils/helpers';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import Checkbox from '../../ui/Checkbox';
import Button from '../../ui/Button';

import { useSettings } from '../settings/useSettings';
import { useCabins } from '../cabins/useCabins';
import { useCabin } from '../cabins/useCabin';
import { useCreateBooking } from './useCreateBooking';
import { useGuests } from '../guests/useGuests';

import styles from '../../styles/ReactSelectStyles';

/**
 * Renders a form for creating a booking. The form allows the user to select a guest,
 * specify the number of guests, choose a cabin, set the start and end dates of the booking,
 * provide any observations, and determine if breakfast is included and if the payment is made.
 * The form also displays the total price of the booking.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.onCloseModal - The function to close the modal.
 * @param {string|null} [props.selectedCabinId=null] - The ID of the selected cabin.
 * @param {string|null} [props.guestId=null] - The ID of the selected guest.
 * @return {JSX.Element} The rendered form.
 */
function CreateBookingForm({
  onCloseModal,
  selectedCabinId = null,
  guestId = null,
}) {
  // Cabins to display in the dropdown
  const { cabins, isLoading } = useCabins();
  // Guests to display in the dropdown
  const { guests, isLoading: isLoadingGuests } = useGuests();
  // Create booking function
  const { createBooking, isCreatingBooking } = useCreateBooking();
  const {
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSettings();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Getting the selected cabin in case form is opened from a cabin
  const selectedCabin = cabins?.find(cabin => cabin.id === selectedCabinId);

  // Setting the respective values in the form based on selected cabin or guest
  useEffect(() => {
    if (guestId) setValue('guestId', guestId);

    if (selectedCabinId) {
      setValue('cabinId', selectedCabinId);
      setValue('numGuests', selectedCabin.maxCapacity);
    }
  }, [setValue, guestId, selectedCabinId, selectedCabin]);

  // Getting the selected cabin to manage already booked dates
  const cabinId = watch('cabinId');
  const { cabin, isLoadingCabin } = useCabin(cabinId);

  // Getting the dates for other calculations
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const numGuests = watch('numGuests');

  // Setting initial binary values to false
  const hasBreakfast = watch('hasBreakfast', false);
  const isPaid = watch('isPaid', false);
  const status = watch('status', false);

  // Calculating number of nights guest will stay based on start and end dates
  const numNights = subtractDates(
    endDate?.toISOString(),
    startDate?.toISOString()
  );

  const extrasPrice = hasBreakfast ? numNights * breakfastPrice * numGuests : 0;
  const cabinPrice = (cabin?.regularPrice - cabin?.discount) * numNights || 0;
  const totalPrice = cabinPrice + extrasPrice;

  // Calculating already booked dates to disable them in the datepicker
  const alreadyBooked = cabin?.bookings?.map(b => {
    return {
      start: new Date(b.startDate),
      end: new Date(b.endDate),
    };
  });

  // Getting individual dates of already booked dates to prevent them from being in the range
  const bookedDates = alreadyBooked
    ?.map(b => eachDayOfInterval(b))
    .flat()
    .map(date => format(date, 'MM-dd-yyyy'));

  function onSubmit(data) {
    createBooking(
      {
        ...data,
        cabinId,
        numNights,
        extrasPrice,
        cabinPrice,
        totalPrice,
        hasBreakfast,
        isPaid,
        status: status ? 'checked-in' : 'unconfirmed',
        startDate,
        endDate,
      },
      {
        onSettled: () => onCloseModal?.(),
      }
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label='Guest name' id='guestId' error={errors?.guestId?.message}>
        <Controller
          control={control}
          name='guestId'
          rules={{ required: 'Guest name is required' }}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={option => onChange(option.value)}
              inputId='guestId'
              options={guests?.map(g => {
                return {
                  value: g.id,
                  label: g.fullName,
                };
              })}
              // Setting default value to the selected guest
              defaultValue={
                guestId && {
                  value: guestId,
                  label: guests.find(g => g.id === guestId)?.fullName,
                }
              }
              noOptionsMessage={() =>
                'No guests found! Please create a new one.'
              }
              placeholder='Select a guest...'
              isLoading={isLoadingGuests}
              isDisabled={isCreatingBooking}
              styles={styles}
              blurInputOnSelect
              openMenuOnFocus
              menuShouldScrollIntoView={false}
            ></ReactSelect>
          )}
        />
      </FormRow>

      <FormRow label='Number of guests' error={errors?.numGuests?.message}>
        <Input
          type='number'
          id='numGuests'
          {...register('numGuests', {
            valueAsNumber: true,
            required: 'Number of guests is required',
            min: {
              value: 1,
              message: 'Number of guests cannot be less than 1',
            },
            max: {
              value: maxGuestsPerBooking,
              message: `Number of guests cannot be more than ${maxGuestsPerBooking}`,
            },
          })}
          disabled={isCreatingBooking}
          onBlur={() =>
            (!numGuests || numGuests > cabin.maxCapacity) &&
            setValue('cabinId', null)
          }
        />
      </FormRow>

      <FormRow label='Cabin name' id='cabinId' error={errors?.cabinId?.message}>
        <Controller
          control={control}
          name='cabinId'
          rules={{ required: 'Cabin name is required' }}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={option => onChange(option.value)}
              inputId='cabinId'
              options={cabins?.map(cabin => {
                return {
                  value: cabin.id,
                  label: `${cabin.name}, ${formatCurrency(
                    cabin.regularPrice - cabin.discount
                  )}, ${cabin.maxCapacity}`,
                  isDisabled: cabin.maxCapacity < numGuests,
                };
              })}
              // Setting default value to the selected cabin
              defaultValue={
                selectedCabinId && {
                  value: selectedCabinId,
                  label: `${selectedCabin?.name}, ${formatCurrency(
                    selectedCabin?.regularPrice - selectedCabin?.discount
                  )}, ${selectedCabin?.maxCapacity}`,
                }
              }
              noOptionsMessage={() =>
                'No cabins found! Please create a new one.'
              }
              placeholder={'Name, price, capacity'}
              isDisabled={!numGuests || isLoading || isCreatingBooking}
              isLoading={isLoading}
              openMenuOnFocus
              styles={styles}
              blurInputOnSelect
              menuShouldScrollIntoView={false}
            />
          )}
        />
      </FormRow>

      <FormRow
        label='Start date'
        id='startDate'
        error={errors?.startDate?.message}
      >
        <Controller
          control={control}
          name='startDate'
          render={({ field: { value, onChange } }) => (
            <ReactDatePicker
              selected={value}
              onChange={onChange}
              id='startDate'
              autoComplete='off'
              placeholderText='dd-mm-yyyy'
              dateFormat='dd-MM-yyyy'
              customInput={<Input />}
              disabled={isLoadingCabin || !cabinId || isCreatingBooking}
              title={!cabinId ? 'Select a cabin first' : ''}
              isClearable
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              excludeDateIntervals={alreadyBooked}
            />
          )}
          rules={{
            required: 'Start date is required',
            validate: () =>
              !eachDayOfInterval({ start: startDate, end: endDate })?.some(
                date => bookedDates?.includes(format(date, 'MM-dd-yyyy'))
              ) || 'Cannot book already booked dates',
          }}
        />
      </FormRow>

      <FormRow label='End date' id='endDate' error={errors?.endDate?.message}>
        <Controller
          control={control}
          name='endDate'
          render={({ field: { value, onChange } }) => (
            <ReactDatePicker
              selected={value}
              onChange={onChange}
              id='endDate'
              autoComplete='off'
              placeholderText='dd-mm-yyyy'
              dateFormat='dd-MM-yyyy'
              customInput={<Input />}
              disabled={isLoadingCabin || !cabinId || isCreatingBooking}
              title={!cabinId ? 'Select a cabin first' : ''}
              isClearable
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={addDays(startDate, minBookingLength)}
              maxDate={addDays(startDate, maxBookingLength)}
              excludeDateIntervals={alreadyBooked}
            />
          )}
          rules={{
            required: 'End date is required',
            validate: () =>
              numNights >= minBookingLength ||
              `End date must be at least ${minBookingLength} days after start date`,
          }}
        />
      </FormRow>

      <FormRow label='Observations' error={errors?.observations?.message}>
        <Textarea
          type='text'
          id='observations'
          disabled={isCreatingBooking}
          defaultValue=''
          {...register('observations', {
            required: 'Observations is required',
          })}
        />
      </FormRow>

      <FormRow label='Total price' error={errors?.totalPrice?.message}>
        <Input
          type='text'
          id='totalPrice'
          value={totalPrice ? formatCurrency(Math.abs(totalPrice)) : ''}
          readOnly
        />
      </FormRow>

      <FormRow>
        <Controller
          control={control}
          name='hasBreakfast'
          render={({ field: { value, onChange } }) => (
            <Checkbox
              checked={value}
              onChange={onChange}
              id='hasBreakfast'
              disabled={isCreatingBooking}
            >
              Do the guests want breakfast?
            </Checkbox>
          )}
        />
      </FormRow>

      <FormRow error={errors?.isPaid?.message}>
        <Controller
          control={control}
          name='isPaid'
          rules={{
            validate: () =>
              !status || isPaid || 'Please make the payment to check in',
          }}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              checked={value}
              onChange={onChange}
              id='isPaid'
              disabled={isCreatingBooking}
            >
              Is the payment made?
            </Checkbox>
          )}
        />
      </FormRow>

      <FormRow error={errors?.status?.message}>
        <Controller
          control={control}
          name='status'
          rules={{
            validate: () =>
              !status ||
              isToday(startDate) ||
              "Your booking doesn't start today",
          }}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              checked={value}
              onChange={onChange}
              id='status'
              disabled={isCreatingBooking}
            >
              Is the guest checking in?
            </Checkbox>
          )}
        />
      </FormRow>

      <FormRow>
        <Button
          variation='secondary'
          type='reset'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreatingBooking}>Create</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
