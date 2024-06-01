import { PAGE_SIZE } from '../utils/constants';
import supabase from './supabase';

export async function getGuests(filter, sortBy, page) {
  let query = supabase.from('guests');

  if (filter) {
    if (filter.value === 'no-bookings') {
      query = query
        .select('*, bookings(status)', { count: 'exact' })
        .filter('bookings', 'is', null);
    } else {
      query = query.select('*, bookings!inner(status)', { count: 'exact' })[
        // Default method is 'eq'
        filter.method || 'eq'
      ](filter.field, filter.value);
    }
  } else query = query.select('*', { count: 'exact' });

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === 'asc',
    });

  if (page) query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const { data, error, count } = await query;

  if (error) throw new Error('Guests could not be loaded');

  return { data, count };
}

export async function getGuest(id) {
  const { data, error } = await supabase
    .from('guests')
    .select('*, bookings(*, cabins(name))')
    .eq('id', id)
    .single();

  if (error) throw new Error('Guest not found');

  return data;
}

export async function createGuest(guest) {
  const { data, error } = await supabase
    .from('guests')
    .insert(guest)
    .select()
    .single();

  if (error) throw new Error('Guest could not be created');

  return data;
}

export async function updateGuest(updatedGuest) {
  const { data, error } = await supabase
    .from('guests')
    .update(updatedGuest)
    .eq('id', updatedGuest.id)
    .select()
    .single();

  if (error) throw new Error('Guest could not be updated');
  console.error(error);

  return data;
}

export async function deleteGuest(id) {
  const { data, error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error('Guest could not be deleted');

  return data;
}
