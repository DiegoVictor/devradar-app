import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
  max-width: 980px;
  padding: 0px 15px;
  top: 0px;
  width: 100%;

  button {
    background-color: transparent;
    border: 0px;
    cursor: pointer;
  }
`;

export const Href = styled(Link)`
  color: #df4723;
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
  margin-top: 11px;
  padding: 5px 10px;
  text-decoration: none;
  text-transform: uppercase;

  &::after {
    background-color: #df4723;
    content: ' ';
    display: block;
    height: 3px;
    transition: all 0.25s;
    width: ${props => (props.active ? '100%' : '0%')};
  }

  &:hover {
    &::after {
      width: 100%;
    }
  }
`;

export const Nav = styled.div`
  align-items: center;
  display: flex;
`;

export const Profile = styled.div`
  border-radius: 4px;
  color: #fff;
  height: 49px;
  overflow: hidden;
  padding: 2px;
  text-align: left;
  transition: all 0.45s;
  width: 49px;

  &:hover {
    width: 95px;
  }

  img {
    border-radius: 4px;
    width: 45px;
  }

  div {
    font-size: 14px;
    font-weight: bold;
    line-height: 58px;
    padding-right: 10px;
    position: relative;
    right: -56px;
    text-transform: uppercase;
    top: -49px;
  }
`;
