import React, { Component } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';

import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';


class Loading extends Component {
    async componentDidMount(){
        try {

            const userID = await AsyncStorage.getItem('userID');
            const sessionID = await AsyncStorage.getItem('sessionID');

            if(userID == null || sessionID == null){
                return this.props.navigation.navigate('LoginScreen');
            }

            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/user/validateSession', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: userID,
                        sessionID: sessionID
                  })
              }
            );

            const responseJSON = await response.json();

            if(response.status == 200){
                await this.props.changeUserDataJSON({
                    ID: responseJSON.userID,
                    FirstName: responseJSON.firstName,
                    LastName: responseJSON.lastName,
                    Email: responseJSON.email
                });
                return await this.props.navigation.navigate("HomeScreen")
            }
            else{
                this.props.navigation.navigate('LoginScreen');
            }

          } catch (error) {
            Alert.alert(error.toString());
            this.props.navigate.navigate('LoginScreen');
          };

    };




  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size='large' color='#1cb5e0'/>
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


export default connect (mapStateToProps, mapDispatchToProps)(Loading);