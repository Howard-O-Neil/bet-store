import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeTab/Home.screen";
import React from "react";
import { HomeTabParamList } from "../../types";
import CategoryDetailsScreen from "../../screens/CategoryDetailsScreen";
import ProductScreen from "../../screens/ProductScreen";
import SearchBar from "../../components/SearchBar";
import { Header } from "react-native/Libraries/NewAppScreen";

const Stack = createStackNavigator<HomeTabParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: (props) => <SearchBar {...props} />,
      }}
      initialRouteName="Home"
      headerMode="screen"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Category" component={CategoryDetailsScreen} />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}
