import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Input, Button} from 'react-native-elements';

import { HeaderBackButton } from 'react-navigation';
import { AndroidBackHandler } from '../components/AndroidBackHandler';

import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';

import env from 'react-native-config';

class AddNewPatient extends Component {



static navigationOptions = ({ navigation }) => ({headerRight: <View style={{paddingRight: 10, flexDirection: 'row'}}>

    <Button
        icon={{
            name: 'save',
            type: 'material',
            color: '#0eb1d2'
        }}
        onPress={navigation.getParam('save')}
        title="Zapisz"
        buttonStyle={{marginHorizontal: 5, backgroundColor: '#FFFFFF', borderRadius: 4}}
        titleStyle={{ color: '#0eb1d2', fontFamily: 'Montserrat-Medium' }}/>
 </View>,
headerLeft: <HeaderBackButton tintColor='#FFFFFF' onPress={
    navigation.getParam('backPress')
}/>

});



     componentDidMount() {
        this.props.navigation.setParams({ save: this.saveData, backPress: this.onBackPress  });
      }


    onBackPress= () => {
        const { goBack } = this.props.navigation;
        if(this.state.anyInputChanged){


        Alert.alert('Masz niezapisane zmiany. Na pewno chcesz wyjść?', '', [
            { text: 'OK', onPress: () => {
                goBack(null)
        }},
            { text: 'Anuluj', onPress: () => {}}
        ]);


            return true;
        }
        else{
            goBack(null);
            return true;
        };

    };



    saveData = async () => {
        if( !this.state.firstNameInputValue || !this.state.lastNameInputValue || !this.state.peselInputValue ||
            !this.state.phoneNumberInputValue ||
            !this.state.homeAddressInputValue || !this.state.cityInputValue || !this.state.postalCodeInputValue )
            {
                ToastAndroid.show('Wypełnij wymagane pola', ToastAndroid.SHORT);
        }
        else{

            try{
                let response = await fetch(
                    'https://' + env.SERVER_ADDRESS + '/patients/createPatient', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                          },
                        body: JSON.stringify({
                            userID: await AsyncStorage.getItem('userID'),
                            sessionID: await AsyncStorage.getItem('sessionID'),

                            firstName: this.state.firstNameInputValue,
                            lastName: this.state.lastNameInputValue,

                            pesel: this.state.peselInputValue,

                            phoneNumber: this.state.phoneNumberInputValue,
                            email: this.state.emailInputValue,

                            homeAddress: this.state.homeAddressInputValue,
                            city: this.state.cityInputValue,
                            postalCode: this.state.postalCodeInputValue
                      })
                  }
                );

                if(response.status == 200){
                    this.setState({anyInputChanged: false});
                    this.props.navigation.goBack(null);
                    ToastAndroid.show('Pacjent dodany', ToastAndroid.SHORT);
                }else{
                    ToastAndroid.show('Wystąpił błąd - nie udało się dodać pacjenta', ToastAndroid.SHORT);
                }
                return;

                }catch (error) {
                    Alert.alert(error.toString());
                    return;
                };
        }

    };


constructor(){
    super();

    this.state = {

        anyInputChanged: false,

        firstNameInputValue: '',
        lastNameInputValue: '',
        peselInputValue: '',

        phoneNumberInputValue: '',
        emailInputValue: '',

        homeAddressInputValue: '',
        cityInputValue: '',
        postalCodeInputValue: '',


        PatientData: {
            ID: '123',
            FirstName: 'Jan',
            LastName: 'Kowalski'
        }

    }


  }



  render() {
    const { navigate } = this.props.navigation;
    return (

                    <AndroidBackHandler onBackPress={this.onBackPress}>
                    <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#E8E8E8', flexGrow: 1}}>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 22, textAlign: 'center'}}>Wypełnij pola</Text>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Dane osobowe</Text>
                        <Input label='Imię:' labelStyle={{color: '#1cb5e0'}}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue=''
                            value={this.state.firstNameInputValue}
                            onChangeText={ (text) => { this.setState({ firstNameInputValue: text, anyInputChanged: true})}}

                            />
                        <Input label='Nazwisko:' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue=''
                            value={this.state.lastNameInputValue}
                            onChangeText={ (text) => { this.setState({ lastNameInputValue: text, anyInputChanged: true})}}
                            />
                        <Input label='PESEL:' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0'}}
                            defaultValue='' keyboardType={'numeric'}
                            value={this.state.peselInputValue}
                            onChangeText={ (text) => { this.setState({ peselInputValue: text, anyInputChanged: true})}}
                            />
                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Dane kontaktowe</Text>
                        <Input label='Numer telefonu:' labelStyle={{color:'#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue='' keyboardType={'phone-pad'}
                            value={this.state.phoneNumberInputValue}
                            onChangeText={ (text) => { this.setState({ phoneNumberInputValue: text, anyInputChanged: true})}}
                            />
                        <Input label='E-mail (opcjonalne)' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue='' keyboardType={'email-address'}
                            value={this.state.emailInputValue}
                            onChangeText={ (text) => { this.setState({ emailInputValue: text, anyInputChanged: true})}}
                            />



                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Dane adresowe</Text>
                        <Input label='Adres zamieszkania' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue=''
                            value={this.state.homeAddressInputValue}
                            onChangeText={ (text) => { this.setState({ homeAddressInputValue: text, anyInputChanged: true})}}
                            />
                        <Input label='Miasto' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue=''
                            value={this.state.cityInputValue}
                            onChangeText={ (text) => { this.setState({ cityInputValue: text, anyInputChanged: true})}}
                            />
                        <Input label='Kod pocztowy' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue='' keyboardType={'phone-pad'}
                            value={this.state.postalCodeInputValue}
                            onChangeText={ (text) => { this.setState({ postalCodeInputValue: text, anyInputChanged: true})}}
                            />
                    </View>


                    </ScrollView>
                    </AndroidBackHandler>

    );
  }
}


function mapStateToProps(state){
    return {
    }
}

function mapDispatchToProps(dispatch){
    return {
    }
}


export default connect (mapStateToProps, mapDispatchToProps)(AddNewPatient);

const styles = StyleSheet.create({
dataContainer: {

    width: '85%',
    paddingVertical: 10,
    marginVertical: 10,
    elevation: 7,
    backgroundColor: '#FFFFFF'

    },

    button: {
        backgroundColor: '#1cb5e0',
        borderRadius: 4,
        height: 40,
        marginTop: 10

    }




});