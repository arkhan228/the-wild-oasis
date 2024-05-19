import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';
import styled from 'styled-components';
import { useDetectOutsideClick } from '../hooks/useDetectOutsideClick';

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
  max-height: 90dvh;
  overflow-y: auto;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

export const ModalContext = createContext();

/**
 * Generate a modal context provider component that renders a modal window with the provided children.
 *
 * @param {object} children - The children components to be rendered inside the modal.
 * @return {JSX.Element} The modal component.
 */
function Modal({ children }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

/**
 * Renders a button to open the modal window.
 * @param {Object} opensWindowName - the name of the window to be opened
 * @param {Function} renderButton - function to render the button that'll open the modal window
 * @return {JSX.Element} the result of rendering the button
 */
function Open({ opens: opensWindowName, renderButton }) {
  const { open } = useContext(ModalContext);

  return renderButton(() => open(opensWindowName));
}

/**
 * Displays the modal window content if the given name matches the openName from ModalContext.
 *
 * @param {Object} renderContent - Function to render the content of the modal window
 * @param {string} name - The name of the modal window
 * @return {JSX.Element|null} The modal window content or null if the name does not match the openName
 */
function Window({ renderContent, name }) {
  const { openName, close } = useContext(ModalContext);

  const ref = useDetectOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{renderContent(close)}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
