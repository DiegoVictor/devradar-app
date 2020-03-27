import styled from 'styled-components/native';
import Constants from 'expo-constants';

export const Action = styled.TouchableOpacity`
  align-items: center;
  background-color: #e02041;
  border-radius: 8px;
  height: 50px;
  justify-content: center;
  width: 48%;
`;

export const ActionText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
`;

export const Back = styled.TouchableOpacity``;

export const Box = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 24px;
`;

export const Container = styled.View`
  flex: 1;
  padding: ${Constants.statusBarHeight + 20}px 24px;
`;

export const Description = styled.Text`
  color: #737380;
  font-size: 15px;
  margin-top: 16px;
`;

export const Incident = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  margin-top: 48px;
  padding: 24px;
`;

export const Header = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const Label = styled.Text`
  color: #41414d;
  font-size: 14px;
  font-weight: bold;
  margin-top: 24px;
`;

export const Title = styled.Text`
  color: #13131a;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
`;

export const Value = styled.Text`
  color: #737380;
  font-size: 15px;
  margin: 8px 0px 0px;
`;
