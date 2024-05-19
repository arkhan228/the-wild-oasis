import supabase from './supabase';

export async function getGuests() {
  const { data, error } = await supabase
    .from('guests')
    .select('fullName, email, id');

  if (error) throw new Error(error.message);

  return data;
}
