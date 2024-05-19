import Button from '../../ui/Button';
import { useCheckOut } from './useCheckOut';

function CheckoutButton({ bookingId, onCloseModal }) {
  const { checkout } = useCheckOut();

  return (
    <Button
      onClick={() => {
        checkout(bookingId);
        onCloseModal();
      }}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
