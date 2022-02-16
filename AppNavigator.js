import React, { Component } from 'react';

import { createSwitchNavigator, createStackNavigator, createAppContainer, getActiveChildNavigationOptions } from 'react-navigation';
import Login from './screens/Login';

import Home from './screens/Home';
import PatientsList from './screens/PatientsList';
import VisitsCalendar from './screens/VisitsCalendar';
import AddNewPatient from './screens/AddNewPatient';

import TabNavigator from './components/PatientProfileTabs';

import Visit from './screens/Visit';

import AddVisit from './screens/AddVisit';

import About from './screens/About';

import Loading from './screens/Loading';



const AppStack = createStackNavigator({
  HomeScreen: { screen: Home },
  PatientsListScreen: { screen: PatientsList },
  VisitsCalendarScreen: { screen: VisitsCalendar },
  PatientProfileScreen: { screen: TabNavigator, navigationOptions: ({ navigation, screenProps }) => ({

    ...getActiveChildNavigationOptions(navigation, screenProps),

  }), },
  VisitScreen: { screen: Visit },
  AddNewPatientScreen: { screen: AddNewPatient },
  AddVisitScreen: { screen: AddVisit },
  AboutScreen: { screen: About }

},
{
  defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#1cb5e0',
        elevation: 0
      },
      headerTintColor: '#FFFFFF'
    }
}
);

const AuthStack = createStackNavigator({
    LoginScreen: { screen: Login }
},
{
  defaultNavigationOptions: {
      header: null,
  }
}
);

const LoadingStack = createStackNavigator({
    LoadingScreen: { screen: Loading }
},
{
    defaultNavigationOptions: {
        header: null
    }
});

export default AppNavigator = createAppContainer(createSwitchNavigator({
    Loading: LoadingStack,
    Auth: AuthStack,
    App: AppStack
},
{
    initialRouteName: 'Loading'
}
));