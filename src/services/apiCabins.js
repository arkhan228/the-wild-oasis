import supabase, { supabaseUrl } from './supabase';

/**
 * Retrieves cabins data from the database.
 *
 * @return {Array} The retrieved cabins data.
 */
export async function getCabins() {
  let { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Cabins data could not be loaded');
  }

  return data;
}

/**
 * Create or update a cabin in the database and upload the image to storage bucket if provided.
 *
 * @param {Object} newCabin - The new cabin object to be created or updated.
 * @param {string} id - The id of the cabin to be updated, if provided.
 * @param {string} image - The image path of the current image (to be deleted from storage on updating with new image).
 * @return {Object} The data of the created or updated cabin.
 */
export async function createUpdateCabin(newCabin, id, image) {
  // To prevent deletion of image from storage if new image is uploaded to a duplicated cabin
  const duplicatedCabin = newCabin.isDuplicated;

  const hasImagePath = typeof newCabin.image === 'string';

  const imageName = `${Math.trunc(Math.random() * 100000000)}-${
    newCabin.image.name
  }`.replaceAll('/', '');

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // If duplicated cabin is updated with a new image, set isDuplicated to false
  if (newCabin.isDuplicated && !hasImagePath) newCabin.isDuplicated = false;

  // Create/Edit Cabin
  let query = supabase.from('cabins');

  // A) Create
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Edit
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);

  // Execute query
  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  // Upload image to storage bucket only if new image was uploaded
  let uploadImage = {};
  if (!hasImagePath)
    uploadImage = await supabase.storage
      .from('cabin-images')
      .upload(imageName, newCabin.image);

  const { error: storageError } = uploadImage;

  // Delete the created cabin if image was not uploaded
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);

    console.error(storageError);
    throw new Error('Image could not be uploaded so cabin was not created');
  }

  // Delete existing image if cabin was not duplicated and a new image was uploaded in editing, (without id, it'll delete the image when creating a new cabin and without !hasImagePath, it'll delete the image even when user does not upload a new image in edit session)
  if (!duplicatedCabin && id && !hasImagePath) deleteCabinImage(image);

  return data;
}

/**
 * Deletes a cabin and its associated image from the database.
 *
 * @param {string} id - The ID of the cabin to be deleted
 * @param {string} imagePath - The path of the image to be deleted
 * @param {boolean} isDuplicated - Whether the cabin is duplicated, does not delete image if it is
 * @return {Promise} The data of the deleted cabin
 */
export async function deleteCabin(id, imagePath, isDuplicated) {
  const { data, error: cabinError } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id);

  if (!isDuplicated) deleteCabinImage(imagePath);

  if (cabinError) {
    console.error(cabinError);
    throw new Error('Cabin could not be deleted');
  }

  return data;
}

/**
 * Deletes a cabin image from the 'cabin-images' storage.
 *
 * @param {string} imagePath - the path of the image to be deleted
 * @return {string} error - any error that occurred during deletion
 */
async function deleteCabinImage(imagePath) {
  const imagePathArr = imagePath.split('/');

  const { error } = await supabase.storage
    .from('cabin-images')
    .remove([imagePathArr[imagePathArr.length - 1]]);

  return error;
}

export async function getCabin(id) {
  if (!id) return [];

  const { data, error } = await supabase
    .from('cabins')
    .select('*, bookings(startDate, endDate, status)')
    .neq('bookings.status', 'checked-out')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be loaded');
  }

  return data;
}
