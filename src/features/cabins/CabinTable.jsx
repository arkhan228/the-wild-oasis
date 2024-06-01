import Spinner from '../../ui/Spinner';
import CabinRow from './CabinRow';
import { useCabins } from './useCabins';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import useUpdateDiscounts from './useUpdateDiscounts';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import { useEffect } from 'react';

/**
 * Generates a table displaying cabin information fetched from the API and updates the discount for each cabin every day.
 *
 * @return {JSX.Element} The JSX element representing the cabin table.
 */

function CabinTable() {
  const { cabins, isLoading } = useCabins();
  const [discountDate, setDiscountDate] = useLocalStorageState(
    new Date().getDate() - 1,
    'discountDate'
  );
  const { updateDiscounts, isUpdating } = useUpdateDiscounts();

  useEffect(() => {
    if (!isLoading && new Date().getDate() !== discountDate) {
      const discountedCabins = cabins.map(c => {
        const discount =
          Math.random() < 0.5 ? 0 : (Math.trunc(Math.random() * 3) + 1) * 5;
        console.log(discount);
        return {
          id: c.id,
          discount: Math.round((c.regularPrice * discount) / 100_000) * 1000,
        };
      });
      updateDiscounts(discountedCabins);
      setDiscountDate(new Date().getDate());
    }
  }, [discountDate, setDiscountDate, updateDiscounts, cabins, isLoading]);

  if (isLoading || isUpdating) return <Spinner />;

  if (!cabins.length) return <Empty resource='cabins' />;

  return (
    <Menus>
      <Table columns='0.8fr 1.6fr 2.2fr 1fr 1fr 1fr'>
        <Table.Header role='row'>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={cabins}
          render={cabin => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
