import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    width: 100%;

    input {
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #666;
      font-size: 16px;
      height: 48px;
      margin-top: 20px;
      padding: 0px 20px;

      &::placeholder {
        color: #999;
      }
    }
  }
`;

export const Button = styled.button`
  background-color: #df4723;
  border: 0px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  height: 48px;
  margin-top: 10px;
`;
