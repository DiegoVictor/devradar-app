import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0px;

  strong {
    color: #ffffff;
    font-size: 32px;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 20px;
    line-height: 30px;
    margin-top: 10px;
    max-width: 400px;
  }

  button {
    background-color: transparent;
    border: 0px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    margin-top: 30px;
    text-transform: uppercase;
  }
`;

export const Avatar = styled.img`
  border-radius: 50%;
  border: 5px solid #ffffff;
  height: 200px;
  margin: 30px 0px;
  width: 200px;
`;
