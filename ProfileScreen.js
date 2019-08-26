import React from 'react'
import {ScrollView,Alert,AsyncStorage,StyleSheet,Text,View,Button,Image,ActivityIndicator,Linking,FlatList,TouchableOpacity} from 'react-native'
import {createBottomTabNavigator,createStackNavigator, StackViewTransitionConfigs} from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import {SearchBar,Avatar,ListItem,List} from 'react-native-elements'
import Svg,{ Circle,} from 'react-native-svg';
import { LineChart, Grid,XAxis } from 'react-native-svg-charts'



//import LoginScreen from './LoginScreen'
//import HomeScreen from './HomeScreen'
itemId = 'https://api.github.com/users/yaoxiaosui'
repoId = 'https://api.github.com/users/yaoxiaosui/repos'
followingID = 'https://api.github.com/users/yaoxiaosui/following'
followerID = 'https://api.github.com/users/yaoxiaosui/followers'
console.disableYellowBox = true
myToken = '844977fa11b074afd7b0d49e0547227b867a7fad'
link = null




export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        isLoading: true,
        bio: null,
        username: null,
        follwer_count: null,
        follwing_count: null,
        repo_count: null,
        real_name: null,
        create_date: null,
        avatar_url: null,
        repo_url: null,
        url: null,
        followers_url: null,
            
        }
    }
    
    componentDidMount () {
        return fetch(itemId)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            bio: responseJson.bio,
                            isLoading: false,
                            dataSource: responseJson.id,
                            username: responseJson.login,
                            follwer_count: responseJson.followers,
                            follwing_count: responseJson.following,
                            repo_count: responseJson.public_repos,
                            real_name: responseJson.name,
                            create_date: responseJson.created_at.substring(0,10),
                            avatar_url: responseJson.avatar_url,
                            repo_url:responseJson.repos_url,
                            url: responseJson.url,
                            followers_url: responseJson.followers_url,
                            
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    render() {
        itemId = this.props.navigation.getParam('url', 'NO-ID');
        repoId = this.props.navigation.getParam('repo_url', 'NO-ID');
        
        this.componentDidMount();
        
        
        
        
        if (this.state.isLoading) {
            return (
                    <View style={styles.container}>
                    <ActivityIndicator />
                    </View>
                    )
        }
        return(
               <View style={styles.container}>
               <View style={styles.header}>
               <View style={styles.headerContent}>
               <Image style={styles.avatar}
               source={{uri: this.state.avatar_url}}/>
               
               <Text style={styles.name}>
               {this.state.username}
               </Text>
               </View>
               </View>
               
               <Text style={styles.textInfo}>
               User: {this.state.username}
               </Text>
               
               
               <Text style={styles.textInfo}>
               Name: {this.state.real_name}
               </Text>
               
               <TouchableOpacity onPress = {()=> this.props.navigation.navigate('Repository',{repo_url: this.state.repo_url})} >
               <Text style={styles.textInfo}>
               Repository: {this.state.repo_count}
               </Text>
               </TouchableOpacity>
               
               
               <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Followings',
                                                                               {following_url: this.state.url.concat('/following')})}>
               <Text style={styles.textInfo}>
               Following: {this.state.follwing_count}
               </Text>
               </TouchableOpacity>
               
               
               
               <TouchableOpacity onPress = {()=>this.props.navigation.navigate('Followers',
                                                                               {followers_url:this.state.followers_url})}>
               <Text style={styles.textInfo}>
               Followers: {this.state.follwer_count}
               </Text>
               </TouchableOpacity>
               
               <Text style={styles.textInfo}>
               Date: {this.state.create_date}
               </Text>
               
               </View>
               );
    }
    
    //cite: get this idea from the youtube tutorial https://www.youtube.com/watch?v=aCe0h50hyCc
    
    saveData = async () =>{
        let info = {
        username: this.state.username,
        realname: this.state.real_name,
        date: this.state.create_date,
        followingcount: this.state.follwing_count,
            
        }
        AsyncStorage.setItem('profile_info',JSON.stringify(info))
    }
    
    DisplayData = async() => {
        try{
            let info = await AsyncStorage.getItem('profile_info')
            let parsed = JSON.parse(info)
            //Alert.alert("Here is profile information: ", "UserName: "+parsed.username)
            Alert.alert(
                        'Stored Information',
                        '',
                        [
                         {text: "User: "+parsed.username},
                         {text: "Name: "+parsed.realname},
                         {text: "Date: "+parsed.date},
                         {text: 'OK', onPress: () => console.log('OK Pressed')},
                         ],
                        { cancelable: false }
                        )
            
        }
        catch(error){
            Alert.alert("Empty Data")
        }
    }
    
    clearAsyncStorage = async() => {
        AsyncStorage.clear();
    }
}



