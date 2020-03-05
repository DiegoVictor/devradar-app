import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  align-items: center;
  background-color: #f5f5f5;
  flex: 1;
  justify-content: center;
  padding: 30px;
`;

export const Input = styled.TextInput`
  align-self: stretch;
  background-color: #fff;
  border-color: #ddd;
  border-radius: 4px;
  border-width: 1px;
  height: 46px;
  margin-top: 20px;
  padding: 0px 15px;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  align-self: stretch;
  background-color: #df4723;
  border-radius: 4px;
  justify-content: center;
  height: 46px;
  margin-top: 10px;
`;

export const Text = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
