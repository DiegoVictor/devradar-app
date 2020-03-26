import styled from 'styled-components';

export const Container = styled.div`
  margin: 32px auto;
  max-width: 1180px;
  padding: 0px 30px;
  width: 100%;

  h1 {
    margin-bottom: 24px;
    margin-top: 80px;
  }
`;

export const Header = styled.header`
  align-items: center;
  display: flex;

  span {
    font-size: 20px;
    margin-left: 24px;
  }

  img {
    height: 64px;
  }

  > a {
    margin-left: auto;
    margin-top: 0px;
    width: 260px;

    button {
      margin-top: 0px;
    }
  }

  > button {
    background-color: transparent;
    border-radius: 4px;
    height: 60px;
    margin-left: 16px;
    width: 60px;
  }
`;

export const Incidents = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24px;
  list-style: none;

  li {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    position: relative;

    button {
      position: absolute;
      right: 24px;
      top: 24px;

      &:hover {
        opacity: 0.8;
      }
    }

    strong {
      color: #41414d;
      display: block;
      margin-bottom: 16px;
    }

    p {
      color: #737380;
      font-size: 16px;
      line-height: 21px;

      & + strong {
        margin-top: 32px;
      }
    }
  }
`;
