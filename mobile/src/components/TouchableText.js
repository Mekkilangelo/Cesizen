import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

// This component safely wraps text inside a touchable
const TouchableText = ({ onPress, style, children }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={style}>{children}</Text>
    </TouchableOpacity>
  );
};

export default TouchableText;
