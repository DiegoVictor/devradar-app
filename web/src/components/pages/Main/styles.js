import styled from 'styled-components';

export const Container = styled.div`
  margin: auto;
  max-width: 980px;
  padding: 50px 0px;
  text-align: center;
`;

export const Developers = styled.ul`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(3, 1fr);
  list-style: none;
  margin-top: 50px;
`;

export const Developer = styled.li`
  box-shadow: 0px 0px 3px #ccc;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  img {
    border-radius: 5px 5px 0px 0px;
    max-width: 100%;
  }
`;

export const Bio = styled.div`
  background-color: #fff;
  border: 0px;
  flex: 1;
  padding: 15px 20px;
  text-align: left;

  strong {
    color: #333;
    font-size: 16px;
  }

  p {
    color: #999;
    font-size: 14px;
    line-height: 20px;
    margin-top: 5px;
  }
`;

export const Actions = styled.div`
  background-color: #ffffff;
  border-radius: 0px 0px 4px 4px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 0px;

  button {
    background-color: #fff;
    border: 0px;
    cursor: pointer;
    height: 50px;

    &:hover {
      background-color: #eeeeee;

      img {
        transform: scale(1.25);
        transition: all 0.5s;
      }
    }
  }
`;

export const Center = styled.div`
  color: #999;
  font-size: 32px;
  font-weight: bold;
  margin-top: 300px;
`;
