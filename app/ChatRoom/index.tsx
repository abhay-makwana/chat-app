import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Entypo, FontAwesome } from '@expo/vector-icons';


const isRtl = I18nManager.isRTL;

export default function ChatRoom(navigation: any, router: any) {
    const { i18n, t } = useTranslation();

    const [messageList, setMessageList] = useState([
        {
            id: 1,
            name: 'Ram',
            uid: 11,
            email: 'ram@yopmail.com',
            message: {
                from: "Ram",
                msg: "Hello"
            }
        },
        {
            id: 2,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "SHyam",
                msg: "Hello"
            }
        },
        {
            id: 3,
            name: 'Ram',
            uid: 11,
            email: 'ram@yopmail.com',
            message: {
                from: "Ram",
                msg: "How are you?"
            }
        },
        {
            id: 4,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "Fine"
            }
        },
        {
            id: 5,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "What's about you?"
            }
        },
        {
            id:6,
            name: 'Ram',
            uid: 11,
            email: 'ram@yopmail.com',
            message: {
                from: "Ram",
                msg: "Fine"
            }
        },
        {
            id: 7,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "Nice"
            }
        },
        {
            id: 8,
            name: 'Ram',
            uid: 11,
            email: 'ram@yopmail.com',
            message: {
                from: "Ram",
                msg: "Hello"
            }
        },
        {
            id: 9,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "Hello"
            }
        },
        {
            id: 10,
            name: 'Ram',
            uid: 11,
            email: 'ram@yopmail.com',
            message: {
                from: "Ram",
                msg: "How are you?"
            }
        },
        {
            id: 11,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "Fine"
            }
        },
        {
            id: 12,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "What's about you?"
            }
        },
        {
            id: 13,
            name: 'Ram',
            uid: 11,
            email: 'ram@yopmail.com',
            message: {
                from: "Ram",
                msg: "Fine"
            }
        },
        {
            id: 14,
            name: 'Shyam',
            uid: 12,
            email: 'shyam@yopmail.com',
            message: {
                from: "Shyam",
                msg: "Nice"
            }
        },
    ]);
    const [message, setMessage] = useState("");

    const renderMessageListItem = (index: number, item: object) => {
        return (
            <View style={item.uid == 11 ? styles.rightAlignContainer : styles.leftAlignContainer}>
                <TouchableOpacity style={[styles.itemContainer, item.uid == 11 ? styles.itemContainerSender : styles.itemContainerReceiver]}>
                    <Text style={styles.listItemText}>{item.message.msg}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* header view */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.headerImgContainer}
                    // onPress={() => {router.back()}}
                    >
                    <Entypo name='chevron-left' size={hp(4)} color='grey' />
                </TouchableOpacity>

                <Text style={styles.headerTitleText}>{"name"}</Text>
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
                    style={styles.input}
                    onChangeText={(text) => setMessage(text) }
                    value={message}
                    placeholder={t('chatroom.yourMessage')}
                    multiline
                />

                <TouchableOpacity style={styles.sendButtonContainer}>
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
        padding: hp(1),
        borderBottomWidth: hp(0.1),
        borderBottomColor: 'lightgrey'
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
        borderTopColor: 'lightgrey'
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
