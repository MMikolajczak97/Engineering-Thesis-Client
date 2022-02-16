import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Input, Button} from 'react-native-elements';
import { AndroidBackHandler } from '../components/AndroidBackHandler';
import { HeaderBackButton } from 'react-navigation';

import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';



class PatientProfile extends Component {



static navigationOptions = ({ navigation }) => ({headerRight: <View style={{paddingRight: 10, flexDirection: 'row'}}>
    <Button
        icon={{
            name: 'edit',
            type: 'material',
            color: '#0eb1d2'
        }}
        onPress={navigation.getParam('editable')}
        title="Edytuj"
        buttonStyle={{marginHorizontal: 5, backgroundColor: '#FFFFFF', borderRadius: 4}}
        titleStyle={{ color: '#0eb1d2', fontFamily: 'Montserrat-Medium' }}/>

    <Button
        icon={{
            name: 'save',
            type: 'material',
            color: '#0eb1d2'
        }}
        onPress={navigation.getParam('save')}
        title="Zapisz"
        buttonStyle={{ marginHorizontal: 5, backgroundColor: '#FFFFFF', borderRadius: 4 }}
        titleStyle={{ color: '#0eb1d2', fontFamily: 'Montserrat-Medium' }}/>
 </View>,
headerLeft: <HeaderBackButton tintColor='#FFFFFF' onPress={
    navigation.getParam('backPress')
}/>
});


    _onBackPress = () => {
    const { goBack } = this.props.navigation;

    if(this.props.anyTabInputChanged){

    Alert.alert('Masz niezapisane zmiany. Na pewno chcesz wyjść?', '', [
        { text: 'OK', onPress: () => {
            goBack(null);
            this.props.changeValue();
    }},
        { text: 'Anuluj', onPress: () => {}}
    ]);
        return true;
    }
    else {
        goBack(null);
        return true;
    };

};





    componentDidMount() {
        this.props.navigation.setParams({ editable: this.changeTextInputEnabled });
        this.props.navigation.setParams({ save: this.saveData, backPress: this._onBackPress });
      }


    changeTextInputEnabled = () => { this.setState({ TextInputEnabled: !this.state.TextInputEnabled});};



    saveData = async () => {
        if(!this.props.currentPatientDataJSON.firstName || !this.props.currentPatientDataJSON.lastName || !this.props.currentPatientDataJSON.pesel ||
            !this.props.currentPatientDataJSON.phoneNumber ||
            !this.props.currentPatientDataJSON.homeAddress || !this.props.currentPatientDataJSON.city || !this.props.currentPatientDataJSON.postalCode)
            {
                ToastAndroid.show('Dane osobowe nie mogą być puste', ToastAndroid.SHORT);
                return;
            }
        try{
            const { _id, ...JSONtoSend } = this.props.currentPatientDataJSON;

            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/patients/changePatientData', {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),
                        patientID: this.props.currentPatientDataJSON._id,

                        ...JSONtoSend
                    })
                }
            );

            if(response.status == 200){
                if(this.props.anyTabInputChanged){
                    this.props.changeValue();
                };
                ToastAndroid.show("Zapisano zmiany", ToastAndroid.SHORT)
            }else{
                ToastAndroid.show('Nie udało się zapisać zmian', ToastAndroid.SHORT);
            }
            return;

            }catch (error) {
                Alert.alert(error.toString());
                return;
            };
    };


constructor(){
    super();

    this.state = {

        TextInputEnabled: false,
        PatientData: {
            firstName: 'Jan',
            lastName: 'Kowalski',
            pesel: '',
            phoneNumber: '',
            email: '',
            homeAddress: '',
            city: '',
            postalCode: ''
        }
    }
  }


  render() {
    const { navigate } = this.props.navigation;
    return (

                    <AndroidBackHandler onBackPress={this._onBackPress}>
                    <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#E8E8E8', flexGrow: 1}}>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 22, textAlign: 'center'}}>Pacjent ID: {this.props.currentPatientDataJSON._id}</Text>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Dane osobowe</Text>
                        <Input label='Imię:' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.firstName} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, firstName: text}});
                                this.props.changePatientDataJSONProperty('firstName', text);
                            }}
                            />
                        <Input label='Nazwisko:' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.lastName} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, lastName: text}});
                                this.props.changePatientDataJSONProperty('lastName', text);
                            }}/>
                        <Input label='PESEL:' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.pesel} keyboardType={'numeric'} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, pesel: text}});
                              this.props.changePatientDataJSONProperty('pesel', text);
                            }}/>
                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Dane kontaktowe</Text>
                        <Input label='Numer telefonu:' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.phoneNumber} keyboardType={'phone-pad'} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, phoneNumber: text}});
                                this.props.changePatientDataJSONProperty('phoneNumber', text);
                            }}/>
                        <Input label='E-mail' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.email} keyboardType={'email-address'} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, email: text}});
                                this.props.changePatientDataJSONProperty('email', text);
                            }}/>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap'}}>
                            <Button icon={{
                                name: 'phone',
                                type: 'material',
                                color: '#FFFFFF'
                            }}
                            title='Zadzwoń'
                            buttonStyle={styles.button}
                            titleStyle={{fontFamily: 'Montserrat-Medium' }}
                            onPress={ () => Linking.openURL(`tel:${this.props.currentPatientDataJSON.phoneNumber}`)}

                            />

                            <Button icon={{
                                name: 'sms',
                                type: 'material',
                                color: '#FFFFFF'
                            }}
                            title='Wyślij SMS'
                            buttonStyle={styles.button}
                            titleStyle={{fontFamily: 'Montserrat-Medium' }}
                            onPress={ () => Linking.openURL(`sms:${this.props.currentPatientDataJSON.phoneNumber}`)}

                            />


                            <Button icon={{
                                name: 'email',
                                type: 'material',
                                color: '#FFFFFF'
                            }}
                            title='Wyślij e-mail'
                            buttonStyle={styles.button}
                            titleStyle={{fontFamily: 'Montserrat-Medium' }}
                            onPress={ () => Linking.openURL(`mailto:${this.props.currentPatientDataJSON.email}`)}

                            />


                        </View>

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Dane adresowe</Text>
                        <Input label='Adres zamieszkania' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.homeAddress} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, homeAddress: text}});
                                this.props.changePatientDataJSONProperty('homeAddress', text);
                            }}/>
                        <Input label='Miasto' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.city} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, city: text}});
                                this.props.changePatientDataJSONProperty('city', text);
                            }}/>
                        <Input label='Kod pocztowy' labelStyle={{color: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            inputContainerStyle={{borderBottomColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue='' value={this.props.currentPatientDataJSON.postalCode} keyboardType={'phone-pad'} editable={this.state.TextInputEnabled}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, postalCode: text}});
                                this.props.changePatientDataJSONProperty('postalCode', text);
                            }}/>
                    </View>


                    </ScrollView>
                    </AndroidBackHandler>
    );
  }
}

function mapStateToProps(state){
    return {
        anyTabInputChanged: state.anyTabInputChanged,

        currentPatientDataJSON: state.PatientDataJSON

    }
}



function mapDispatchToProps(dispatch){
    return {
        changeValue: () => dispatch({ type: 'CHANGE_TAB_INPUT_STATE_VALUE' }),

        changePatientDataJSON: (value) => dispatch({ type: 'CHANGE_PATIENT_DATA_JSON', payload: value}),

        changePatientDataJSONProperty: (key, value) => dispatch({ type: 'CHANGE_PATIENT_DATA_JSON_PROPERTY', key: key, payload: value}),

    }
}


export default connect (mapStateToProps, mapDispatchToProps)(PatientProfile);







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