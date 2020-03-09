import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  align-items: center;
  flex: 1;
  justify-content: center;
`;

export const Form = styled.View`
  align-self: stretch;
  padding: 0px 30px;
  margin-top: 30px;
`;

export const Label = styled.Text`
  color: #444;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  border: 1px solid #ddd;
  border-radius: 2px;
  color: #444;
  font-size: 16px;
  height: 44px;
  padding: 0px 20px;
  margin-bottom: 20px;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  border-radius: 2px;
  background-color: #f05a5b;
  justify-content: center;
  height: 42px;
`;

export const WhiteText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
