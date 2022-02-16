import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Image } from 'react-native';

export const Button = (props) => {

    const { title = '', iconSource, style = {}, textStyle = {}, iconStyle = {}, onPress} = props;

    return(
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Image source={iconSource} style={iconStyle} />
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#69e5ae',
        width: 75,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#ffffff'
    }

});