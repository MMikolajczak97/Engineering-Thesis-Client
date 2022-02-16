import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, ToastAndroid } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';

import Voice from 'react-native-voice';
import Modal from 'react-native-modal';

import { AndroidBackHandler } from '../components/AndroidBackHandler';
import { HeaderBackButton } from 'react-navigation';
import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';

class Visit extends Component {


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




    async componentDidMount() {
        await this.props.navigation.setParams({ save: this.saveData, backPress: this.onBackPress, editable: this.changeTextInputEnabled });
    }

    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
    }


    onBackPress = () => {
        const { goBack } = this.props.navigation;
        if(this.state.anyInputChanged){

        Alert.alert('Masz niezapisane zmiany. Na pewno chcesz wyjść?', '',
        [
            { text: 'OK', onPress: () => {
                goBack(null);
                if(this.state.TextInputEnabled){
                    this.changeTextInputEnabled();
                };
            }},
            { text: 'Anuluj', onPress: () => {}}
        ]);
            return true;
        }
        else {
            goBack(null);
            if(this.state.TextInputEnabled){
                this.changeTextInputEnabled();
            };
            return true;
        };

    };



    changeTextInputEnabled = () => { this.setState({ TextInputEnabled: !this.state.TextInputEnabled});};



    saveData = async () => {
        try{
            if(!this.state.anyInputChanged){
                return;
            };
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/patients/changePatientVisitData', {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),

                        patientID: this.props.currentPatientDataJSON._id,
                        visitID: this.props.currentVisitDataJSON._id,


                        conclusion: this.props.currentVisitDataJSON.conclusion,
                        symptoms: this.props.currentVisitDataJSON.symptoms,
                        diagnosis: this.props.currentVisitDataJSON.diagnosis,
                        prescriptions: this.props.currentVisitDataJSON.prescriptions,
                        preparationForNextVisit: this.props.currentVisitDataJSON.preparationForNextVisit
                  })
              }
            );

            if(response.status == 200){
                this.setState({anyInputChanged: false});

                ToastAndroid.show('Zapisano zmiany', ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('Wystąpił błąd - nie udało się zapisać zmian', ToastAndroid.SHORT);
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
        hitMicButton: '',
        TextInputEnabled: false,
        anyInputChanged: false,
        VisitData: {
            date: '',
            conclusion: '',
            symptoms: '',
            diagnosis: '',
            prescriptions: '',
            preparationForNextVisit: ''
        }

    }

    Voice.onSpeechResults = this.onSpeechResults.bind(this);


  }


  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };



  onSpeechResults(e){

    let result = '';
    if(this.state.hitMicButton == 'conclusion'){
        result = this.props.currentVisitDataJSON.conclusion + ' ' + e.value[0].toString();
        this.props.changeVisitDataJSONProperty('conclusion', result);
    }

     if(this.state.hitMicButton == 'symptoms'){
        result = this.props.currentVisitDataJSON.symptoms + ' ' + e.value[0].toString();
        this.props.changeVisitDataJSONProperty('symptoms', result);
    }

    if(this.state.hitMicButton == 'diagnosis'){
        result = this.props.currentVisitDataJSON.diagnosis + ' ' + e.value[0].toString();
        this.props.changeVisitDataJSONProperty('diagnosis', result);
    }

    if(this.state.hitMicButton == 'prescriptions'){
        result = this.props.currentVisitDataJSON.prescriptions + ' ' + e.value[0].toString();
        this.props.changeVisitDataJSONProperty('prescriptions', result);
    }

    if(this.state.hitMicButton == 'preparation'){
        result = this.props.currentVisitDataJSON.preparationForNextVisit + ' ' + e.value[0].toString();
        this.props.changeVisitDataJSONProperty('preparationForNextVisit', result);
    }

    if(!this.state.anyInputChanged)
    {
        this.setState({ anyInputChanged: true })
    }

  }



