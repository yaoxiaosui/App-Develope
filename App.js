import React from 'react'
import {StyleSheet,Text,View} from 'react-native'
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import HomeScreen from './HomeScreen'
import ProfileScreen from './ProfileScreen'

 export default class App extends React.Component{
  render() {
    return (
        <AppStackNavigator/>
      );
  }
}

 const AppStackNavigator = createStackNavigator({
  Login: HomeScreen,
  Home: ProfileScreen
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});