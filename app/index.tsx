import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Login from './Login';
import Signup from './Signup';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});


export default function Index() {
    const [user, setUser] = useState(null);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                console.log("existingStatus",existingStatus)
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                console.log("finalStatus",finalStatus)
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            alert('Must use physical device for Push Notifications');
        }
    
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                showBadge: true,
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FE9018',
            });
        }
    
        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token =>

            setExpoPushToken(token)
        );

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);


        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          //  console.log(response);
            const {notification: {request: {content: {data: {screen}}}}} = response
            //when the user taps on the notification, this line checks if they //are suppose to be taken to a particular screen
            if (screen) {
                // props.navigation.navigate(screen)
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const redirectScreen = async () => {
        const userData = await SecureStore.getItemAsync('user');
        
        return userData ? <ChatList /> : <Login />
    }

    return (
        <SafeAreaView style={styles.container}>
            {redirectScreen()}
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
