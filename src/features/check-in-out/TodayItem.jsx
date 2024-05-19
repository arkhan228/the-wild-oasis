import styled from 'styled-components';
import Tag from '../../ui/Tag';
import { Flag } from '../../ui/Flag';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CheckoutBooking from './CheckoutBooking';
import { Link } from 'react-router-dom';

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({ activity: { id: bookingId, status, guests, numNights } }) {
  return (
    <StyledTodayItem>
      {status === 'unconfirmed' && <Tag type='green'>Arriving</Tag>}
      {status === 'checked-in' && <Tag type='blue'>Departing</Tag>}

      <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`} />
      <Guest>{guests.fullName}</Guest>
      <div>{numNights} nights</div>

      {status === 'unconfirmed' && (
        <Button as={Link} size='small' to={`/checkin/${bookingId}`}>
          Check in
        </Button>
      )}

      <Modal>
        {status === 'checked-in' && (
          <Modal.Open
            opens='checkout-modal'
            renderButton={openFn => (
              <Button size='small' onClick={openFn}>
                Check out
              </Button>
            )}
          />
        )}

        <Modal.Window
          name='checkout-modal'
          renderContent={closeFn => (
            <CheckoutBooking onCloseModal={closeFn} bookingId={bookingId} />
          )}
        />
      </Modal>
    </StyledTodayItem>
  );
}

export default TodayItem;