startSpeech = async (e) =>{
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



  render() {
    const { navigate } = this.props.navigation;
    return (
                    <AndroidBackHandler onBackPress={this.onBackPress}>

                        <Modal isVisible={this.state.isModalVisible}>
                            <View style={{ justifyContent: 'center', backgroundColor: '#FFFFFF', height: '30%', width: '100%'}}>
                                <Text style={{fontFamily: 'Montserrat-Medium', alignSelf: 'center', marginBottom: 10, fontSize: 18}}>Możesz mówić!</Text>
                                <Button title="Zakończ i dodaj"
                                        onPress={ () => { this.endSpeech();}}
                                        buttonStyle={{backgroundColor: '#0eb1d2', borderRadius: 4}}
                                        titleStyle={{ color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: 18 }}/>
                            </View>
                        </Modal>


                    <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#E8E8E8', flexGrow: 1}}>
                    <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 22, textAlign: 'center'}}>Wizyta {this.props.currentVisitDataJSON.date}</Text>


                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Wnioski</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                        onPress={ () => { this.setState({hitMicButton: 'conclusion' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentVisitDataJSON.conclusion}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.state.anyInputChanged){
                                    this.setState({ anyInputChanged: true });
                                }
                                this.props.changeVisitDataJSONProperty('conclusion', text)

                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Objawy</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                            onPress={ () => { this.setState({hitMicButton: 'symptoms' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentVisitDataJSON.symptoms}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.state.anyInputChanged){
                                    this.setState({ anyInputChanged: true });
                                }
                                this.props.changeVisitDataJSONProperty('symptoms', text)

                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Diagnoza</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                        onPress={ () => { this.setState({hitMicButton: 'diagnosis' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentVisitDataJSON.diagnosis}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.state.anyInputChanged){
                                    this.setState({ anyInputChanged: true });
                                }
                                this.props.changeVisitDataJSONProperty('diagnosis', text)

                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Zalecone leki/zabiegi</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                            onPress={ () => { this.setState({hitMicButton: 'prescriptions' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentVisitDataJSON.prescriptions}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.state.anyInputChanged){
                                    this.setState({ anyInputChanged: true });
                                }
                                this.props.changeVisitDataJSONProperty('prescriptions', text)

                            }}
                            />

                    </View>

                    <View style={styles.dataContainer}>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, alignSelf: 'center', marginBottom: 10}}>Zalecenia na następną wizytę</Text>
                        <Icon name='mic' type='material' size={50} color='#1cb5e0'
                        onPress={ () => { this.setState({hitMicButton: 'preparation' }, this.startSpeech) }}
                        />

                        <Input
                            inputContainerStyle={{borderWidth: 1, borderColor: this.state.TextInputEnabled ? '#1cb5e0' : '#7e7e7e'}}
                            defaultValue=''
                            value={this.props.currentVisitDataJSON.preparationForNextVisit}
                            editable={this.state.TextInputEnabled}
                            multiline={true}
                            onChangeText={ (text) => {
                                if(!this.state.anyInputChanged){
                                    this.setState({ anyInputChanged: true });
                                }
                                this.props.changeVisitDataJSONProperty('preparationForNextVisit', text)

                            }}
                            />

                    </View>



                    </ScrollView>
                    </AndroidBackHandler>
    );
  }
}

function mapStateToProps(state){
    return {
        currentVisitDataJSON: state.VisitDataJSON,
        currentPatientDataJSON: state.PatientDataJSON
    }
}

function mapDispatchToProps(dispatch){
    return {
        changeVisitDataJSON: (value) => dispatch({ type: 'CHANGE_VISIT_DATA_JSON', payload: value}),
        changeVisitDataJSONProperty: (key, value) => dispatch({ type: 'CHANGE_VISIT_DATA_JSON_PROPERTY', key: key, payload: value})
    }
}


export default connect (mapStateToProps, mapDispatchToProps)(Visit);

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