import styled from 'styled-components/native';
import Constants from 'expo-constants';

export const Container = styled.View`
  flex: 1;
  padding: ${Constants.statusBarHeight + 20}px 24px;
`;

export const Header = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const Text = styled.Text`
  color: #737380;
  font-size: 15px;
`;

export const Strong = styled.Text`
  font-weight: bold;
`;

export const Title = styled.Text`
  color: #13131a;
  font-size: 30px;
  font-weight: bold;
  margin: 48px 0px 16px;
`;

export const Description = styled.Text`
  color: #737380;
  font-size: 16px;
  line-height: 24px;
`;

export const Incidents = styled.FlatList`
  margin-top: 32px;
`;

export const Incident = styled.View`
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 24px;
`;

export const Label = styled.Text`
  color: #41414d;
  font-size: 14px;
  font-weight: bold;
`;

export const Value = styled.Text`
  color: #737380;
  font-size: 15px;
  margin: 8px 0px 24px;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const ButtonText = styled.Text`
  color: #e02041;
  font-size: 15px;
  font-weight: bold;
`;
