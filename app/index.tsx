import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Login from './Login';
import Signin from './Signin';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';


export default function Index() {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         console.log("user det...", user)
    //         // if (user) {
    //         //     setUser(user)
    //         // }
    //     })
    // }, [])   

    return (
        <SafeAreaView style={styles.container}>
            {/* <Login /> */}
            {/* <Signin /> */}
            {/* <ChatList /> */}
            <ChatRoom />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: hp(4),
        marginBottom: hp(5)
    },
    input: {
        width: wp(80),
        backgroundColor: '#FFFFFF',
        marginVertical: hp(1),
        borderRadius: hp(0.5)
    },
    loginButton: {
        width: wp(80),
        backgroundColor: 'grey',
        alignItems: 'center',
        paddingVertical: hp(1),
        borderRadius: hp(0.5),
        marginTop: hp(2)
    },
    buttonText: {
        fontSize: hp(2),
        color: '#FFFFFF'
    },
    registerButton: {
        textDecorationLine: 'underline',
        marginTop: hp(2)
    },
});
