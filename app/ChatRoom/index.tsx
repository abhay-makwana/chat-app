import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { addDoc, collection, doc, getDoc, limit, onSnapshot, orderBy, query, setDoc, startAfter, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';


const isRtl = I18nManager.isRTL;

export default function ChatRoom(navigation: any) {
    const router = useRouter();
    const item = useLocalSearchParams();
    const { i18n, t } = useTranslation();

    const [messageList, setMessageList] = useState([]);
    const [message, setMessage] = useState("");
    const [isEditMsg, setIsEditMsg] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState({});
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastData, setLastData] = useState(false);

    const textRef = useRef("");
    const inputRef = useRef(null);

    const getRoomId = async () => {
        const usrData = await SecureStore.getItemAsync('user');
        const formattedUsrData = JSON.parse(usrData);
        
        const sortedIds = [formattedUsrData.uid, item.uid].sort();
        const roomId = sortedIds.join('-');
        return roomId;
    }

    const handleLongPress = async (message: object) => {
    const roomId = await getRoomId();
    const msgRef = doc(db, "rooms", roomId, "messages", message.msgId);
    let sendMessage = textRef.current.trim();

    // // await updateDoc(msgRef, { text: sendMessage, editedAt: Timestamp.fromDate(new Date()) })

        Alert.alert(
            t("chatroom.messageOptions"),
            message.text,
            [
                { text: t("cancel"), style: "cancel" },
                { text: t("edit"), onPress: () => {
                        setIsEditMsg(true);
                        setSelectedMsg(message);
                        textRef.current = message.text;
                        inputRef.current?.setNativeProps({ text: message.text }); // Set text into the input
                        inputRef.current?.focus(); // Focus on the input                        
                    }
                },
                { text: t("delete"), onPress: async () => {
                    Alert.alert(
                        "Are you sure you want to delete this message?",
                        message.text,
                        [
                            { text: t("cancel"), style: "cancel" },
                            { text: t("delete"), onPress: async () => {
                                    await updateDoc(msgRef, { deleted: true, deletedAt: Timestamp.fromDate(new Date()) })
                                }
                            }
                        ])
                        // await updateDoc(msgRef, { deleted: true, deletedAt: Timestamp.fromDate(new Date()) })
                    }
                },
            ]
        );
    };

    const renderMessageListItem = async (index: number, item: object) => {
        const usrData = await SecureStore.getItemAsync('user');
        const formattedUsrData = JSON.parse(usrData);
        ;
        return (
            <View style={item.uid == formattedUsrData.uid ? styles.rightAlignContainer : styles.leftAlignContainer}>
                <Pressable
                    style={[styles.itemContainer, item.uid == formattedUsrData.uid ? styles.itemContainerSender : styles.itemContainerReceiver]}
                    onLongPress={() => {
                        item.uid == formattedUsrData.uid && !item.deleted && handleLongPress(item)
                    }}>
                        <View style={styles.listItemTextContainer}>
                            {item.deleted &&
                                <MaterialIcons name='do-not-disturb' size={hp(2.5)} color='grey' style={styles.delIcon} />}
                            <Text style={styles.listItemText}>{item.deleted ? t('chatroom.deletedMessage') : item.text}</Text>
                        </View>
                </Pressable>
            </View>
        )
    }

    const createRoomIfNotExists = async () => {
        const roomId = await getRoomId();

        
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }

    const getMessages = async () => {
        setLoading(true)
        const roomId = await getRoomId();
        
        const docRef = doc(db, "rooms", roomId);
        const messageRef = collection(docRef, "messages");
        let qry = query(messageRef, orderBy('createdAt', 'desc'), limit(20));
        
        if (lastVisible) {
            qry = query(messageRef, orderBy('createdAt', 'desc'), limit(20), startAfter(lastVisible));
        }
        
        let unsub = onSnapshot(qry, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => ({
               msgId: doc.id,
                ...doc.data()
            }));

            const lastVisibleMessage = snapshot.docs[snapshot.docs.length - 1];
            setLastVisible(lastVisibleMessage);
            setMessageList([...messageList, ...allMessages])
            allMessages.length === 0  && setLastData(true)
            
        })
        setLoading(false)

        return unsub;
    }

    const handleSendMessage = async () => {
        let sendMessage = textRef.current.trim();
        if (!sendMessage) return;

        if (isEditMsg) {
            try {
                const roomId = await getRoomId();
                const msgRef = doc(db, "rooms", roomId, "messages", selectedMsg.msgId);
                let sendMessage = textRef.current.trim();

                textRef.current = "";
                if (inputRef) inputRef?.current?.clear();
                setIsEditMsg(false);

                await updateDoc(msgRef, { text: sendMessage, editedAt: Timestamp.fromDate(new Date()) })

            } catch (err) {
                Alert.alert(t('chatroom.message'), err.message)
            } 
        } else {
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

            } catch(err) {
                Alert.alert(t('chatroom.message'), err.message)
            }
        }
    }

    const handleLoadMore = () => {
        if (!lastData) {
            // loadMessages();
            getMessages()
        }
    };

    useEffect(() => {
        createRoomIfNotExists()

        getMessages()
    }, [])

    
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
                    keyExtractor={item => Math.random()}
                    style={styles.flatlistSty}
                    onEndReached={() => {handleLoadMore()}}
                    // onEndReachedThreshold={0.01}
                    // scrollEventThrottle={150}
                    inverted
                    ListFooterComponent={loading ? <Text>Loading...</Text> : null}

                />   
            </View>

            {/* bottom view  */}
            <View style={styles.bottomContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    onChangeText={(text) => {
                        textRef.current = text
                        !text.length && setIsEditMsg(false)
                    }}
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
        height: '100%',
        backgroundColor: '#ffffff'
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
        borderWidth: hp(0.1),
        borderColor: 'lightgrey',
        backgroundColor: '#ffffff',
        borderRadius: hp(5),
        marginHorizontal: wp(2),
        marginBottom: hp(1)
    },
    input:{ 
        flex: 1,
        marginRight: hp(1),
        maxHeight: hp(12),
        fontSize: hp(2),
        marginLeft: wp(1)
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
        backgroundColor: '#f5f5f5',
    },
    leftAlignContainer: {
        alignItems: "flex-start" 
    },
    rightAlignContainer: {
        alignItems: "flex-end"
    },
    listItemTextContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    delIcon: {
        marginRight: wp(1),
    },
    listItemText: {
        fontSize: hp(2),
    }
});
