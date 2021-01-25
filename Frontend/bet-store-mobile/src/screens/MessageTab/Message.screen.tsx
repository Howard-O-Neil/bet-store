import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ChatView } from '../../components/ChatView';
import { Text, View } from '../../components/Themed';

export default function MessageScreen() {
  return (
    <View style={styles.mainView}>
      <ChatView></ChatView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex:1,
  }
});
