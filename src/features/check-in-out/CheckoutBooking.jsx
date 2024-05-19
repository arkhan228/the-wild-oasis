import Button from '../../ui/Button';
import styled from 'styled-components';
import { useCheckOut } from './useCheckOut';

const StyledCheckoutBooking = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 3.2rem;
`;

const StyledText = styled.p`
  font-size: 1.8rem;
  line-height: 1.8;
  text-align: center;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
`;

function CheckoutBooking({ onCloseModal, bookingId }) {
  const { checkout } = useCheckOut();

  return (
    <StyledCheckoutBooking>
      <StyledText>
        Are you sure you want to checkout booking #{bookingId}
      </StyledText>

      <Box>
        <Button variation='secondary' onClick={onCloseModal}>
          Cancel
        </Button>

        <Button
          onClick={() => {
            checkout(bookingId);
            onCloseModal();
          }}
        >
          Check out
        </Button>
      </Box>
    </StyledCheckoutBooking>
  );
}

export default CheckoutBooking;
