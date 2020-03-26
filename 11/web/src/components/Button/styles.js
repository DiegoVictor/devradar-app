import styled from 'styled-components';

export const Container = styled.button`
  background-color: #e02041;
  border-radius: 8px;
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  height: 60px;
  line-height: 60px;
  margin-top: 16px;
  transition: filter 0.2s;
  text-align: center;
  text-decoration: none;
  width: 100%;

  &:hover {
    filter: brightness(90%);
  }
`;
