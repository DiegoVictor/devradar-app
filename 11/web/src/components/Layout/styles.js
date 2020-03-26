import styled, { createGlobalStyle } from 'styled-components';

export const Container = styled.div``;

export default createGlobalStyle`
  * {
    margin: 0px;
    padding: 0px;
    outline: 0px;
    box-sizing: border-box;
  }

  body {
    background-color: #f0f0f5;
    font: 400 14px Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  input, button, textarea {
    font: 400 18px Roboto, sans-serif;
  }

  button {
    background-color: transparent;
    border: 0px;
    color: #fff;
    cursor: pointer;
  }

  form input, form textarea {
    border: 1px solid #dcdce6;
    border-radius: 8px;
    color: #333;
    height:60px;
    padding: 0px 24px;
    width: 100%;
  }

  form textarea {
    height: auto;
    line-height: 24px;
    min-height: 140px;
    padding-bottom: 16px;
    padding-top: 16px;
    resize: vertical;
  }
`;
