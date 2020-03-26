import styled from 'styled-components';
import { Form as Frm } from '@unform/web';

export const Container = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  margin: 0px auto;
  max-width: 1120px;
  width: 100%;

  > div {
    align-items: center;
    background-color: #f0f0f5;
    border-radius: 8px;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    padding: 96px;
    width: 100%;
  }
`;

export const Section = styled.section`
  max-width: 380px;
  width: 100%;

  h1 {
    margin: 64px 0px 32px;
    font-size: 32px;
  }

  p {
    font-size: 18px;
    color: #737380;
    line-height: 32px;
  }
`;

export const Form = styled(Frm)`
  max-width: 450px;
  width: 100%;

  input {
    margin-top: 8px;
  }

  div {
    display: flex;

    input + input {
      margin-left: 8px;
    }
  }
`;
