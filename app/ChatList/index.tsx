import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc, getDocs, onSnapshot, query, collection, where } from 'firebase/firestore';
import { db } from '../../firebase';


const isRtl = I18nManager.isRTL;

export default function ChatList(navigation: any) {
    const router = useRouter();

    const { i18n, t } = useTranslation();

    const [chatList, setChatList] = useState([]);

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

    useEffect(() => {
        getChatUsers()
    }, [navigation]);

    const renderChatListItem = (index: number, item: object) => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => { router.push({pathname: '/ChatRoom', params: item}) }}>
                <Text style={styles.listItemText}>{item.name}</Text>
                <Text style={styles.listItemText}>{item.email}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={chatList}
                renderItem={({index, item}) => renderChatListItem(index, item)}
                keyExtractor={item => item.uid}
                style={styles.flatlistSty}
            />    
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    flatlistSty: {
        margin: hp(1)
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: hp(1),
        padding: hp(1),
        marginVertical: hp(0.5)
    },
    listItemText: {
        fontSize: hp(2),
    }
});
