import React, { Component } from 'react';
import { StyleSheet, View, Alert, FlatList, TouchableOpacity, ToastAndroid } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { DismissKeyboard } from '../components/DismissKeyboard';

import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';


class PatientsList extends Component {

    updateSearch = search => {
        this.setState({ search });
        };


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
                this.setState({ patients: responseJSON, searchedData: responseJSON });
            }
            else{
                ToastAndroid.show('Wystąpił błąd - nie udało się pobrać listy pacjentów', ToastAndroid.SHORT);
            }

            return response;
          } catch (error) {
            Alert.alert(error.toString());
          };
    };





constructor(){
  super();

  this.state = {

    patientID: '',
    patients: [],
    searchedData: [],
    search: ''
    };

  }



    async componentDidMount(){
        await this.getAllPatients();
    }

    getPatient = async (patientID) => {
        try{
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/patients/getPatient', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),
                        patientID: patientID
                  })
              }
            );

            const responseJSON = await response.json();

            if(response.status == 200){
                await this.props.changePatientDataJSON(responseJSON);

            }else{
                ToastAndroid.show('Wystąpił błąd - nie udało się pobrać danych pacjenta', ToastAndroid.SHORT);
            }
            return response;

            }catch (error) {
                Alert.alert(error.toString());
                return;
            };

    };

    removePatient = async (patientID) => {

        let patients = this.state.patients;

        if(patients.length == 1){
            patients = []
        }
        else{

        let patientIndexToRemove = patients.findIndex(item => item._id === patientID);
        patients.splice(patientIndexToRemove, 1);

        }

        try{
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/patients/deletePatient', {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),
                        patientID: patientID
                  })
              }
            );

            if(response.status == 200){
                await this.setState({patients: patients, searchedData: patients, search: ''});
                ToastAndroid.show('Pacjent usunięty', ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('Wystąpił błąd - nie udało się usunąć pacjenta', ToastAndroid.SHORT);
            }
            return;

            }catch (error) {
                Alert.alert(error.toString());
                return;
            };

    };

    searchPatient = search => {
        const newData = this.state.patients.filter(item => {
            const itemData = `${item.firstName.toUpperCase()} ${item.lastName.toUpperCase()}`;

            const textData = search.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        this.setState({ searchedData: newData, search });

      };

        goToPatientScreen = async (patientID) => {
            await this.getPatient(patientID);
            await this.props.navigation.navigate('PatientProfileScreen');
    };

    render() {

       const { navigate } = this.props.navigation;

    return (
        <DismissKeyboard>
            <View style={{flex: 1}}>

                <SearchBar placeholder="Wpisz nazwisko pacjenta"
                onChangeText={text => this.searchPatient(text)}
                value={this.state.search}
                lightTheme={true}
                inputStyle={{ fontFamily: 'Montserrat-Medium' }} cancelIcon={{type: 'antdesign', name: 'arrowleft', color: '#FFFFFF'}} />

                <View style={styles.listContainer}>
                    <FlatList
                        data={this.state.searchedData}
                        renderItem={({ item }) =>

                        <TouchableOpacity>
                            <ListItem chevron bottomDivider
                            title={`${item.firstName} ${item.lastName}`}
                            subtitle={ 'PESEL: ' + item.pesel}
                            titleStyle={{ fontFamily: 'Montserrat-Medium' }} subtitleStyle={{ fontFamily: 'Montserrat-Medium' }}
                            onPress={ () => this.goToPatientScreen(item._id)}
                            onLongPress={ () => {Alert.alert('Usunąć pacjenta?', '', [
                                { text: 'OK', onPress: () => {
                                    this.removePatient(item._id)
                            }},
                                { text: 'Anuluj', onPress: () => {}}
                            ]);}}
                            />
                        </TouchableOpacity>}

                   keyExtractor={item => item._id}/>
                </View>


            </View>
        </DismissKeyboard>

    );
  }
}



function mapStateToProps(state){
    return {

    }
}

function mapDispatchToProps(dispatch){
    return {
        changePatientDataJSON: (value) => dispatch({ type: 'CHANGE_PATIENT_DATA_JSON', payload: value }),
        changeVisitDataJSON: (value) => dispatch({ type: 'CHANGE_VISIT_DATA_JSON', payload: value })
    }
}


export default connect (mapStateToProps, mapDispatchToProps)(PatientsList);

const styles = StyleSheet.create({
    listContainer: {

    }

});