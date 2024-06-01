import { useQuery } from '@tanstack/react-query';

async function getCountries() {
  const res = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,cca2'
  );

  const data = await res.json();

  const countries = data.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  return countries;
}

export function useCountries() {
  const {
    data: countries,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useQuery({
    queryFn: getCountries,
    queryKey: ['countries'],
  });

  return { countries, isLoadingCountries, countriesError };
}
