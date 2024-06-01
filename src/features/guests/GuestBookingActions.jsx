import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import Heading from '../../ui/Heading';
import HeadingGroup from '../../ui/HeadingGroup';
import Tag from '../../ui/Tag';
import styled from 'styled-components';
import { statusToTagName } from '../../utils/helpers';
import Modal from '../../ui/Modal';
import CheckoutBooking from '../check-in-out/CheckoutBooking';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteBooking } from '../bookings/useDeleteBooking';

const StyledActions = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem;
  margin-bottom: 2rem;

  background-color: var(--color-indigo-100);
`;

function GuestBookingActions({ status, bookingId }) {
  const { deleteBooking, isDeleting } = useDeleteBooking();

  return (
    <Modal>
      <StyledActions>
        <HeadingGroup>
          <Heading as='h3'>Booking #{bookingId}</Heading>
          <Tag type={statusToTagName(status)}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonGroup>
          <Button as={Link} to={`/bookings/${bookingId}`}>
            Details
          </Button>

          {status === 'unconfirmed' && (
            <Button as={Link} to={`/checkin/${bookingId}`}>
              Check in
            </Button>
          )}

          {status !== 'checked-in' && (
            <Modal.Open
              opens='delete-modal'
              renderButton={openFn => (
                <Button variation='danger' onClick={openFn}>
                  Delete
                </Button>
              )}
            />
          )}

          <Modal.Window
            name='delete-modal'
            renderContent={closeFn => (
              <ConfirmDelete
                resourceName={`booking #${bookingId}`}
                onConfirm={() => deleteBooking(bookingId)}
                disabled={isDeleting}
                onCloseModal={closeFn}
              />
            )}
          />

          {status === 'checked-in' && (
            <Modal.Open
              opens='checkout-modal'
              renderButton={openFn => (
                <Button onClick={openFn}>Check out</Button>
              )}
            />
          )}

          <Modal.Window
            name='checkout-modal'
            renderContent={closeFn => (
              <CheckoutBooking bookingId={bookingId} onCloseModal={closeFn} />
            )}
          />
        </ButtonGroup>
      </StyledActions>
    </Modal>
  );
}

export default GuestBookingActions;
