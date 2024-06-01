import { HiEye, HiOutlinePlus, HiPencil, HiTrash } from 'react-icons/hi2';
import { Flag } from '../../ui/Flag';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import Table from '../../ui/Table';
import { useNavigate } from 'react-router-dom';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteGuest } from './useDeleteGuest';
import CreateGuestForm from './CreateGuestForm';
import CreateBookingForm from '../bookings/CreateBookingForm';

function GuestRow({ guest }) {
  const { id: guestId, fullName, email, countryFlag, nationality } = guest;

  const { deleteGuest, isDeletingGuest } = useDeleteGuest();

  const navigate = useNavigate();

  return (
    <Table.Row>
      <Flag type='big' src={countryFlag} alt={`Flag of ${nationality}`} />
      <div>{fullName}</div>
      <div>{email}</div>
      <div>{nationality}</div>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={guestId} />
          <Menus.List id={guestId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/guests/${guestId}`)}
            >
              See details
            </Menus.Button>

            <Modal.Open
              opens='Create-booking'
              renderButton={openFn => (
                <Menus.Button icon={<HiOutlinePlus />} onClick={openFn}>
                  Create booking
                </Menus.Button>
              )}
            />

            <Modal.Open
              opens='edit-guest'
              renderButton={openFn => (
                <Menus.Button icon={<HiPencil />} onClick={openFn}>
                  Edit
                </Menus.Button>
              )}
            />

            <Modal.Open
              opens='delete-guest'
              renderButton={openFn => (
                <Menus.Button icon={<HiTrash />} onClick={openFn}>
                  Delete
                </Menus.Button>
              )}
            />
          </Menus.List>

          <Modal.Window
            name='Create-booking'
            renderContent={closeFn => (
              <CreateBookingForm onCloseModal={closeFn} guestId={guestId} />
            )}
          />

          <Modal.Window
            name='edit-guest'
            renderContent={closeFn => (
              <CreateGuestForm onCloseModal={closeFn} guestData={guest} />
            )}
          />

          <Modal.Window
            name='delete-guest'
            renderContent={closeFn => (
              <ConfirmDelete
                resourceName='guest and associated bookings'
                onConfirm={() => deleteGuest(guestId)}
                onCloseModal={closeFn}
                disabled={isDeletingGuest}
              />
            )}
          />
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default GuestRow;
