import * as React from "react";
import { Button, Image, Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import MainDisplay from "./MainDisplay";

export default function HomeScreen() {
  return (
    <View>
      <MainDisplay />
    </View>
  );
}

const styles = StyleSheet.create({});
