import AsyncStorage from "@react-native-async-storage/async-storage"

export const SetItemInStorage = async (key:string, value:string) => {
    try {
        await AsyncStorage.setItem(key,value);
    } catch (error) {
        console.log(error);
    }
}

export const EraseItemInStorage = async (key:string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log(error);
    }
}

export const GetItemInStorage = async (key:string):Promise<string|undefined> => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          return value
        }
      } catch (error) {
        console.log(error);
      }
}