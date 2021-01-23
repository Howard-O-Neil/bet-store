import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import AddProductScreen from "../AddProductScreen";
import CategoryDetailsScreen from "../CategoryDetailsScreen";

export default function CategoryScreen() {
  return (
    <View>
      <AddProductScreen />
    </View>
  );
}

const styles = StyleSheet.create({});
