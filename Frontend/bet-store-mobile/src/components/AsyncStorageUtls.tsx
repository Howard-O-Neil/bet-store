import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { AppState } from "../store";

export const SetItemInStorage = async (key:string, value:string) => {
    if(Platform.OS =='web')
    {
        return
    }
    try {
        await AsyncStorage.setItem(key,value);
    } catch (error) {
        console.log(error);
    }
}

export const EraseItemInStorage = async (key:string) => {
    if(Platform.OS =='web')
    {
        return
    }
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log(error);
    }
}

export const GetItemInStorage = async (key:string):Promise<string|undefined> => {
    if(Platform.OS =='web')
    {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZjJhYTg2YmExMzdkMDFjZjI4NWNkNiIsInVzZXIiOiJuZ29jNDE5MiIsImV4cCI6MTYxMDM0NDg1OCwiaWF0IjoxNjA5NzQwMDU4LCJpc3MiOiJsb2NhbGhvc3QifQ.-tAShAuuakhGk7Zt83ghiZbHxtZAWJtTeahMIim68bQ";
    }
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          return value
        }
      } catch (error) {
        console.log(error);
      }
}