import React, {Component} from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, ToastAndroid, Alert} from 'react-native';
import { DismissKeyboard } from '../components/DismissKeyboard';
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';


class Login extends Component {

    login = async (email, password) => {
        try {

            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/user/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userEmail: email,
                        userPassword: password
                  })
              }
            );
            return response;
          } catch (error) {
            Alert.alert(error.toString());
          };
    };

    loginButtonHandler = async () => {
        let response = await this.login(this.state.loginInputValue, this.state.passwordInputValue);

        const responseJSON = await response.json();


        try{
            if(typeof responseJSON.sessionID == "string" && response.status == 200){
                await AsyncStorage.setItem('sessionID', responseJSON.sessionID);
                await AsyncStorage.setItem('userID', responseJSON.userID);
                await this.props.changeUserDataJSON({
                    ID: responseJSON.userID,
                    FirstName: responseJSON.firstName,
                    LastName: responseJSON.lastName,
                    Email: responseJSON.email
                });

                await this.props.navigation.navigate("HomeScreen");
            }
            else{
                ToastAndroid.show('Błąd logowania', ToastAndroid.LONG);
            }
        }catch(err){
            ToastAndroid.show('Błąd logowania', ToastAndroid.LONG);
        }
    };


    constructor(){
        super();

        this.state = {
            loginInputValue: '',
            passwordInputValue: ''
        };
    }


    render() {
        const { navigate } = this.props.navigation;
    return (

    <DismissKeyboard>

        <LinearGradient colors={['#1cb5e0', '#3d95a7', '#3c6f79', '#375155']} style={styles.container} locations={[0.25, 0.50, 0.75, 1]}>

        <Image source={require('../icons/logo.png')} style={{width: 170, height:170}}/>
        <Text style={{fontSize: 40, color: '#FFFFFF'}}>Intermed</Text>
        <View style={styles.innerContainer}>

            <View style={styles.inputContainer}>
                <TextInput placeholder='Login' value={this.state.loginInputValue} onChangeText={(text) => {this.setState( { loginInputValue: text })}} style={styles.inputStyle} placeholderTextColor='#FFFFFF' autoCapitalize='none' autoCorrect={false} autoCompleteType='off'></TextInput>
                <TextInput placeholder='Hasło' value={this.state.passwordInputValue} onChangeText={(text) => {this.setState( { passwordInputValue: text })}} secureTextEntry={true} style={styles.inputStyle} placeholderTextColor='#FFFFFF' autoCorrect={false} autoCompleteType='off'></TextInput>
            </View>

            <View style={styles.upperClickableContainer}>

                <TouchableOpacity style={styles.loginButton} onPress={this.loginButtonHandler}>
                    <Text style={styles.loginButtonText}>Zaloguj</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.lowerClickableContainer}>
                <Text style={{fontSize: 14, color: '#FFFFFF', fontFamily: 'Montserrat-Medium'}}>Nie pamiętasz hasła?</Text>

                <Text style={{fontSize: 14, color: '#FFFFFF', fontFamily: 'Montserrat-Medium'}}>Zarejestruj się</Text>
            </View>


          </View>

        </LinearGradient>

    </DismissKeyboard>
    );
  }
}


function mapStateToProps(state){
    return {
        currentUserDataJSON: state.UserDataJSON,
    }
}


function mapDispatchToProps(dispatch){
    return {
        changeUserDataJSON: (value) => dispatch({ type: 'CHANGE_USER_DATA_JSON', payload: value}),
        changeUserDataJSONProperty: (key, value) => dispatch({ type: 'CHANGE_USER_DATA_JSON_PROPERTY', key: key, payload: value}),
    }
}


export default connect (mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Dimensions.get('window').height * 0.1,
    height: Dimensions.get('window').height

  },
  innerContainer: {
    width: '85%',
    height: Dimensions.get('window').height * 0.3,
    alignItems: 'center'


  },
  inputContainer:{
    paddingTop: 20,
    height: '60%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle:{
    margin: 15,
    height: 40,
    width: '85%',
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
    fontFamily: 'Montserrat-Medium'
  },

  upperClickableContainer:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '85%',
    marginVertical: 20
  },
  lowerClickableContainer:{
   flex: 1,
   flexDirection: 'row',
   alignItems: 'center',
   width: '85%',
   justifyContent: 'space-between',
   marginTop: 70
  },

  loginButton:{
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  loginButtonText:{
    color: '#0eb1d2',
    fontFamily: 'Montserrat-Medium'
  }
});
