import styled from 'styled-components';
import { Form as Frm } from '@unform/web';

export const Container = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: space-between;
  margin: 0px auto;
  max-width: 1120px;
  width: 100%;

  section {
    margin-right: 30px;
    max-width: 350px;
    width: 100%;
  }
`;

export const Form = styled(Frm)`
  margin-top: 100px;

  h1 {
    font-size: 32px;
    margin-bottom: 32px;
  }
`;
