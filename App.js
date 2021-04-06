import React, {useState} from 'react'
import AppNavigator from './src/navigation/AppNavigator';
import AdminNavigator from './src/navigation/AdminNavigator'
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <AppNavigator/>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

