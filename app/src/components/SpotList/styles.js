import styled from 'styled-components/native';

export const Container = styled.View`
  margin-top: 30px;
`;

export const Title = styled.Text`
  color: #444;
  font-size: 20px;
  margin-bottom: 15px;
  padding: 0px 20px;
`;

export const Bold = styled.Text`
  font-weight: bold;
`;

export const List = styled.FlatList`
  padding: 0px 20px;
`;

export const Spot = styled.View`
  margin-right: 15px;
`;

export const Thumbnail = styled.Image`
  border-radius: 2px;
  height: 120px;
  width: 200px;
`;

export const Company = styled.Text`
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

export const Price = styled.Text`
  font-size: 15px;
  color: #999;
  margin-top: 5px;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  border-radius: 2px;
  background-color: #f05a5b;
  justify-content: center;
  height: 32px;
  margin-top: 15px;
`;

export const WhiteText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
`;
