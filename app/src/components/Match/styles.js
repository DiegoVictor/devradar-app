import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  bottom: 0px;
  justify-content: center;
  left: 0px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 2;
`;

export const Image = styled.Image`
  height: 60px;
`;

export const Avatar = styled.Image`
  border-color: #ffffff;
  border-radius: 80px;
  border-width: 5px;
  height: 160px;
  margin: 30px 0px;
  width: 160px;
`;

export const Name = styled.Text`
  color: #ffffff;
  font-size: 26px;
  font-weight: bold;
`;

export const Bio = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 24px;
  margin-top: 10px;
  padding: 0px 30px;
  text-align: center;
`;

export const Close = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
  text-align: center;
`;
