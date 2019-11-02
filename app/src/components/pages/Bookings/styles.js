import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 30px 0px;
`;

export const Brand = styled.Image`
  align-self: center;
  height: 32px;
  margin-top: 10px;
`;

export const Title = styled.Text`
  color: #444;
  font-size: 20px;
  margin-bottom: 15px;
  margin-top: 30px;
  padding: 0px 20px;
`;

export const Bold = styled.Text`
  font-weight: bold;
`;

export const Centralize = styled.View`
  padding: 0px 20px;
  width: 100%;
`;

export const List = styled.FlatList`
  width: 100%;
`;

export const Spot = styled.View`
  margin-bottom: 30px;
  width: 100%;
`;

export const Columns = styled.View`
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

export const About = styled.View``;

export const Status = styled.View`
  padding-left: 20px;
`;

export const Big = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  width: 100%;
`;

export const Thumbnail = styled.Image`
  border-radius: 2px;
  height: 100px;
  width: 100px;
`;

export const Company = styled.Text`
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
`;

export const Price = styled.Text`
  font-size: 15px;
  color: #999;
  margin-top: 2px;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  border-radius: 2px;
  background-color: #f05a5b;
  justify-content: center;
  height: 45px;
  margin-top: 15px;
`;

export const WhiteText = styled.Text`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
`;
