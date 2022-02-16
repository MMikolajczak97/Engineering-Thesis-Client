import React from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import PatientProfile from '../screens/PatientProfile';
import PatientMedicalDescription from '../screens/PatientMedicalDescription';
import PatientVisitsList from '../screens/PatientVisitsList';





const TabNavigator = createMaterialTopTabNavigator({
    PatientPersonalData: { screen: PatientProfile, navigationOptions: ({navigation}) => {  return { tabBarLabel:"Dane"} }},
    PatientMedicalDescriptionTab: { screen: PatientMedicalDescription, navigationOptions: ({navigation}) => {  return { tabBarLabel:"Opis pacjenta"} } },
    PatientVisitsTab: { screen: PatientVisitsList, navigationOptions: ({navigation}) => {  return { tabBarLabel:"Historia wizyt"} }  }
    },
    {
    swipeEnabled: true,
    tabBarOptions: {
        labelStyle: {
            color: '#1cb5e0',
            fontFamily: 'Montserrat-Medium',
            },
        indicatorStyle: {
            backgroundColor: '#1cb5e0'
            },
        style: {
            backgroundColor: '#FFFFFF'
        },

    }
});

  export default TabNavigator;