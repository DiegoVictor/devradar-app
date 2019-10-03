import styled from 'styled-components';

export const Spots = styled.ul`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  margin-bottom: 30px;
  width: 100%;
`;

export const Spot = styled.li`
  display: flex;
  flex-direction: column;

  strong {
    color: #444;
    font-size: 24px;
    margin-top: 10px;
  }

  span {
    color: #999;
    font-size: 15px;
  }
`;

export const Banner = styled.header`
  background-image: url(${props => props.url});
  background-size: cover;
  border-radius: 4px;
  height: 120px;
  width: 100%;
`;
