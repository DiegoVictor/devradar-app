import styled from 'styled-components/native';
import MapView from 'react-native-maps';

export const Map = styled(MapView)`
  flex: 1;
`;

export const Search = styled.View`
  flex-direction: row;
  left: 20px;
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 5;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  background-color: #8e4dff;
  border-radius: 25px;
  justify-content: center;
  height: 50px;
  margin-left: 15px;
  width: 50px;
`;

export const Input = styled.TextInput`
  background-color: #FFF;
  border-radius: 25px;
  color: #333;
  flex: 1;
  font-size: 16px;
  height: 50px;
  padding: 0px 20px;
  shadow-color: #000;
  shadow-offset: { width: 4px, height: 4px };
  shadow-opacity: 0.2;
  elevation: 2;
`;
