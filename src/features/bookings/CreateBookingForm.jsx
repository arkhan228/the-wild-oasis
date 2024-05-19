import { Controller, useForm } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, eachDayOfInterval, format, isToday } from 'date-fns';
import {
  formatCurrency,
  setLocalHoursToUTCOffset,
  subtractDates,
} from '../../utils/helpers';

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
import ReactSelect from 'react-select';
import { useGuests } from './useGuests';
import styles from '../../styles/ReactSelectStyles';

function CreateBookingForm({ onCloseModal }) {
  const { cabins, isLoading } = useCabins();
  const { guests, isLoading: isLoadingGuests } = useGuests();
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

  const { value: cabinId } = watch('cabinId') || {};
  const { cabin, isLoadingCabin } = useCabin(cabinId);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const numGuests = watch('numGuests');
  const hasBreakfast = watch('hasBreakfast') || false;
  const isPaid = watch('isPaid') || false;
  const status = watch('status') || false;

  const numNights = subtractDates(
    endDate?.toISOString(),
    startDate?.toISOString()
  );

  const extrasPrice = numNights * breakfastPrice * numGuests || 0;
  const cabinPrice = (cabin?.regularPrice - cabin?.discount) * numNights || 0;
  const totalPrice = hasBreakfast ? cabinPrice + extrasPrice : cabinPrice;

  const alreadyBooked = cabin?.bookings?.map(b => {
    return {
      start: new Date(b.startDate),
      end: new Date(b.endDate),
    };
  });

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
        startDate: setLocalHoursToUTCOffset(data.startDate),
        endDate: setLocalHoursToUTCOffset(data.endDate),
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
      <FormRow label='Guest name' error={errors?.guestId?.message}>
        <Controller
          control={control}
          name='guestId'
          rules={{ required: 'Guest name is required' }}
          render={({ field: { onChange } }) => (
            <ReactSelect
              onChange={option => onChange(option.value)}
              options={guests?.map(g => {
                return {
                  value: g.id,
                  label: g.fullName,
                };
              })}
              placeholder='Select a guest...'
              isLoading={isLoadingGuests}
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
          onBlur={() =>
            (!numGuests || numGuests > cabin.maxCapacity) &&
            setValue('cabinId', null)
          }
        />
      </FormRow>

      <FormRow label='Cabin name' error={errors?.cabinId?.message}>
        <Controller
          control={control}
          name='cabinId'
          rules={{ required: 'Cabin name is required' }}
          render={({ field }) => (
            <ReactSelect
              {...field}
              options={cabins?.map(cabin => {
                return {
                  value: cabin.id,
                  label: `${cabin.name}, ${formatCurrency(
                    cabin.regularPrice - cabin.discount
                  )}, ${cabin.maxCapacity}`,
                  isDisabled: cabin.maxCapacity < numGuests,
                };
              })}
              placeholder={'Name, price, capacity'}
              isDisabled={!numGuests || isLoading}
              isLoading={isLoading}
              openMenuOnFocus
              styles={styles}
              blurInputOnSelect
              menuShouldScrollIntoView={false}
            />
          )}
        />
      </FormRow>

      <FormRow label='Start date' error={errors?.startDate?.message}>
        <Controller
          control={control}
          name='startDate'
          render={({ field: { value, onChange } }) => (
            <ReactDatePicker
              selected={value}
              onChange={onChange}
              placeholderText='dd-mm-yyyy'
              dateFormat='dd-MM-yyyy'
              customInput={<Input />}
              disabled={isLoadingCabin || !cabinId}
              title={!cabinId ? 'Select a cabin first' : ''}
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

      <FormRow label='End date' error={errors?.endDate?.message}>
        <Controller
          control={control}
          name='endDate'
          render={({ field: { value, onChange } }) => (
            <ReactDatePicker
              selected={value}
              onChange={onChange}
              placeholderText='dd-mm-yyyy'
              dateFormat='dd-MM-yyyy'
              customInput={<Input />}
              disabled={isLoadingCabin || !cabinId}
              title={!cabinId ? 'Select a cabin first' : ''}
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
          disabled={false}
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
            <Checkbox checked={value} onChange={onChange} id='hasBreakfast'>
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
          render={({ field: { value = false, onChange } }) => (
            <Checkbox checked={value} onChange={onChange} id='isPaid'>
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
            <Checkbox checked={value} onChange={onChange} id='status'>
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
