import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList, Alert } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Entypo, FontAwesome } from '@expo/vector-icons';


const isRtl = I18nManager.isRTL;

export default function ChatRoom(navigation: any) {
    const router = useRouter();
    const item = useLocalSearchParams();
    const { i18n, t } = useTranslation();

    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const textRef = useRef("");
    const inputRef = useRef(null);

    const getRoomId = async () => {
        const usrData = await SecureStore.getItemAsync('user');
        const formattedUsrData = JSON.parse(usrData);
        
        const sortedIds = [formattedUsrData.uid, item.uid].sort();
        const roomId = sortedIds.join('-');
        return roomId;
    }

    const renderMessageListItem = async (index: number, item: object) => {
        const usrData = await SecureStore.getItemAsync('user');
        const formattedUsrData = JSON.parse(usrData);
        ;
        return (
            <View style={item.uid == formattedUsrData.uid ? styles.rightAlignContainer : styles.leftAlignContainer}>
                <TouchableOpacity style={[styles.itemContainer, item.uid == formattedUsrData.uid ? styles.itemContainerSender : styles.itemContainerReceiver]}>
                    <Text style={styles.listItemText}>{item.text}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const createRoomIfNotExists = async () => {
        const roomId = await getRoomId();

        console.log("Formatted room id:-", roomId)
        
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const getMessages = async () => {
        const roomId = await getRoomId();
        
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        const qry = query(messageRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(qry, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setMessageList([...allMessages])
        })

        return unsub;
    }

    const handleSendMessage = async () => {
        let sendMessage = textRef.current.trim();
        if (!sendMessage) return;

        try {
            const usrData = await SecureStore.getItemAsync('user');
            const formattedUsrData = JSON.parse(usrData);
            const roomId = await getRoomId();

            const docRef = doc(db, 'rooms', roomId);
            const messageRef = collection(docRef, "messages");

            // clear textInput on send button
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();

            const newDoc = await addDoc(messageRef, {
                uid: formattedUsrData.uid,
                text: sendMessage,
                avatar: "",
                createdAt: Timestamp.fromDate(new Date())
            })
            setMessage("");
            // console.log("new message info.:-", newDoc);

        } catch(err) {
            Alert.alert(t('chatroom.message'), err.message)
        }
    }

    useEffect(() => {
        createRoomIfNotExists()

        getMessages()
    }, [])

    console.log("Message list:-", messageList)
    
    return (
        <SafeAreaView style={styles.container}>
            {/* header view */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.headerImgContainer}
                    onPress={() => {router.back()}}
                >
                    <Entypo name='chevron-left' size={hp(4)} color='grey' />
                </TouchableOpacity>

                <Text style={styles.headerTitleText}>{item.name}</Text>
            </View>

            {/* messages view */}
            <View style={{ flex: 1}}>
                <FlatList
                    data={messageList}
                    renderItem={({index, item}) => renderMessageListItem(index, item)}
                    keyExtractor={item => item.id}
                    style={styles.flatlistSty}
                />   
            </View>

            {/* bottom view  */}
            <View style={styles.bottomContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    onChangeText={(text) => textRef.current = text }
                    // value={message}
                    placeholder={t('chatroom.yourMessage')}
                    multiline
                />

                <TouchableOpacity
                    style={styles.sendButtonContainer}
                    onPress={() => {handleSendMessage()}}
                >
                    <FontAwesome name='send' size={hp(2.5)} color='white' />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: hp(1.5),
        borderBottomWidth: hp(0.1),
        borderBottomColor: 'lightgrey',
        marginTop: hp(4),
        backgroundColor: 'white'
    },
    headerImgContainer: {
        marginRight: hp(1)
    },
    headerTitleText: {
        fontSize: hp(3)
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: hp(1),
        borderTopWidth: hp(0.1),
        borderTopColor: 'lightgrey',
        backgroundColor: 'white'
    },
    input:{ 
        flex: 1,
        // paddingHorizontal: hp(1),
        marginRight: hp(1),
        maxHeight: hp(12),
        fontSize: hp(2)
    },
    sendButtonContainer: {
        backgroundColor: 'powderblue',
        padding: hp(1.3),
        borderRadius: 100
    },

    flatlistSty: {
        margin: hp(1)
    },
    itemContainer: {
        borderRadius: hp(1),
        padding: hp(1),
        marginVertical: hp(0.5)
    },
    itemContainerSender: {
        backgroundColor: 'powderblue',
    },
    itemContainerReceiver: {
        backgroundColor: 'white',
    },
    leftAlignContainer: {
        alignItems: "flex-start" 
    },
    rightAlignContainer: {
        alignItems: "flex-end"
    },
    listItemText: {
        fontSize: hp(2),
    }
});
