import styled from 'styled-components';
import Logout from '../features/authentication/Logout.jsx';
import ButtonIcon from './ButtonIcon.jsx';
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeProvider.jsx';

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate('/account')}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon onClick={toggleDarkMode}>
          {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
