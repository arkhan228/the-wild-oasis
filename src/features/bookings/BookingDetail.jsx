import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking';
import Spinner from '../../ui/Spinner';
import Modal from '../../ui/Modal';
import CheckoutBooking from '../check-in-out/CheckoutBooking';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteBooking } from './useDeleteBooking';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking = {}, isLoading } = useBooking();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  const navigate = useNavigate();
  const moveBack = useMoveBack();

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type='horizontal'>
        <HeadingGroup>
          <Heading as='h1'>Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Button variation='secondary' onClick={moveBack}>
          Back
        </Button>

        {status === 'unconfirmed' && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}

        <Modal>
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
              <CheckoutBooking onCloseModal={closeFn} bookingId={bookingId} />
            )}
          />

          {status !== 'checked-in' && (
            <Modal.Open
              opens='delete-booking'
              renderButton={openFn => (
                <Button onClick={openFn} variation='danger'>
                  Delete
                </Button>
              )}
            />
          )}

          <Modal.Window
            name='delete-booking'
            renderContent={closeFn => (
              <ConfirmDelete
                resourceName={`booking #${bookingId}`}
                onConfirm={() =>
                  deleteBooking(bookingId, {
                    onSettled: moveBack,
                  })
                }
                disabled={isDeleting}
                onCloseModal={closeFn}
              />
            )}
          />
        </Modal>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
