import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import AccountScreen from "../../screens/AccountTab/Account.screen";
import LoginScreen from "../../screens/AccountTab/Login.screen";
import ProfileScreen from "../../screens/AccountTab/Profile.screen";
import { AccountTabStackParamList } from "../../types";
import SignupScreen from "../../screens/AccountTab/Signup.screen";


const AccountStack = createStackNavigator<AccountTabStackParamList>();

export function AccountNavigator() {
  return (
    <AccountStack.Navigator initialRouteName = "Account" screenOptions={{ headerShown: true }}>
      <AccountStack.Screen
        name="Account"
        component={AccountScreen}
      />
      <AccountStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerTitle: 'LoginScreen' }}
      />
      <AccountStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerTitle: 'ProfileScreen' }}
      />
      <AccountStack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ headerTitle: 'SignupScreen' }}
      
      />
      
    </AccountStack.Navigator>
  );
}
