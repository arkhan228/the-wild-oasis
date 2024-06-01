import CreateCabinForm from './CreateCabinForm';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

function AddCabin() {
  return (
    <Modal>
      <Modal.Open
        opens='cabin-form'
        renderButton={openFn => <Button onClick={openFn}>Add new cabin</Button>}
      />
      <Modal.Window
        name='cabin-form'
        renderContent={closeFn => <CreateCabinForm onCloseModal={closeFn} />}
      />
    </Modal>
  );
}

export default AddCabin;
