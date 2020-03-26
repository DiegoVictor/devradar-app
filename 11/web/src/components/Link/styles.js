import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled(Link)`
  align-items: center;
  color: #41414d;
  display: flex;
  font-size: 18px;
  font-weight: 500;
  margin-top: 40px;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  svg {
    margin-right: 8px;
  }
`;
