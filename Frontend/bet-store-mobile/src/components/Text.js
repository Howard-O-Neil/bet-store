import React from "react";
import { Text as DefaultText } from "react-native";

import defaultStyles from "../config/styles";

export default function Text({ children, style }) {
  return (
    <DefaultText style={[defaultStyles.text, style]}>{children}</DefaultText>
  );
}
