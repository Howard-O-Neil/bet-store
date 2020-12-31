import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Category: undefined;
  Home: undefined;
  Message: undefined;
  Account: undefined;
};

export type HomeTabParamList = {
  Home: undefined;
};

export type CategoryTabParamList = {
  Category: undefined;
};


export type MessageTabParamList = {
  Message: undefined;
};

export type AccountTabStackParamList = {
  Account: undefined;
  Login: undefined;
  Profile: undefined;
  Signup:undefined;
};