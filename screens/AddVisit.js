import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';

import { HeaderBackButton} from 'react-navigation';

import { AndroidBackHandler } from '../components/AndroidBackHandler';


import Accordion from 'react-native-collapsible/Accordion';

import RNDateTimePicker from '@react-native-community/datetimepicker';

import AsyncStorage from '@react-native-community/async-storage';

import moment from 'moment';

import env from 'react-native-config';


const SECTIONS = [
    {
      title: 'Pacjenci',
      content: '',
    },

  ];


export default class AddVisit extends Component {

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


constructor(){
    super();


    this.state = {
        anyInputChanged: false,
        isDatePickerVisible: false,
        isTimePickerVisible: false,
        collapsed: true,
        activeSections: [],
        patientInputValue: '',
        dateInputValue: '',
        hourInputValue: '',
        choosenPatientID: '',
        patients: [],

    };



    }

    getAllPatients = async () => {
        try {
        let response = await fetch(
          'https://' + env.SERVER_ADDRESS + '/patients/getAllPatients', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    userID: await AsyncStorage.getItem('userID'),
                    sessionID: await AsyncStorage.getItem('sessionID')
              })
          }
        );

        const responseJSON = await response.json();

        if(response.status == 200){
            this.setState({ patients: responseJSON });
        }
        else{
            ToastAndroid.show('Wystąpił błąd - nie udało się pobrać listy pacjentów', ToastAndroid.SHORT);
        }

        return response;
      } catch (error) {
        Alert.alert(error.toString());
      };
};







    async componentDidMount(){
        await this.props.navigation.setParams({ save: this.saveData, backPress: this.onBackPress });
        await this.getAllPatients();

  };


  saveData = async () => {
    if(!this.state.patientInputValue || !this.state.dateInputValue || !this.state.hourInputValue || !this.state.choosenPatientID){
        ToastAndroid.show( 'Wypełnij wszystkie pola', ToastAndroid.SHORT);
    }
    else{

        try{
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/user/addPlannedVisit', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),

                        patientID: this.state.choosenPatientID,

                        date: this.state.dateInputValue,
                        hour: this.state.hourInputValue


                  })
              }
            );


            if(response.status == 200){
                this.setState({anyInputChanged: false});
                this.props.navigation.goBack(null);
                ToastAndroid.show('Planowana wizyta dodana', ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('Wystąpił błąd - nie udało się dodać planowanej wizyty', ToastAndroid.SHORT);
            }
            return;
            }catch (error) {
            Alert.alert(error.toString());
            return;
        }
    }
};






  _renderHeader = section => {
    return (

      <View>

      </View>
    );
  };

  _renderContent = section => {
    return (
        <View>
        <FlatList
            data={this.state.patients}
            renderItem={({ item }) =>

            <TouchableOpacity>
                <ListItem bottomDivider
                title={`${item.firstName} ${item.lastName}`}
                subtitle={ 'PESEL: ' + item.pesel}
                titleStyle={{ fontFamily: 'Montserrat-Medium' }} subtitleStyle={{ fontFamily: 'Montserrat-Medium' }}
                onPress={ () => this.setState({ patientInputValue: `${item.firstName} ${item.lastName}` + ' (' + `${item.pesel}` + ')',
                choosenPatientID: item._id,
                collapsed: !this.state.collapsed,
                anyInputChanged: true
                })}/>
            </TouchableOpacity>}

            keyExtractor={item => item._id}/>
    </View>

    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  datePickerOnChange = (event, date) => {
        if(date === undefined){
            this.setState({ isDatePickerVisible: false})
        } else{
            this.setState({ dateInputValue: moment(date).format('DD-MM-YYYY'), isDatePickerVisible: false, anyInputChanged: true});
        }
  };

  timePickerOnChange = (event, date) => {
    if(date === undefined){
        this.setState({ isTimePickerVisible: false})
    } else{
        this.setState({ hourInputValue: moment(date).format('HH:mm'), isTimePickerVisible: false, anyInputChanged: true});
    }
  };

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

  render() {


    const { navigate } = this.props.navigation;


    return (

        <AndroidBackHandler onBackPress={this.onBackPress}>
		<View style={{alignItems: 'center', backgroundColor: '#E8E8E8', flex: 1}}>

        { this.state.isDatePickerVisible ? <RNDateTimePicker mode="date" value={new Date()} display="spinner" onChange = {this.datePickerOnChange}/> : null }
        { this.state.isTimePickerVisible ? <RNDateTimePicker mode="time" value={new Date()} display="spinner" is24Hour={true} onChange = {this.timePickerOnChange}/> : null }



        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 22, textAlign: 'center'}}>Wypełnij pola</Text>
        <View style={styles.dataContainer}>

            <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 16, textAlign: 'center'}}>Nowa wizyta</Text>
                        <TouchableOpacity onPress={() => this.setState({collapsed: !this.state.collapsed})}>
                        <Input label='Pacjent' labelStyle={{color: '#1cb5e0'}}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue=''
                            value={this.state.patientInputValue}
                            placeholder='Naciśnij, by wybrać pacjenta'
                            editable={false}/>
                        </TouchableOpacity>

                        <Accordion
                            sections={SECTIONS}
                            activeSections={this.state.activeSections}
                            collapsed={this.state.collapsed}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                            containerStyle={{width: '100%'}}
                            />


                        <TouchableOpacity onPress={() => this.setState({isDatePickerVisible: true })}>


                        <Input label='Data' labelStyle={{color: '#1cb5e0' }}
                            inputContainerStyle={{borderBottomColor: '#1cb5e0' }}
                            defaultValue=''
                            value = {this.state.dateInputValue}
                            placeholder='Naciśnij, by wybrać datę'
                            editable={false}/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setState({isTimePickerVisible: true })}>

                            <Input label='Godzina' labelStyle={{color: '#1cb5e0' }}
                                inputContainerStyle={{borderBottomColor: '#1cb5e0'}}
                                defaultValue=''
                                value={this.state.hourInputValue}
                                editable={false}
                                placeholder='Naciśnij, by wybrać godzinę'
                                />
                        </TouchableOpacity>
                    </View>



        </View>
        </AndroidBackHandler>


    );
  }
}


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