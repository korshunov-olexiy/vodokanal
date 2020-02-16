/* eslint-disable react/no-multi-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import {Alert, Button, Image, TextInput, SafeAreaView, View, SectionList, Text, TouchableHighlight, PermissionsAndroid} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {SwipeListView} from 'react-native-swipe-list-view';

import Database from './Database';
import styles from './appStyles';
/* Импортируем экраны */
//import EditCredentialsScreen from './ownComponents/EditCredentialsScreen';
import CabinetScreen from './ownComponents/CabinetScreen';

const db = new Database();

class RegScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            username: '',
            password: '',
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    static navigationOptions = { title: 'Вхід/реєстрація користувача', headerStyle: styles.RegScreen, headerTitleStyle: styles.RegScreenTitle,};

    getUsers(){
        let users = [];
        db.getAllUsers().then((data) => {
            users = data;
            this.setState({ users });
        });
    }

    data_flatlist =() => {
        let data = [];
        this.state.users.map( (user) => {
            data.push({username: user.username, password: user.password})
        })
        return data;
    }

    delUserMsg = (item) => {
        Alert.alert( 'Видалення користувача', 'Насправді видалити користувача ${item.username}?',
            [
                { text: 'Ні', onPress: () => { }, style: 'cancel', },
                {
                    text: 'Так',
                    onPress: () => {
                        db.deleteUser(item.username);
                        let users = this.state.users;
                        this.setState({users: users.filter(el=>el.username !== item.username)});
                    },
                },
            ],
            {cancelable: false},
        );
    };
  
    onLogin() {
        const { username, password } = this.state;
        let dt = new Date();
        let cur_day = dt.getDate();
        db.addUser({username, password});
        // Если текущий день больше 15 или меньше 5 - выдать ошибку
        if ((cur_day > 15) || (cur_day < 5)) { 
            Alert.alert("Помилка", "Показання приймаються з 5 по 15 числа кожного місяца");
        }
        else {
            if ((username == '')  || (password == '')){ Alert.alert('Помилка входу', "Введіть будь-ласка ім'я користувача та пароль"); }
        else{
            // login to url and get data
            const URL = "http://vodokanal.sumy.ua/sendform/authorization.php";
            var details = { 'login': username, 'pass': password };
            var formBody = [];
            for (var property in details) {
                var encodedUser = encodeURIComponent(property);
                var encodedPass = encodeURIComponent(details[property]);
                formBody.push(encodedUser + "=" + encodedPass);
            }
            formBody = formBody.join("&");
            var formdata = new FormData();
            formdata.append("login", username);
            formdata.append('pass', password);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", URL, true);
            xhr.send(formdata);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = (e) => {
                if (xhr.readyState !== 4){ return; }
                let status = xhr.status;
                switch(status){
                    case 0:
                    case 200:  // Если ответ сервера 200 (ошибок нет)
                        // получили ли мы с сайта форму для передачи показания воды
                        //якщо в відповіді сервера ми отримали попередні показання:
                        if (/v_old0 value=[\.\d]{1,}/.test(xhr.responseText)){
                            this.getUsers();
                            // открываем экран 'Cabinet'
                            this.props.navigation.navigate('Cabinet', {user: username, pass: password, xhr_responseText: xhr.responseText});
                            break;
                        }
                        else {Alert.alert(xhr.responseText); break; } //{Alert.alert("Спробуйте пізніше","Не зміг отримати дані з сайту"); break;}
                    case 404: //Если ответ сервера "Сайт не найден"
                        Alert.alert("Виникла помилка", "Сайт не знайдений");
                        break;
                    default:
                        Alert.alert("Виникла помилка", status.toString());
                        break;
                }
            };
        }
        }
    }

    renderSeparator = ({leadingItem, section})=>{
        if (section.noSeparator || !leadingItem.noSeparator)
            return null
        return <Separator />
    }

    RenderItem = (obj) =>{ //контролы отображающиеся в списке
        return (
            <TouchableHighlight
                underlayColor='#d0b2e0'
                style={styles.flat_touchable}
                onPress={()=>{this.setState({username: obj.username, password: obj.password})}}
                //onLongPress={()=>{ this.props.navigation.navigate('EditCredentials', {user: obj.username, pass: obj.password}); }}
            >
                <View style={{ height: 40 }}>
                    <Text style={styles.flat_username}>{obj.username}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    RenderHiddenItem = (obj) => { //контролы появляющиеся при свайпе
        return (
        <TouchableHighlight
            underlayColor='none'
            onPress={()=>this.delUserMsg(obj)}
        >
            <View style={styles.flat_hiden} >
                <Image source={require('./img/del.png')} />
            </View>
        </TouchableHighlight>
        )
    }

    render() {
        return (
        <>
            <View style={styles.container}>
                <Text>
                    <SectionList
                        width={120}
                        height={20}
                        renderSectionHeader={this.renderSectionHeader}
                        sections={this.section}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </Text>
                <SafeAreaView style={styles.flat_container}>
                    <SwipeListView
                        useFlatList
                        data={this.data_flatlist()}
                        renderItem  ={ ({item}) => this.RenderItem(item) }
                        keyExtractor={ item => item.password}
                        renderHiddenItem = { ({item}) => this.RenderHiddenItem(item) }
                        // leftOpenValue - При свайпе влево указывает на какое число нужно сместить элемент списка чтобы отобразить скрытые контролы из renderHiddenItem
                        // Если нужен свайп вправо - rightOpenValue={-75}
                        leftOpenValue={styles.flat_hiden.height + styles.flat_hiden.marginHorizontal*2}
                    />
                </SafeAreaView>
                <Text style={styles.text_info} >Виберіть збережий аккаунт {"\n"} або введіть новий</Text>
                <TextInput
                    value={this.state.username}
                    onChangeText={(username) => this.setState({ username })}
                    placeholder={'Ім\'я користувача'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Пароль користувача'}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <View style={styles.flat_loginBtn}>
                    <Button
                        title={'Вхід'}
                        color="#6339e0"
                        onPress={this.onLogin.bind(this)}
                    />
                </View>
            </View>
        </>
        )
    };
};

const AppNavigator = createStackNavigator({
      Reg: RegScreen,
      Cabinet: CabinetScreen,
//      EditCredentials: EditCredentialsScreen,
    },
    { initialRouteName: 'Reg', })

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
    render() {
        return <AppContainer />;
    }
}
