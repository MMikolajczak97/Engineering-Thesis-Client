import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';

import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';

import AsyncStorage from '@react-native-community/async-storage';

import env from 'react-native-config';


class PatientVisitsList extends Component {


    static navigationOptions = ({ navigation }) => ({ headerLeft: <HeaderBackButton tintColor='#FFFFFF' onPress={ navigation.getParam('backPress') }/>
});

    constructor(){
        super();

        this.state = {

            visits: [],
        }
    }

    componentDidMount(){
        this.props.navigation.setParams({ backPress: this.onBackPress });
    }

    goToVisitScreen = async (visitID) => {
        await this.props.changeVisitDataJSONProperty('_id', visitID);

        try{
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/patients/getPatientVisitData', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),

                        patientID: this.props.currentPatientDataJSON._id,
                        visitID: this.props.currentVisitDataJSON._id,
                  })
              }
            );

            if(response.status == 200){
                const responseJSON = await response.json();
                await this.props.changeVisitDataJSON(responseJSON);
                await this.props.navigation.navigate("VisitScreen");
            }else{
                Alert.alert('Nie udało się pobrać danych wizyty');
            }
                return;

            }catch (error) {
                Alert.alert(error.toString());
                return;
            };

    };


    onBackPress = () => {
        const { goBack } = this.props.navigation;
        goBack(null);
    };



  render() {
    const { navigate } = this.props.navigation;
    return (

        <View style={{flex: 1}}>


            <View style={styles.listContainer}>
                <FlatList
                    data={this.props.currentPatientDataJSON.visits}
                    renderItem={({ item }) =>

                    <TouchableOpacity>
                        <ListItem chevron bottomDivider title={item.date}
                        titleStyle={{ fontFamily: 'Montserrat-Medium' }}
                        onPress={ () => this.goToVisitScreen(item._id)}/>
                    </TouchableOpacity>
                    }
                    keyExtractor={item => item._id}/>
            </View>


        </View>

    );
  }
}

function mapStateToProps(state){
    return {
        currentPatientDataJSON: state.PatientDataJSON,
        currentVisitDataJSON: state.VisitDataJSON
    }
}

function mapDispatchToProps(dispatch){
    return {
        changeVisitDataJSON: (value) => dispatch({ type: 'CHANGE_VISIT_DATA_JSON', payload: value }),
        changeVisitDataJSONProperty: (key, value) => dispatch({ type: 'CHANGE_VISIT_DATA_JSON_PROPERTY', key: key, payload: value})
    }
}

export default connect (mapStateToProps, mapDispatchToProps)(PatientVisitsList);


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