import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc, getDocs, onSnapshot, query, collection, where, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import * as Notifications from "expo-notifications";
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { getLocales } from 'expo-localization';

// const isRtl = I18nManager.isRTL;
let isRtl = getLocales()[0].languageCode == 'yi' ? true : false;

export default function ChatList(navigation: any) {
    const router = useRouter();

    const { i18n, t } = useTranslation();

    const { currentTheme } = useContext(ThemeContext);

    const [chatList, setChatList] = useState([]);
    // const [isRtl, setIsRTL] = useState(getLocales()[0].languageCode)

    const getChatUsers = async () => {
        const usrData = await SecureStore.getItemAsync('user');
        const formattedUsrData = JSON.parse(usrData);

        // const qry = query(doc(db, "users", formattedUsrData.uid));
        // const unsubscribe = onSnapshot(qry, async (snapshot) => {
        //     const contactsObject = snapshot.data()
        //     console.log("contactsObject:--", contactsObject)
        //     const contactsSnap = await contactsObject.forEach((cntct) => getDoc(doc(db, "users", cntct)))
        //     console.log("contactsSnap:--", contactsSnap)
        //     const contactDetails = contactsSnap.map((dtls) => ({
        //         id: dtls.uid,
        //         ...dtls.data()
        //     }))
        //     console.log("contactDetails:--", contactDetails)
        // })
        // console.log("got data:--", qry)

        const userRef = collection(db, "users");
        const qry = query(userRef, where('uid', '!=', formattedUsrData.uid));

        const qrySnapshot = await getDocs(qry);
        console.log("got users1: ", qrySnapshot)
        let data = [];
        qrySnapshot.forEach(doc => {
            data.push({...doc.data()})
        });
        // console.log("got users: ", data)
        setChatList(data)

    }

    const registerForPushNotifications = async () => {
        const usrData = await SecureStore.getItemAsync('user');
        const formattedUsrData = JSON.parse(usrData);
        
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== "granted") {
            alert("Permission not granted for push notifications!");
            return;
          }
        }
      
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("FCM Token:", token);
      
        // Save the token to Firestore under the user's profile
        await setDoc(doc(db, "users", formattedUsrData.uid), { pushToken: token }, { merge: true });
    };

    useEffect(() => {
        getChatUsers()
        // registerForPushNotifications()
    }, [navigation]);

    const renderChatListItem = (index: number, item: object) => {
        return (
            <TouchableOpacity style={[styles.itemContainer, { backgroundColor: currentTheme === 'dark' ? Colors.dark.background : Colors.light.background }]} onPress={() => { router.push({pathname: '/ChatRoom', params: item}) }}>
                <View style={styles.itemContainerRow}>
                    <FontAwesome6 name='user-circle' size={hp(2)} color={currentTheme === 'dark' ? Colors.dark.icon : Colors.light.icon} style={styles.itemIcon} />
                    <Text style={[styles.listItemText, styles.listItemTextBold, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{item.name}</Text>
                </View>
                <View style={styles.itemContainerRow}>
                    <Entypo name='email' size={hp(2)} color={currentTheme === 'dark' ? Colors.dark.icon : Colors.light.icon} style={styles.itemIcon} />
                    <Text style={[styles.listItemText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{item.email}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={[styles.container,{backgroundColor: currentTheme === 'dark' ? Colors.dark.background : Colors.light.background}]}>
            <View style={styles.settingsBtn}>
                <TouchableOpacity onPress={() => { router.push('/Settings') }}>
                    <Ionicons name='settings-outline' size={hp(3.5)} color={currentTheme === 'dark' ? Colors.dark.icon : Colors.light.icon} />
                </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
                onPress={async () => {
                    await SecureStore.setItemAsync('user', "");
                    router.replace('/Login');
                }}>
                <Text style={styles.logoutBtn}>{t('logout')}</Text>
            </TouchableOpacity> */}
            <FlatList
                data={chatList}
                renderItem={({index, item}) => renderChatListItem(index, item)}
                keyExtractor={item => item.uid}
                style={styles.flatlistSty}
                ListEmptyComponent={() => {
                    return <View style={styles.flatlistEmptyContainer}>
                        <ActivityIndicator color="powderblue" size={'large'} />
                    </View>
                }}
                contentContainerStyle={{flex: 1}}
            />    
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff'
    },
    flatlistSty: {
        margin: hp(1)
    },
    flatlistEmptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: hp(1),
        padding: hp(1.3),
        marginVertical: hp(0.5),
        marginHorizontal: wp(0.5)
    },
    itemContainerRtl: {
        alignItems: 'flex-end'
    },
    itemContainerRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemIcon: {
        marginRight: wp(1),
    },
    listItemText: {
        fontSize: hp(2.3),
    },
    listItemTextBold: {
        fontWeight: 'bold'
    },
    settingsBtn: {
        alignItems: 'flex-end',
        padding: hp(1)
    }
});
