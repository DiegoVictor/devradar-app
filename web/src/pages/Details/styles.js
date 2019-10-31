import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div``;

export const Banner = styled.header`
  background-image: url(${props => props.url});
  background-size: cover;
  border-radius: 4px;
  height: 120px;
  width: 100%;
`;

export const Spot = styled.li`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;

  strong {
    color: #444;
    font-size: 24px;
    margin-top: 10px;
  }

  > span {
    color: #999;
    font-size: 15px;
  }
`;

export const Techs = styled.div`
  margin-bottom: 10px;

  span {
    background-color: #3588bd;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    margin: 0px 3px 3px 0px;
    padding: 4px 8px;
  }
`;

export const Bookings = styled.table`
  font-size: 14px;
  text-align: left;
  width: 100%;

  th {
    font-size: 12px;
    text-transform: uppercase;
  }

  td,
  th {
    color: #555;

    button {
      height: 35px;
      width: auto;
    }
  }

  td:last-child {
    text-align: right;
  }

  tr + tr {
    td {
      border-top: 1px solid #eee;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    width: 50%;
  }
`;

export const LinkButton = styled(Link)`
  background-color: #f05a5b;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 16px;
  font-weight: bold;
  height: 42px;
  line-height: 44px;
  padding: 0px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 0.25s;
  width: calc(50% - 10px);
`;
