import supabase from './supabase';

/**
 * Retrieves the settings data from the database.
 *
 * @return {Object} The settings data retrieved from the database.
 */
export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be loaded');
  }
  return data;
}

/**
 * Updates a setting in the database and returns the updated setting data.
 *
 * @param {Object} newSetting - The new setting to be updated in the database.
 * @return {Promise<Object>} The updated setting data.
 */
export async function updateSetting(newSetting) {
  const { data, error } = await supabase
    .from('settings')
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq('id', 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Settings could not be updated');
  }
  return data;
}
