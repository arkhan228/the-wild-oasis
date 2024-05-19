import styled from 'styled-components';
import BookingDataBox from '../../features/bookings/BookingDataBox';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import Checkbox from '../../ui/Checkbox';
import { useEffect, useState } from 'react';
import { useCheckIn } from './useCheckIn';
import { useSettings } from '../settings/useSettings';
import { formatCurrency } from '../../utils/helpers';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);

  const { booking = {}, isLoading } = useBooking();
  const { settings, isLoading: isLoadingSettings } = useSettings();
  const { checkin } = useCheckIn();

  const moveBack = useMoveBack();

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
    isPaid,
  } = booking;

  useEffect(
    function () {
      setConfirmPaid(isPaid ?? false);
    },
    [isPaid]
  );

  const optionalBreakfastPrice =
    settings?.breakfastPrice * numGuests * numNights;

  function handleCheckin(bookingId) {
    if (addBreakfast)
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    else checkin({ bookingId, breakfast: {} });
  }

  if (isLoading || isLoadingSettings) return <Spinner />;

  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>
      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast(add => !add);
              setConfirmPaid(false);
            }}
            id='breakfast'
          >
            Do you want breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid(confirm => !confirm)}
          id={bookingId}
          disabled={confirmPaid}
        >
          I confirm that {guests.fullName} has paid the total amount{' '}
          {addBreakfast
            ? formatCurrency(optionalBreakfastPrice + totalPrice)
            : formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          onClick={() => handleCheckin(bookingId)}
          disabled={!confirmPaid}
        >
          Check in booking #{bookingId}
        </Button>
        <Button variation='secondary' onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
