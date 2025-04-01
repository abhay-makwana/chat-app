import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList, ActivityIndicator, Switch, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeCOntext';
import { Colors } from '@/constants/Colors';

export default function Settings(navigation: any) {
    const router = useRouter();
    const { i18n, t } = useTranslation();

    const { currentTheme, toggleTheme } = useContext(ThemeContext)

    // const [chatList, setChatList] = useState([]);

    // useEffect(() => {
    // }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? Colors.dark.background : Colors.light.background}]}>
            <View>
                <View
                    style={styles.itemContainer}
                    // onPress={async () => { }}
                    >
                    <Text style={[styles.itemText,{ color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{t('darkMode')}</Text>
                    <Switch value={currentTheme === 'dark'} onValueChange={() => toggleTheme(currentTheme === 'light' ? 'dark' : 'light')} />
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        Alert.alert(
                            t('alert'),
                            t('settings.logoutConfirm'),
                            [
                                { text: t("no"), style: "cancel" },
                                { text: t("yes"), onPress: async () => {
                                    await SecureStore.setItemAsync('user', "");
                                    router.replace('/Login');
                                    }
                                }
                            ])
                        }                        
                    }>
                    <Text style={[styles.itemText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{t('logout')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ffffff',
        padding: hp(1)
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemText: {
        fontSize: hp(3),        
    }
});