export class Repository extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        isLoading: true,
        data:'',
        }
    }
    
    componentDidMount () {
        return fetch(repoId)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson,
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    search(text){
        link = 'https://api.github.com/search/repositories?q='+text
        return fetch(link)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson.items
                            
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    
    renderHeader = () => {
        return (
                <SearchBar
                round
                lightTheme
                onChangeText={text=>this.search(text)}
                //onClear=null
                placeholder='Type Here...' />
                );
    };
    
    render() {
        
        repoId = this.props.navigation.getParam('repo_url', 'NO-ID');
        //this.componentDidMount();
        
        if (this.state.isLoading) {
            return (
                    <View style={styles.container}>
                    <ActivityIndicator/>
                    </View>
                    )
        }
        else return (
                     <ScrollView>
                     <View style={styles.container}>
                     
                     <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                     <FlatList
                     data={this.state.data}
                     renderItem={({ item }) => (
                                                <TouchableOpacity
                                                onPress = {
                                                () => Alert.alert(
                                                                  'Options',
                                                                  '',
                                                                  [
                                                                   {text: 'View Repository', onPress: () => Linking.openURL(item.html_url)},
                                                                   {text: 'View Data', onPress: () => this.props.navigation.navigate('DataVisulization',{
                                                                                                                                     repo_name:item.name, user:item.owner.login})},
                                                                   {text: 'Star', onPress: () => this.star(item.name,item.owner.login)},
                                                                   {text: 'Unstar', onPress: () => this.unstar(item.name,item.owner.login)},
                                                                   {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                                   ],
                                                                  { cancelable: false }
                                                                  )}>
                                                <ListItem
                                                title={`${item.owner.login}  repo_name: ${item.name}` }
                                                subtitle={item.description}
                                                containerStyle={{ borderBottomWidth: 0 }}
                                                />
                                                </TouchableOpacity>
                                                )}
                     keyExtractor={item => item.id.toString()}
                     ItemSeparatorComponent={this.renderSeparator}
                     ListHeaderComponent={this.renderHeader}
                     />
                     </List>
                     
                     </View>
                     </ScrollView>
                     );
        
    }
    
    saveData = async () =>{
        let info = JSON.stringify(this.state.data)
        AsyncStorage.setItem('repo_info',info)
    }
    
    DisplayData = async() => {
        try{
            let info = await AsyncStorage.getItem('repo_info')
            let parsed = JSON.parse(info)
            //Alert.alert(parsed[0].name)
            temp = []
            var i = 0
            for(i=0;i<parsed.length;i++){
                temp.push(parsed[i].name)
                temp.push(parsed[i].description)
            }
            alert("Stored Repositories :" + temp)
            
        }
        catch(error){
            Alert.alert("Empty Data")
        }
    }
    
    async star(reponame,username){
        link = 'https://api.github.com/user/starred/' + username+ '/'+ reponame + '?access_token=' + myToken
        return fetch(link,{
                     method: 'PUT',
                     headers:{
                     'Content-Length':0,
                     }
                     }
                     )
    }
    
    async unstar(reponame,username){
        link = 'https://api.github.com/user/starred/' + username+ '/'+ reponame + '?access_token=' + myToken
        return fetch(link,{
                     method: 'DELETE',
                     headers:{
                     'Content-Length':0,
                     }
                     }
                     )
    }
    
    
    
    
    
    clearAsyncStorage = async() => {
        AsyncStorage.clear();
    }
    
}




export class Followings extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
        isLoading: true,
        data: ''
        }
    }
    
    componentDidMount () {
        return fetch(followingID)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson
                            
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    search(text){
        link = 'https://api.github.com/search/users?q='+text
        return fetch(link)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson.items
                            
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    
    renderHeader = () => {
        return (
                <SearchBar
                round
                lightTheme
                onChangeText={text=>this.search(text)}
                //onClear=null
                placeholder='Type Here...' />
                );
    };
    render() {
        followingID = this.props.navigation.getParam('following_url', 'NO-ID');
        //this.componentDidMount()
        if (this.state.isLoading) {
            return (
                    <View style={styles.container}>
                    <ActivityIndicator />
                    </View>
                    )
        }
        return (
                
                <View style={styles.container}>
                <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                <FlatList
                data={this.state.data}
                renderItem={({ item }) => (
                                           <ScrollView>
                                           <TouchableOpacity
                                           onPress = {
                                           () => Alert.alert(
                                                             'Options',
                                                             '',
                                                             [
                                                              {text: 'View Profile', onPress: () => this.props.navigation.navigate('Profile',{url: item.url,followers_url: item.followers_url,following_url: item.following_url,repo_url: item.repos_url})},
                                                              {text: 'Follow', onPress: () => this.follow(item.login)},
                                                              {text: 'Unfollow', onPress: () => this.unfollow(item.login)},
                                                              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                              ],
                                                             { cancelable: false }
                                                             )
                                           }>
                                           <ListItem
                                           roundAvatar
                                           title={`${item.login}  id: ${item.id}` }
                                           avatar={{ uri: item.avatar_url}}
                                           containerStyle={{ borderBottomWidth: 0 }}
                                           />
                                           </TouchableOpacity>
                                           </ScrollView>
                                           )}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
                
                />
                </List>
                </View>
                
                );
    }
    
    saveData = async () =>{
        let info = JSON.stringify(this.state.data)
        AsyncStorage.setItem('following_info',info)
    }
    
    DisplayData = async() => {
        try{
            let info = await AsyncStorage.getItem('following_info')
            let parsed = JSON.parse(info)
            temp = []
            var i = 0
            for(i=0;i<parsed.length;i++){
                temp.push(parsed[i].login)
            }
            alert("Following :" + temp)
        }
        catch(error){
            Alert.alert("Empty Data")
        }
    }
    async follow(username){
        link = 'https://api.github.com/user/following/' + username+ '?access_token=' + myToken
        return fetch(link,{
                     method: 'PUT',
                     headers:{
                     'Content-Length':0,
                     }
                     }
                     )
    }
    
    async unfollow(username){
        link = 'https://api.github.com/user/following/' + username+ '?access_token=' + myToken
        return fetch(link,{
                     method: 'DELETE',
                     headers:{
                     'Content-Length':0,
                     }
                     }
                     )
    }
    clearAsyncStorage = async() => {
        AsyncStorage.clear();
    }
    
}





export class Followers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        isLoading: true,
        data: ''
            
        }
    }
    
    componentDidMount () {
        return fetch(followerID)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson
                            
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    search(text){
        link = 'https://api.github.com/search/users?q='+text
        return fetch(link)
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson.items
                            
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    
    renderHeader = () => {
        return (
                <SearchBar
                round
                lightTheme
                onChangeText={text=>this.search(text)}
                //onClear=null
                placeholder='Type Here...' />
                );
    };
    
    render() {
        followerID = this.props.navigation.getParam('followers_url', 'NO-ID');
        //this.componentDidMount();
        
        if (this.state.isLoading) {
            return (
                    <View style={styles.container}>
                    <ActivityIndicator />
                    </View>
                    )
        }
        return(
               //cite: https://github.com/vikrantnegi/react-native-searchable-flatlist/blob/master/src/SearchableList.js
               <View style={styles.container}>
               <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
               <FlatList
               data={this.state.data}
               renderItem={({ item }) => (
                                          
                                          <ScrollView>
                                          <TouchableOpacity
                                          onPress = {
                                          () => Alert.alert(
                                                            'Options',
                                                            '',
                                                            [
                                                             {text: 'View Profile', onPress: () => this.props.navigation.navigate('Profile',{url: item.url,followers_url: item.followers_url,following_url: item.following_url,repo_url: item.repos_url})},
                                                             {text: 'Follow', onPress: () => this.follow(item.login)},
                                                             {text: 'Unfollow', onPress: () => this.unfollow(item.login)},
                                                             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                             ],
                                                            { cancelable: false }
                                                            )
                                          
                                          }>
                                          <ListItem
                                          roundAvatar
                                          title={`${item.login}  id: ${item.id}` }
                                          avatar={{ uri: item.avatar_url}}
                                          containerStyle={{ borderBottomWidth: 0 }}
                                          />
                                          </TouchableOpacity>
                                          </ScrollView>
                                          )}
               keyExtractor={item => item.id.toString()}
               ItemSeparatorComponent={this.renderSeparator}
               ListHeaderComponent={this.renderHeader}
               />
               </List>
               
               </View>
               );
    }
    
    saveData = async () =>{
        let info = JSON.stringify(this.state.data)
        AsyncStorage.setItem('follower_info',info)
    }
    
    DisplayData = async() => {
        try{
            let info = await AsyncStorage.getItem('follower_info')
            let parsed = JSON.parse(info)
            temp = []
            var i = 0
            for(i=0;i<parsed.length;i++){
                temp.push(parsed[i].login)
            }
            alert("Follower :" + temp)
            
        }
        catch(error){
            Alert.alert("Empty Data")
        }
    }
    
    async follow(username){
        link = 'https://api.github.com/user/following/' + username+ '?access_token=' + myToken
        return fetch(link,{
                     method: 'PUT',
                     headers:{
                     'Content-Type':0,
                     }
                     }
                     )
    }
    
    async unfollow(username){
        link = 'https://api.github.com/user/following/' + username+ '?access_token=' + myToken
        return fetch(link,{
                     method: 'DELETE',
                     headers:{
                     'Content-Length':0,
                     }
                     }
                     )
    }
    
    clearAsyncStorage = async() => {
        AsyncStorage.clear();
    }
}

const temp = 'https://api.github.com/repos/twbs/bootstrap/stats/commit_activity'
//https://api.github.com/repos/vinta/awesome-python/stats/commit_activity
//https://api.github.com/repos/toddmotto/public-apis/stats/commit_activity
export class Data extends React.Component{
    constructor(props){
        super(props);
        this.state ={
        data: ''
        }
    }
    
    componentDidMount(){
        return fetch('https://api.github.com/repos/toddmotto/public-apis/stats/commit_activity')
        .then((response) => response.json())
        .then((responseJson) => {
              this.setState({
                            data: responseJson
                            }, function(){
                            
                            });
              
              })
        .catch((error) =>{
               console.error(error);
               });
    }
    
    
    render(){
        //repo_name = this.props.navigation.getParam('repo_name', 'some-default-value');
        //user = this.props.navigation.getParam('user', 'some-default-value');
        //temp = 'https://api.github.com/repos/'+ user + '/'+repo_name + '/stats/commit_activity'
        //this.componentDidMount()
        
        let info = JSON.stringify(this.state.data)
        let parsed = JSON.parse(info)
        const data = []
        var i = 0
        for(i=0;i<parsed.length;i++){
            data.push(parsed[i].total)
        }
        return(
               //cite: source code from https://www.npmjs.com/package/react-native-svg-charts
               <View>
               <Text style={styles.header}>The number of commits</Text>
               <FlatList
               data={this.state.data}
               renderItem={({item,index}) =>
               <View>
               <LineChart
               style={{ height: 200 }}
               data={ item.days }
               svg={{ stroke: 'rgb(0, 0, 225)' }}
               contentInset={{ top: 20, bottom: 20 }}
               >
               <Grid/>
               </LineChart>
               <Text>Week:{index}</Text>
               
               </View>
               }
               />
               
               </View>


               );
    }
}

link = 'https://api.github.com/notifications?access_token=e34c605f6e7899b0f05d7420eaaca012afc9fe65'
export class Message extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        isLoading: true,
        data:'',
        }
    }
    
    componentDidMount () {
        return fetch(link,{
                     headers: {'Cache-Control':'no-cache'}
                     })
        .then ( (response) => response.json() )
        .then( (responseJson) => {
              this.setState({
                            isLoading: false,
                            data: responseJson,
                            })
              })
        .catch((error) => {
               console.log(error)
               });
    }
    
    render(){
        //link = 'https://api.github.com/notifications?access_token=0645743fe824e24d098848a17a15f5f2f7a98843'
        //this.componentDidMount()
        if (this.state.isLoading) {
            return (
                    <View style={styles.container}>
                    <ActivityIndicator />
                    </View>
                    )
        }
        return(
               <View style={styles.container}>
               <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
               <FlatList
               data={this.state.data}
               renderItem={({ item }) => (
                                          <ScrollView>
                                          <TouchableOpacity>
                                          <ListItem
                                          title={`${item.subject.title}  reason: ${item.reason}` }
                                          subtitle={item.repository.name}
                                          containerStyle={{ borderBottomWidth: 0 }}
                                          />
                                          </TouchableOpacity>
                                          </ScrollView>
                                          )}
               keyExtractor={item => item.reason.toString()}
               ItemSeparatorComponent={this.renderSeparator}
               ListHeaderComponent={this.renderHeader}
               />
               </List>
               
               </View>
               );
    }
}





