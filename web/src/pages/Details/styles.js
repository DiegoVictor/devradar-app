import styled from 'styled-components';

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
  margin-top: 10px;

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
    padding: 5px;

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
