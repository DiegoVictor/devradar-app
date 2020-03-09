import styled from 'styled-components';

export default styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 30px;
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
      margin-top: 15px;

      span {
        color: #999;
        font-size: 12px;
        font-weight: normal;
      }
    }

    span {
      color: #f05a5b;
      margin-bottom: 5px;
      margin-top: 5px;
    }

    input {
      border: 1px solid #ddd;
      border-radius: 2px;
      font-size: 16px;
      height: 45px;
      padding: 0px 15px;
    }

    button {
      margin-top: 20px;
    }
  }
`;
