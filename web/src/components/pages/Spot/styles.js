import styled from 'styled-components';

export const Thumbnail = styled.label`
  align-items: center;
  background-image: url(${props => props.url});
  background-position: center;
  background-size: cover;
  border: ${props => (props.url ? '0px' : '1px dashed #ddd')};
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 160px;
  margin-bottom: 20px;

  input {
    display: none;
  }

  img {
    display: ${props => (props.url ? 'none' : 'initial')};
  }
`;
