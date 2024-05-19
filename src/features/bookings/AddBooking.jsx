import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import CreateBookingForm from './CreateBookingForm';

function AddBooking() {
  return (
    <Modal>
      <Modal.Open
        opens='booking-form'
        renderButton={openFn => (
          <Button onClick={openFn}>Create new booking</Button>
        )}
      />
      <Modal.Window
        name='booking-form'
        renderContent={closeFn => <CreateBookingForm onCloseModal={closeFn} />}
      />
    </Modal>
  );
}

export default AddBooking;
