import styled from 'styled-components';

export const Container = styled.div`
  margin: auto;
  max-width: 980px;
  padding: 50px 0px;
  text-align: center;
`;

export const Developers = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 50px;
`;

export const Developer = styled.div`
  border-radius: 4px;
  box-shadow: 0px 0px 3px #ccc;
  display: flex;
  padding: 10px;
  height: auto;
  width: 316px;
`;

export const Avatar = styled.img`
  border-radius: 4px;
  height: 100px;
  min-height: 100%;
  width: auto;
`;

export const Description = styled.div`
  padding: 0px 10px 10px;
  text-align: left;
`;

export const Bio = styled.div`
  color: #555;
  font-size: 12px;
  margin-top: 10px;
  width: 100%;
`;
