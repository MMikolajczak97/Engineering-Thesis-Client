import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from '../components/Button';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';


class Home extends Component {

    static navigationOptions= ({navigation}) => {
        return {
         header: null
        }};


    logout = async () => {
        try {

            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/user/logout', {
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

            await AsyncStorage.removeItem('userID');
            await AsyncStorage.removeItem('sessionID');

            this.props.navigation.navigate("LoginScreen");

            return response;
          } catch (error) {
            Alert.alert(error.toString());
          };
    };

    constructor(props){
        super(props);

        this.state = {
            welcomeText: `Witaj - jesteś zalogowany jako ${'\n'} ${this.props.currentUserDataJSON.FirstName} ${this.props.currentUserDataJSON.LastName} ${'\n'} (${this.props.currentUserDataJSON.Email})`
        };

    }


  render() {
    const { navigate } = this.props.navigation;
    return (


		<View style={{flex: 1}}>

            <View style={{width: '100%', height: 120, backgroundColor: '#1cb5e0', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 18, color: '#FFFFFF', textAlign: 'center'}}>{this.state.welcomeText}</Text>
            </View>

        	<View style={styles.container}>
        		<Button title="Pacjenci" textStyle={{color:'#000000', fontSize: 16, fontFamily: 'Montserrat-Medium'}} style={[styles.button, {backgroundColor:'#ffffff'}]} iconSource={require('../icons/medical.png')} iconStyle={{width: 60, height: 60}} onPress={ () => navigate( "PatientsListScreen" )}/>
        		<Button title="Wizyty" textStyle={{color:'#000000', fontSize: 16, fontFamily: 'Montserrat-Medium'}} style={[styles.button, {backgroundColor: '#ffffff'}]} iconSource={require("../icons/calendar.png")} iconStyle={{width: 60, height: 60}} onPress={ () => navigate( "VisitsCalendarScreen" )}/>
    			<Button title="Dodaj pacjenta" textStyle={{color:'#000000', fontSize: 16, fontFamily: 'Montserrat-Medium'}} style={[styles.button, {backgroundColor: '#ffffff'}]} iconSource={require("../icons/add_patient.png")} iconStyle={{width: 60, height: 60}} onPress={ () => navigate( "AddNewPatientScreen" )}/>
        		<Button title="Zaplanuj wizytę" textStyle={{color:'#000000', fontSize: 16, fontFamily: 'Montserrat-Medium'}} style={[styles.button, {backgroundColor:'#ffffff'}]} iconSource={require("../icons/add_visit.png")} iconStyle={{width: 60, height: 60}} onPress={ () => navigate( "AddVisitScreen" )}/>
                <Button title="O aplikacji" textStyle={{color:'#000000', fontSize: 16, fontFamily: 'Montserrat-Medium'}} style={[styles.button, {backgroundColor:'#ffffff'}]} iconSource={require("../icons/about.png")} iconStyle={{width: 60, height: 60}} onPress={ () => navigate( "AboutScreen" )}/>
                <Button title="Wyloguj" textStyle={{color:'#000000', fontSize: 16, fontFamily: 'Montserrat-Medium'}} style={[styles.button, {backgroundColor:'#ffffff'}]} iconSource={require("../icons/logout.png")} iconStyle={{width: 60, height: 60}} onPress={ () => this.logout()}/>
        	</View>

        </View>

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


export default connect (mapStateToProps, mapDispatchToProps)(Home);



const styles = StyleSheet.create({
container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8'

    },

button: {
    width: '40%',
    aspectRatio: 1,
    margin: 10,
    elevation: 7
    }


});