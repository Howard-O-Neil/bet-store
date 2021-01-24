import { createStackNavigator } from "@react-navigation/stack";
import CategoryScreen from "../../screens/CategoryTab/Category.screen";
import { CategoryTabParamList, HomeTabParamList } from "../../types";
import React from "react";

const Stack = createStackNavigator<CategoryTabParamList>();

export function CategoryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
      initialRouteName="Category"
    >
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ headerTitle: "Category Screen" }}
      />
    </Stack.Navigator>
  );
}
