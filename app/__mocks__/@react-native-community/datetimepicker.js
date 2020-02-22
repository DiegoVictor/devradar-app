/* eslint-disable react/prop-types */
import React from 'react';
import { TextInput } from 'react-native';

export default ({ value, onChange, testID }) => {
  return (
    <TextInput
      testID={testID}
      value={value.toISOString()}
      onChangeText={v => {
        onChange({}, v);
      }}
    />
  );
};
