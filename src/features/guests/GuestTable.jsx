import Menus from '../../ui/Menus';
import Pagination from '../../ui/Pagination';
import Spinner from '../../ui/Spinner';
import Table from '../../ui/Table';
import GuestRow from './GuestRow';
import { useGuests } from './useGuests';

function GuestTable() {
  const { guests, isLoading, count, pageCount } = useGuests();

  if (isLoading) return <Spinner />;

  return (
    <Menus>
      <Table columns='0.4fr 1.8fr 2fr 1fr 1fr'>
        <Table.Header role='row'>
          <div></div>
          <div>Name</div>
          <div>Email</div>
          <div>Nationality</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={guests}
          type='guest'
          render={guest => <GuestRow key={guest.id} guest={guest} />}
        />

        {pageCount > 1 && (
          <Table.Footer>
            <Pagination count={count} />
          </Table.Footer>
        )}
      </Table>
    </Menus>
  );
}

export default GuestTable;
