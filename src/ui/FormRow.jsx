/* eslint-disable react/prop-types */
import styled from 'styled-components';

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;
  position: relative;

  & :first-child:not(label) {
    grid-column: 1 / 3;
  }

  &:first-child {
    padding-top: 0.4rem;
  }

  &:last-child {
    padding-bottom: 0.4rem;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:last-child:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

/**
 * Function component for rendering a form row with label, children component, and optional error message.
 *
 * @param {object} props - Destructured object containing label, error, and children properties.
 * @param {string} props.label - Label text for the form row.
 * @param {string} props.error - Error message for the form row.
 * @param {JSX.Element} props.children - Children component for the form row.
 * @returns {JSX.Element} - Rendered form row component.
 */
function FormRow({ label, error, children }) {
  return (
    <StyledFormRow>
      {label && <Label htmlFor={children.props?.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;
