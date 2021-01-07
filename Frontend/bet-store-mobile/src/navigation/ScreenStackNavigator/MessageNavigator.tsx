import { createStackNavigator } from "@react-navigation/stack";
import CategoryScreen from "../../screens/CategoryTab/Category.screen";
import MessageScreen from "../../screens/MessageTab/Message.screen";
import { MessageTabParamList } from "../../types";
import React from "react";

const Stack = createStackNavigator<MessageTabParamList>();

export function MessageNavigator() {
  return (
    <Stack.Navigator screenOptions =  {{headerShown: true}} initialRouteName = "Message">
      <Stack.Screen
        name="Message"
        component={MessageScreen}
        options={{ headerTitle: 'Message Screen' }}
      />
    </Stack.Navigator>
  );
}
