import React, { Component } from 'react';
import {Alert, Button, TextInput, Text, View, SectionList} from 'react-native';
import styles from './CabinetStyle';

/* Экран кабинета пользователя */
class CabinetScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',            // і'мя користувача, отримане з екрану реєстрації
            password: '',        // пароль користувача, отриманий з екрану реєстрації
            current_value: null, // поточні показання отримані з сайту
            lich0: null,         // номер лічильника отриманий з сайту
            v_old0: null,        // попередні показання отримані з сайту
            xhr: null,           // об'єкт XMLHttpRequest
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        let user = navigation.getParam('user');
        let pass = navigation.getParam('pass');
        let xhr_responseText = navigation.getParam('xhr_responseText');
        let v_old0 = xhr_responseText.match(/v_old0 value=[\.\d]{1,}/)[0].split('=')[1]; //попередні показання
        let lich0 = xhr_responseText.match(/lich0 value\=\"\d{1,}/)[0].split('="')[1];  //номер лічильника
        let value0 = xhr_responseText.match(/value0 value\=[\.\d]{1,}/)[0].split('=')[1];
        this.setState({ user: user, password: pass, current_value: value0, lich0: lich0, v_old0: v_old0, xhr_responseText: xhr_responseText });
    }

    static navigationOptions = { title: 'Кабінет користувача', headerStyle: styles.CabinetScreen, headerTitleStyle: styles.CabinetScreenTitle,};

    SendValue(){
        let URL = 'http://vodokanal.sumy.ua/sendform/processor.php';
        var formdata = new FormData();
        formdata.append("ls", this.state.user);
        formdata.append("lich0", this.state.lich0);
        formdata.append("value0", this.state.current_value);
        formdata.append("v_old0", this.state.v_old0);
        formdata.append("num", 1);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", URL, true);
        xhr.send(formdata);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4){ return; }
            let status = xhr.status;
            switch(status){
                case 0,200:  // Если ответ сервера 200 (ошибок нет)
                    if (xhr.responseText == "Показання були відправлені."){
                        Alert.alert("Показання були відправлені.")
                    }
                    else {Alert.alert("Сталася помилка:\n"+xhr.responseText)}
                    break;
                case 404: //Если ответ сервера "Сайт не найден"
                    Alert.alert("Сталася помилка", "Сайт не знайдений");
                    break;
                default:
                    Alert.alert("Сталася помилка", status.toString());
                    break;
            }
        };
    }

    render(){
        return (
            <View style={styles.CabinetScreenContent}>
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
                <View style={styles.ViewTextLbl}>
                    <Text style={styles.text_info1}>№ Лічильника:</Text>
                    <Text style={styles.text_info2}> {this.state.lich0}</Text>
                </View>
                <View style={styles.ViewTextLbl}>
                    <Text style={styles.text_info1}>Попередні показання:</Text>
                    <Text style={styles.text_info2}> {this.state.v_old0}</Text>
                </View>
                <Text style={styles.TextCurrentInfo}>Якщо Ви вносили поточні показання, в текстовому полі нижче вони будуть вказані</Text>
                <TextInput
                    value={this.state.current_value}
                    onChangeText={(current_value) => this.setState({ current_value })}
                    placeholder={'Поточні показання'}
                    style={styles.input}
                />
                <View style={styles.sendBtn}>
                    <Button
                        title={'Внести показання'}
                        color="#6339e0"
                        onPress={()=>this.SendValue()}
                    />
                </View>
            </View>
        )
    }
}

export default CabinetScreen;
