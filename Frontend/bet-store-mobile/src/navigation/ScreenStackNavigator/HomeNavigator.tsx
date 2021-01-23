import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeTab/Home.screen";
import React from "react";
import { HomeTabParamList } from "../../types";
import CategoryDetailsScreen from "../../screens/CategoryDetailsScreen";
import ProductScreen from "../../screens/ProductScreen";

const Stack = createStackNavigator<HomeTabParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: "Home Screen" }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryDetailsScreen}
        options={{ headerTitle: "Category Screen" }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{ headerTitle: "Product Screen" }}
      />
    </Stack.Navigator>
  );
}
