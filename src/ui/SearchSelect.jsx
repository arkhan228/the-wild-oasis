import { useState } from 'react';
import styled, { css } from 'styled-components';
import Input from './Input';
import { useGuests } from '../features/bookings/useGuests';
import SpinnerMini from './SpinnerMini';

const CustomSelect = styled.div`
  position: relative;
`;
const List = styled.ul`
  display: none;
  flex-direction: column;
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-400);
  box-shadow: var(--shadow-lg);
  z-index: 9999;
  width: 100%;
  max-height: 43rem;
  overflow-y: auto;

  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);

  ${props =>
    props.type === 'show' &&
    css`
      display: flex;
    `}
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: 5.6rem;
  justify-content: center;
  padding: 1.2rem 1.6rem;
  color: var(--color-grey-700);
  cursor: pointer;

  &:first-child {
    border-top-right-radius: var(--border-radius-sm);
    border-top-left-radius: var(--border-radius-sm);
  }
  &:last-child {
    border-bottom-right-radius: var(--border-radius-sm);
    border-bottom-left-radius: var(--border-radius-sm);
  }

  &:hover {
    background-color: var(--color-grey-200);
  }
`;

function SearchSelect({ register, setValue, guestName }) {
  const [showList, setShowList] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const { guests, isLoading } = useGuests(guestName);

  return (
    <CustomSelect>
      <Input
        type='search'
        id='guestName'
        autoComplete='off'
        placeholder={selectedGuest || 'Search for guests...'}
        {...register('guestName', {
          validate: () => selectedGuest?.length || 'Guest name is required',
        })}
        onFocus={() => setShowList(true)}
        onBlur={() => {
          setTimeout(() => {
            setShowList(false);
            setValue('guestName', null);
          }, 250);
        }}
      />

      <List type={showList ? 'show' : ''}>
        {isLoading ? (
          <Item>
            <SpinnerMini />
          </Item>
        ) : guests.length ? (
          guests?.map(g => (
            <Item
              key={g.id}
              onClick={() => {
                setValue('guestName', g.fullName);
                setValue('guestId', g.id);
                setSelectedGuest(g.fullName);
                setShowList(false);
              }}
            >
              {g.fullName} {g.email}
            </Item>
          ))
        ) : (
          <Item>
            <p>
              {guestName?.length > 2
                ? `No results found for ${guestName} Please create a new guest`
                : 'Enter at least 3 characters'}
            </p>
          </Item>
        )}
      </List>
    </CustomSelect>
  );
}

export default SearchSelect;
