import { useForm } from 'react-hook-form';

import { useCreateCabin } from './useCreateCabin';
import { useUpdateCabin } from './useUpdateCabin';

import Button from '../../ui/Button';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

/**
 * Generate a form and handles submission for creating or updating a cabin with input fields for cabin name, max capacity, regular price, discount, description, and cabin photo. Displays appropriate error messages for each input field.
 *
 * @param {object} cabinToEdit - An object containing details of the cabin to edit, if provided
 * @return {JSX.Element} The form JSX element for creating or updating a cabin
 */
function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  // Creating new cabin in custom hook
  const { createCabin, isCreating } = useCreateCabin();

  // Updating existing cabin in custom hook
  const { updateCabin, isUpdating } = useUpdateCabin();

  // Check if we are in edit mode
  const { id: updateId, ...editValues } = cabinToEdit;
  const isUpdateSession = Boolean(updateId);

  // Use react-hook-form to handle form state and validation and provide default values if it isUpdateSession
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: isUpdateSession ? editValues : {},
  });

  // For disabling form when submitting
  const isWorking = isCreating || isUpdating;

  /**
   * Checks if image already existed or uploaded new one and submits the form for creating or updating
   *
   * @param {Object} data - the data object containing image information
   * @return {void}
   */
  function onSubmit(data) {
    // Check if image already existed or uploaded new one
    const image = typeof data.image === 'object' ? data.image[0] : data.image;

    if (isUpdateSession)
      updateCabin(
        {
          newCabinData: {
            ...data,
            image: image,
          },
          id: updateId,
          currentImage: editValues.image,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type='text'
          id='name'
          disabled={isWorking}
          {...register('name', { required: 'Cabin name is required' })}
        />
      </FormRow>

      <FormRow label='Max capacity' error={errors?.maxCapacity?.message}>
        <Input
          type='number'
          id='maxCapacity'
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'Max capacity is required',
            min: {
              value: 1,
              message: 'Max capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        <Input
          type='number'
          id='regularPrice'
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'Regular price is required',
            min: {
              value: 1,
              message: 'Regular price should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label='Discount' error={errors?.discount?.message}>
        <Input
          type='number'
          id='discount'
          disabled={isWorking}
          {...register('discount', {
            required: 'Discount is required',
            validate: value =>
              +value <= +getValues().regularPrice ||
              'Discount cannot be more than regular price',
          })}
        />
      </FormRow>

      <FormRow label='Description' error={errors?.description?.message}>
        <Textarea
          type='text'
          id='description'
          disabled={isWorking}
          defaultValue=''
          {...register('description', {
            required: 'Description is required',
          })}
        />
      </FormRow>

      <FormRow label='Cabin photo' error={errors?.image?.message}>
        <FileInput
          id='image'
          accept='image/*'
          {...register('image', {
            required: isUpdateSession ? false : 'Image is required',
            // validation for image when user tries to upload image but aborts
            validate: value => value.length > 0 || 'Image is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation='secondary'
          type='reset'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>{isUpdateSession ? 'Update Cabin' : 'Create cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
