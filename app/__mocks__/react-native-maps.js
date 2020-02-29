/* eslint-disable react/prop-types */
import React from 'react';
import { View } from 'react-native';

export function Marker({ ...props }) {
  return <View {...props} />;
}

export function Callout({ ...props }) {
  return <View {...props} />;
}

export const callbacks = {};
export const state = {};

export default function MapView({
  onRegionChangeComlpete,
  initialRegion,
  ...props
}) {
  callbacks.onRegionChangeComlpete = onRegionChangeComlpete;
  state.initialRegion = initialRegion;

  return <View {...props} />;
}
