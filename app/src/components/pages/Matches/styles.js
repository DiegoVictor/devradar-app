import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  align-items: center;
  background-color: #f5f5f5;
  flex: 1;
`;

export const Brand = styled.Image`
  margin-top: 30px;
`;

export const Title = styled.Text`
  color: #df4723;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const Developers = styled.FlatList`
  margin-top: 30px;
  padding: 0px 20px;
  width: 100%;
`;

export const Developer = styled.View`
  border-color: #dddddd;
  border-radius: 8px;
  border-width: 1px;
  flex-direction: row;
  padding: 5px;
`;

export const Avatar = styled.Image`
  border-radius: 4px;
  height: 120px;
  width: 120px;
`;

export const Description = styled.View`
  padding: 5px 10px;
  flex: 1;
`;

export const Bio = styled.Text`
  font-size: 13px;
`;

export const Text = styled.Text`
  font-weight: bold;
`;

export const Empty = styled.Text`
  align-self: center;
  color: #999999;
  font-size: 20px;
  font-weight: bold;
  margin-top: 50px;
`;
