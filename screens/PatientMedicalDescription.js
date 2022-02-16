import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, ToastAndroid } from 'react-native';
import { Input, Button, Icon} from 'react-native-elements';

import Voice from 'react-native-voice';

import Modal from 'react-native-modal';

import { HeaderBackButton } from 'react-navigation';

import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';


class PatientMedicalDescription extends Component {


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
        buttonStyle={{marginHorizontal: 5, backgroundColor: '#FFFFFF', borderRadius: 4}}
        titleStyle={{ color: '#0eb1d2', fontFamily: 'Montserrat-Medium' }}/>
 </View>,
  headerLeft: <HeaderBackButton tintColor='#FFFFFF' onPress={
    navigation.getParam('backPress')
}/>
});




    componentDidMount() {
        this.props.navigation.setParams({ editable: this.changeTextInputEnabled, backPress: this._onBackPress });
        this.props.navigation.setParams({ save: this.saveData });
      }

      componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
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

        isModalVisible: false,
        TextInputEnabled: false,
        hitMicButton: '',
        PatientData: {
            ID: '123',
            FirstName: 'Jan',
            LastName: 'Kowalski'
        },

        description: '',
        diseases: '',
        allergies: '',
        drugs: ''

    }

    Voice.onSpeechResults = this.onSpeechResults.bind(this);

    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };



    startSpeech = async () => {
        try{
            await Voice.start('pl_PL', {
                "RECOGNIZER_ENGINE": "GOOGLE",
                 "EXTRA_PARTIAL_RESULTS": true,
                 "EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGHT_MILLIS" : '3000'
              });
            this.toggleModal();
        } catch (e) {
            Alert.alert(e.toString());
        }
    };

    endSpeech = () => {
        Voice.stop();
        this.toggleModal();
    };

    onSpeechResults(e){
        let result = '';

        if(this.state.hitMicButton == 'description'){
            result = this.props.currentPatientDataJSON.description + ' ' + e.value[0].toString();
            this.props.changePatientDataJSONProperty('description', result);
        }

        if(this.state.hitMicButton == 'diseases'){
            result = this.props.currentPatientDataJSON.diseases + ' ' + e.value[0].toString();
            this.props.changePatientDataJSONProperty('diseases', result);
        }

        if(this.state.hitMicButton == 'allergies'){
            result = this.props.currentPatientDataJSON.allergies + ' ' + e.value[0].toString();
            this.props.changePatientDataJSONProperty('allergies', result);
        }

        if(this.state.hitMicButton == 'drugs'){
            result = this.props.currentPatientDataJSON.drugs + ' ' + e.value[0].toString();
            this.props.changePatientDataJSONProperty('drugs', result);
        }

        if(!this.props.anyTabInputChanged)
        {
            this.props.changeValue();
        }
    }





_onBackPress = () => {
    const { goBack } = this.props.navigation;
    goBack(null);

};


  render() {
    const { navigate } = this.props.navigation;
    return (



                <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#E8E8E8', flexGrow: 1}}>
                    <Modal isVisible={this.state.isModalVisible}>
                        <View style={{ justifyContent: 'center', backgroundColor: '#FFFFFF', height: '30%', width: '100%'}}>
                            <Text style={{fontFamily: 'Montserrat-Medium', alignSelf: 'center', marginBottom: 10, fontSize: 18}}>Możesz mówić!</Text>
                            <Button title="Zakończ i dodaj"
                                    onPress={ () => { this.endSpeech() }}
                                    buttonStyle={{backgroundColor: '#0eb1d2', borderRadius: 4}}
                                    titleStyle={{ color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: 18 }}/>
                        </View>
                    </Modal>

                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 22, textAlign: 'center'}}>Opis pacjenta</Text>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Opis ogólny</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                            onPress={ () => { this.setState({ hitMicButton: 'description' }, this.startSpeech)}}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentPatientDataJSON.description}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, city: text}});
                                this.props.changePatientDataJSONProperty('description', text);
                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Choroby</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                        onPress={ () => { this.setState({ hitMicButton: 'diseases' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentPatientDataJSON.diseases}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, city: text}});
                                this.props.changePatientDataJSONProperty('diseases', text);
                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Uczulenia</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                        onPress={ () => { this.setState({ hitMicButton: 'allergies' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentPatientDataJSON.allergies}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, city: text}});
                                this.props.changePatientDataJSONProperty('allergies', text);
                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Stałe leki</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                        onPress={ () => { this.setState({ hitMicButton: 'drugs' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            value={this.props.currentPatientDataJSON.drugs}
                            defaultValue='Brak' editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.props.anyTabInputChanged){
                                    this.props.changeValue();
                                };
                                this.setState({PatientData: {...this.state.PatientData, city: text}});
                                this.props.changePatientDataJSONProperty('drugs', text);
                            }}
                            />

                    </View>
                    </ScrollView>


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


export default connect (mapStateToProps, mapDispatchToProps)(PatientMedicalDescription);


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