import styled, { createGlobalStyle } from 'styled-components';

export const Container = styled.div`
  height: 100%;
  margin: auto;
  max-width: 980px;
  padding: 50px 0px;
  text-align: center;
`;

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;
    outline: 0px;
    padding: 0px;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background-color: #F5F5F5;
  }

  body, input, button {
    font-family: Roboto, sans-serif;
  }
`;
