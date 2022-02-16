import React, {Component} from 'react';
import AppNavigator from './AppNavigator';

import { createStore } from 'redux';

import { Provider } from 'react-redux';


const initialState = {
    anyTabInputChanged: false,

    PatientProfileID: '',

    PatientProfileFirstName: '',
    PatientProfileLastName: '',
    PatientProfilePesel: '',

    PatientProfilePhoneNumber: '',
    PatientProfileEmail: '',

    PatientProfileHomeAddress: '',
    PatientProfileCity: '',
    PatientProfilePostalCode: '',

    UserDataJSON:{
        ID: '',
        FirstName: '',
        LastName: '',
        Email: '',
    },

    PatientDataJSON: {

        _id: '',
        firstName: '',
        lastName: '',
        pesel: '',

        phoneNumber: '',
        email: '',

        homeAddress: '',
        city: '',
        postalCode: ''
    },

    VisitDataJSON: {
        _id: '',
        date: '',
        conclusion: '',
        symptoms: '',
        diagnosis: '',
        prescriptions: '',
        preparationForNextVisit: ''
    }



};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'CHANGE_TAB_INPUT_STATE_VALUE':
            return { ...state, anyTabInputChanged: !state.anyTabInputChanged };

        case 'CHANGE_PATIENT_DATA_JSON':
            return { ...state, PatientDataJSON: action.payload };

        case 'CHANGE_USER_DATA_JSON':
            return { ...state, UserDataJSON: action.payload };

        case 'CHANGE_VISIT_DATA_JSON':
            return { ...state, VisitDataJSON: action.payload }

        case 'CHANGE_PATIENT_DATA_JSON_PROPERTY':
            return { ...state, PatientDataJSON: { ...state.PatientDataJSON, [action.key]: action.payload} };

        case 'CHANGE_USER_DATA_JSON_PROPERTY':
            return { ...state, UserDataJSON: { ...state.UserDataJSON, [action.key]: action.payload} };

        case 'CHANGE_VISIT_DATA_JSON_PROPERTY':
            return { ...state, VisitDataJSON: { ...state.VisitDataJSON, [action.key]: action.payload} };

        case 'CHANGE_PATIENT_PROFILE_FIRST_NAME':
            return { ...state, PatientProfileFirstName: action.payload};
        case 'CHANGE_PATIENT_PROFILE_FIRST_NAME':
            return { ...state, PatientProfileLastName: action.payload};
        case 'CHANGE_PATIENT_PROFILE_PESEL':
            return { ...state, PatientProfilePesel: action.payload};

        case 'CHANGE_PATIENT_PROFILE_PHONE_NUMBER':
            return { ...state, PatientProfilePhoneNumber: action.payload};
        case 'CHANGE_PATIENT_PROFILE_EMAIL':
            return { ...state, PatientProfileEmail: action.payload};

        case 'CHANGE_PATIENT_PROFILE_HOME_ADDRESS':
            return { ...state, PatientProfileHomeAddress: action.payload};
        case 'CHANGE_PATIENT_PROFILE_CITY':
            return { ...state, PatientProfileCity: action.payload};
        case 'CHANGE_PATIENT_PROFILE_POSTAL_CODE':
            return { ...state, PatientProfilePostalCode: action.payload};

        default:
            return state;
    }
};

const store = createStore(reducer);


export default class App extends Component {
  render() {

    return (
        <Provider store = {store}>
            <AppNavigator/>
        </Provider>
    );
  }
}