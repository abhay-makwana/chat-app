import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isRtl = I18nManager.isRTL;

export default function Chat() {
    const { i18n, t } = useTranslation();

    const [chatList, setChatList] = useState([
        {
            id: 1,
            name: 'Ram',
            email: 'ram@yopmail.com',
        },
        {
            id: 2,
            name: 'Shyam',
            email: 'shyam@yopmail.com',
        },
        {
            id: 3,
            name: 'Raj',
            email: 'raj@yopmail.com',
        },
        {
            id: 4,
            name: 'Raman',
            email: 'raman@yopmail.com',
        },
        {
            id: 5,
            name: 'Jay',
            email: 'jay@yopmail.com',
        },
        {
            id:6,
            name: 'Rajat',
            email: 'rajat@yopmail.com',
        },
        {
            id: 7,
            name: 'Jagat',
            email: 'jagat@yopmail.com',
        },
    ]);

    const renderChatListItem = (index: number, item: object) => {
        return (
            <TouchableOpacity style={styles.itemContainer}>
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
                keyExtractor={item => item.id}
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
