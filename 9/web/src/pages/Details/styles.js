import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  float: left;
  margin-bottom: 10px;
  width: 70%;

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
  margin-bottom: 10px;
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
      align-items: center;
      background-color: #f5f5f5;
      color: #555;
      display: flex;
      float: right;
      font-weight: 400;
      height: 35px;
      padding: 2px 10px;
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

export const LinkButton = styled(Link)`
  color: #555;
  float: right;
  width: auto;
`;
