import React from 'react'
import {StyleSheet,Text,View, Button} from 'react-native'
import {createBottomTabNavigator,createStackNavigator, StackViewTransitionConfigs} from 'react-navigation'



class LoginScreen extends React.Component{
    
    constructor(props){
        super(props);
        this.state ={
        username: '',
        email: '',
            
        }
    }
    
    
    
    
    static navigationOptions = {
    header: null
    }
    
    render() {
        return (
                <View style = {styles.container}>
                <Button title="Go To Profile Page"
                onPress={()=>this.props.navigation.navigate('Home',{url: 'https://api.github.com/users/yaoxiaosui', repo_url:'https://api.github.com/users/yaoxiaosui/repos', following_url: 'https://api.github.com/users/yaoxiaosui/following',
                                                            followers_url:'https://api.github.com/users/yaoxiaosui/followers'                                                            })}/>
                
                </View>
                );
    }
}

export default LoginScreen;


const styles = StyleSheet.create({
                                 container: {
                                 flex: 1,
                                 backgroundColor: '#fff',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 },
                                 
                                 });
