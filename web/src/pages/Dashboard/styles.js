import styled from 'styled-components';

export const Notifications = styled.ul`
  list-style: none;

  & + ul {
    margin-top: 15px;
  }
`;

export const Notification = styled.li`
  font-size: 16px;
  line-height: 24px;

  button {
    background-color: transparent;
    margin-right: 10px;
    padding: 0px;
    width: auto;

    &:hover {
      background-color: transparent;
    }
  }
`;

export const Accept = styled.button`
  color: #84c870;
`;

export const Cancel = styled.button`
  color: #e55e5e;
`;

export const Spots = styled.ul`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  margin-bottom: 30px;
  width: 100%;

  a {
    text-decoration: none;
  }
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
