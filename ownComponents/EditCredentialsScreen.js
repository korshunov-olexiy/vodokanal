import React, { Component } from 'react';
import {Button, TextInput, View} from 'react-native';
import styles from './EditCredentialsStyle';

/* Экран для редактирования учетных данных существующего в БД пользователя */
class EditCredentialsScreen extends Component {
    static navigationOptions = {title: 'Редагування облікових даних', headerStyle: styles.EditCredentialsScreen, headerTitleStyle: styles.EditCredentialsTitle}
    render() {
        const { navigation } = this.props;
        let user = navigation.getParam('user');
        let pass = navigation.getParam('pass');
        return (
            <View style={styles.EditCredentialsScreenContent}>
                <TextInput
                    value={user}
                    placeholder={'Ім\'я користувача'}
                    style={styles.input}
                />
                <TextInput
                    value={pass}
                    placeholder={'Пароль користувача'}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <View style={styles.flat_loginBtn}>
                    <Button
                        title={'Вхід'}
                        color="#6339e0"
                        onPress={()=>console.log('press')}
                    />
                </View>
            </View>
        )
    }
}

export default EditCredentialsScreen;
