import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  align-items: center;
  background-color: #f5f5f5;
  flex: 1;
  justify-content: space-between;
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

export const Cards = styled.View`
  align-self: stretch;
  flex: 1;
  justify-content: center;
  max-height: 500px;
  position: relative;
  z-index: 1;
`;

export const Developer = styled.View`
  border-color: #dddddd;
  border-radius: 8px;
  border-width: 1px;
  margin: 30px;
  position: absolute;
  overflow: hidden;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: ${props => props.index};
`;

export const Avatar = styled.Image`
  flex: 1;
  height: 300px;
`;

export const Bio = styled.View`
  background-color: #ffffff;
  padding: 15px 20px;
`;

export const Name = styled.Text`
  color: #333333;
  font-size: 16px;
  font-weight: bold;
`;
export const Description = styled.Text`
  color: #999;
  font-size: 14px;
  line-height: 18px;
  margin-top: 5px;
`;

export const Empty = styled.Text`
  align-self: center;
  color: #999999;
  font-size: 24px;
  font-weight: bold;
`;

export const Actions = styled.View`
  flex-direction: row;
  margin-bottom: 30px;
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
  background-color: #ffffff;
  border-radius: 25px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.05);
  height: 50px;
  justify-content: center;
  margin: 0px 20px;
  width: 50px;
  z-index: 2;
`;
