import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import styled from 'styled-components';

import { useDeleteCabin } from './useDeleteCabin';
import { useCreateCabin } from './useCreateCabin';

import { formatCurrency } from '../../utils/helpers';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import CreateCabinForm from './CreateCabinForm';
import ConfirmDelete from '../../ui/ConfirmDelete';

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.55) translateX(-7px);
`;

const ImgPreview = styled(Img)`
  width: auto;
  border-radius: var(--border-radius-tiny);
  transform: none;
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

/**
 * Renders a row for a cabin with details and edit/delete buttons.
 * @param {object} cabin - The cabin object containing details like id, name, capacity, price, discount, image, and description.
 * @return {JSX.Element} A JSX element representing the cabin row.
 */
function CabinRow({ cabin }) {
  const { deleteCabin, isDeleting } = useDeleteCabin();
  const { createCabin } = useCreateCabin();

  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
    isDuplicated,
  } = cabin;

  function handleDuplicateCabin() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
      isDuplicated: true,
    });
  }

  return (
    <Table.Row>
      <Modal>
        <Modal.Open
          opens='image'
          renderButton={openFn => <Img src={image} onClick={openFn} />}
        />
        <Modal.Window
          name='image'
          renderContent={() => <ImgPreview src={image} />}
        />
        <Cabin>{name}</Cabin>
        <div>Fits upto {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        <Discount>
          {discount ? formatCurrency(discount) : <span>&mdash;</span>}
        </Discount>

        <Menus.Menu>
          <Menus.Toggle id={cabinId} />
          <Menus.List id={cabinId}>
            <Menus.Button
              icon={<HiSquare2Stack />}
              onClick={handleDuplicateCabin}>
              Duplicate
            </Menus.Button>

            <Modal.Open
              opens='edit-cabin'
              renderButton={openFn => (
                <Menus.Button icon={<HiPencil />} onClick={openFn}>
                  Edit
                </Menus.Button>
              )}
            />

            <Modal.Open
              opens='delete-cabin'
              renderButton={openFn => (
                <Menus.Button icon={<HiTrash />} onClick={openFn}>
                  Delete
                </Menus.Button>
              )}
            />
          </Menus.List>

          <Modal.Window
            name='edit-cabin'
            renderContent={closeFn => (
              <CreateCabinForm cabinToEdit={cabin} onCloseModal={closeFn} />
            )}
          />

          <Modal.Window
            name='delete-cabin'
            renderContent={closeFn => (
              <ConfirmDelete
                resourceName='cabin'
                onConfirm={() => deleteCabin({ cabinId, image, isDuplicated })}
                disabled={isDeleting}
                onCloseModal={closeFn}
              />
            )}
          />
        </Menus.Menu>
      </Modal>
    </Table.Row>
  );
}

export default CabinRow;
