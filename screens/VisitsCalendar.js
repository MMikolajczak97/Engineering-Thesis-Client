import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ToastAndroid } from 'react-native';
import { Icon } from 'react-native-elements';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-community/async-storage';
import env from 'react-native-config';




export default class VisitsCalendar extends Component {

constructor(){
    super();

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();


    this.state = {
        visits: [],
        today: dd + '-' + mm + '-' + yyyy,
        data: null,
        selectedDate: '',
        selectedDateVisits: []

    };


  }

    getPlannedVisits = async () => {
        try {

            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/user/getPlannedVisits', {
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
                this.setState({ visits: responseJSON.plannedVisits });
            }
            else{
                ToastAndroid.show('Wystąpił błąd - nie udało się pobrać listy planowanych wizyt', ToastAndroid.SHORT);
            }

            return response;
          } catch (error) {
            Alert.alert(error.toString());
          };
    };


    async componentDidMount(){
        await this.getPlannedVisits();
        await this.setState({selectedDate: this.state.today, selectedDateVisits: this.state.visits.filter(item => item.date === this.state.today) });

  }

    removeVisitFromList = async (visitID) => {
        let visits = this.state.visits;

        let selectedDateVisits = this.state.selectedDateVisits;

        if(visits.length == 1){
            visits = [];
            selectedDateVisits = [];
        }
        else{

        let visitIndexToRemove = await visits.findIndex(item => item._id === visitID);

        let selectedDateVisitIndexToRemove = await selectedDateVisits.findIndex(item => item._id === visitID);

        await visits.splice(visitIndexToRemove, 1);
        await selectedDateVisits.splice(selectedDateVisitIndexToRemove, 1);

        };
        await this.setState({ visits: visits, selectedDateVisits: selectedDateVisits });
    };


    addCompletedVisit = async (visitID) => {
        try{
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/patients/addCompletedVisit', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),
                        visitID: visitID
                  })
              }
            );

            if(response.status == 200){
                this.removeVisitFromList(visitID);
                ToastAndroid.show('Dodano zrealizowaną wizytę', ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('Wystąpił błąd - nie udało się dodać zrealizowanej wizyty', ToastAndroid.SHORT);
            }
            return;

            }catch (error) {
                Alert.alert(error.toString());
                return;
            };

    };



    removeVisit = async (visitID) => {
        try{
            let response = await fetch(
                'https://' + env.SERVER_ADDRESS + '/user/deletePlannedVisit', {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify({
                        userID: await AsyncStorage.getItem('userID'),
                        sessionID: await AsyncStorage.getItem('sessionID'),
                        visitID: visitID
                  })
              }
            );

            if(response.status == 200){
                this.removeVisitFromList(visitID);
                ToastAndroid.show('Planowana wizyta usunięta', ToastAndroid.SHORT);
            }else{
                ToastAndroid.show('Wystąpił błąd - nie udało się usunąć planowanej wizyty', ToastAndroid.SHORT);
            }
            return;

            }catch (error) {
                Alert.alert(error.toString());
                return;
            };

    };



  render() {
    const { navigate } = this.props.navigation;
    return (


		<View style={{flex: 1}}>

        <View style={{width: '100%'}}>
           <CalendarPicker
           weekdays={['Pon.','Wt.','Śr.','Czw.','Pt.','Sob.', 'Niedz.']}
           months={['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']}
           startFromMonday={true}
           previousTitle='Poprzedni'
           nextTitle='Następny'
           todayTextStyle={{color: 'red'}}
           todayBackgroundColor='transparent'
           selectedDayColor='#1cb5e0'
           textStyle={{
               fontFamily: 'Montserrat-Medium',
               fontSize: 14
           }}

            onDateChange ={ (date) => {
                this.setState({selectedDateVisits:
                this.state.visits.filter(item => item.date === date.format("DD-MM-YYYY")),
                selectedDate: date.format("DD-MM-YYYY")});

            }}


           />
           </View>

<View style={{}}>
<FlatList
                data = {this.state.selectedDateVisits}
                extraData={this.state}
                    renderItem={({ item }) =>

                    <View style={{paddingHorizontal: 10, borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: '#E8E8E8', borderBottomColor: '#E8E8E8'}}>

                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 18}}>{'PESEL: ' + item.patientPesel}</Text>
                            <View style={{position: 'absolute', right: 0, flexDirection: 'row'}}>
                            <Icon name='check'
                                type='material'
                                color='#32d732'
                                size={40}
                                style={{paddingHorizontal: 20}}

                                onPress={ () => {Alert.alert('Dodać zrealizowaną wizytę?', '', [
                                    { text: 'OK', onPress: () => {
                                        this.addCompletedVisit(item._id)
                                }},
                                    { text: 'Anuluj', onPress: () => {}}
                                ]);}}
                                />
                            <Icon name='delete'
                                type='material'
                                color='red'
                                size={40}
                                style={{paddingHorizontal: 20}}

                                onPress={ () => {Alert.alert('Usunąć wizytę?', '', [
                                    { text: 'OK', onPress: () => {
                                        this.removeVisit(item._id)
                                }},
                                    { text: 'Anuluj', onPress: () => {}}
                                ]);}}

                                />


                                </View>

                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 18}}>{item.patientFirstName + ' ' + item.patientLastName}</Text>
                        <Text style={{fontFamily: 'Montserrat-Medium', fontSize: 18}}>{item.date + ' ' + item.hour}</Text>
                    </View>
                    }

                    keyExtractor={item => item._id}/>

                    </View>
                </View>

    );
  }
}


const styles = StyleSheet.create({


});