export default createBottomTabNavigator({
                                        
                                        Profile:{screen: Profile,
                                        navigationOptions:{
                                        tabBarLabel:'Profile',
                                        tabBarIcon : ({tintColor}) => (
                                                                       <Icon name ='ios-contact' size={24}/>)
                                        }
                                        },
                                        
                                        Repository:{screen: Repository,
                                        navigationOptions:{
                                        tabBarLabel:'Repository',
                                        tabBarIcon : ({tintColor}) => (
                                                                       <Icon name ='ios-cloud' size={24}/>)
                                        }
                                        },
                                        
                                        Followers:{screen: Followers,
                                        navigationOptions:{
                                        tabBarLabel:'Followers',
                                        tabBarIcon : ({tintColor}) => (
                                                                       <Icon name ='ios-contacts' size={24}/>)
                                        }
                                        },
                                        
                                        Followings:{screen: Followings,
                                        navigationOptions:{
                                        tabBarLabel:'Followings',
                                        tabBarIcon : ({tintColor}) => (
                                                                       <Icon name ='ios-contacts' size={24}/>)
                                        }
                                        },
                                        
                                        Data:{screen: Data,
                                        navigationOptions:{
                                        tabBarLabel:'Data',
                                        tabBarIcon : ({tintColor}) => (
                                                                       <Icon name ='ios-bookmark' size={24}/>)
                                        }
                                        },
                                        
                                        Message:{screen: Message,
                                        navigationOptions:{
                                        tabBarLabel:'Message',
                                        tabBarIcon : ({tintColor}) => (
                                                                       <Icon name ='ios-mail' size={24}/>)
                                        }
                                        },
                                        
                                        
                                        
                                        
                                        
                                        });
//cite: profile setting is from:https://bootdey.com/react-native-snippet/7/Simple-blue-profile
const styles = StyleSheet.create({
                                 header:{
                                 backgroundColor: "#1E90FF",
                                 },
                                 headerContent:{
                                 padding:30,
                                 alignItems: 'center',
                                 },
                                 avatar: {
                                 width: 130,
                                 height: 130,
                                 borderRadius: 63,
                                 borderWidth: 4,
                                 borderColor: "white",
                                 marginBottom:10,
                                 },
                                 name:{
                                 fontSize:22,
                                 color:"#FFFFFF",
                                 fontWeight:'600',
                                 },
                                 bodyContent: {
                                 flex: 1,
                                 alignItems: 'center',
                                 padding:30,
                                 },
                                 textInfo:{
                                 fontSize:20,
                                 marginTop:20,
                                 color: "black",
                                 textAlign: 'center',
                                 },
                                 
                                 });
