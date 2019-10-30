import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 70px auto 20px;
  max-width: 490px;
  width: 100%;
`;

export const Box = styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 30px;
  margin-top: 50px;
  width: 100%;

  > p {
    font-size: 22px;
    line-height: 30px;
    margin-bottom: 30px;
  }

  form {
    display: flex;
    flex-direction: column;

    label {
      color: #444;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;

      span {
        color: #999;
        font-size: 12px;
        font-weight: normal;
      }
    }

    input {
      border: 1px solid #ddd;
      border-radius: 2px;
      font-size: 16px;
      height: 45px;
      padding: 0px 15px;
      margin-bottom: 20px;
    }
  }
`;
