import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, FlatList, ActivityIndicator, Switch, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { Fontisto } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import * as Localization from 'expo-localization';

const isRtl = I18nManager.isRTL;

export default function Settings(navigation: any) {
    const router = useRouter();
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language

    const { currentTheme, toggleTheme } = useContext(ThemeContext)

    // const [isRTL, setIsRTL] = useState(i18n.language === "yi" ? true : false);

    const changeLanguage = async (lang: string) => {
        await AsyncStorage.setItem("language", lang);
        i18n.changeLanguage(lang);
        if (lang === 'yi') {
            // alert(lang)
            // I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
        }
    };

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem("language");
            if (savedLanguage) {
              i18n.changeLanguage(savedLanguage);
            }
          };
        loadLanguage();
    }, [i18n]);

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
                <View style={styles.itemContainer}>
                    <Text style={[styles.itemText,{ color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{t('language')}</Text>
                    <View style={styles.itemContainerRow}>
                        <TouchableOpacity style={styles.itemContainerRow} onPress={() => changeLanguage('en')}>
                            <Fontisto style={styles.itemIcon} name={currentLanguage === "en" || currentLanguage === "en-US" ? "radio-btn-active" : "radio-btn-passive"} size={hp(2.5)} color={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text} />
                            <Text style={[styles.itemText,{ color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{t('english')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemContainerRow}  onPress={() => changeLanguage('yi')}>
                        <Fontisto style={styles.itemIcon} name={currentLanguage === "yi" ? "radio-btn-active" : "radio-btn-passive"} size={hp(2.5)} color={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text} />
                            <Text style={[styles.itemText,{ color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{t('yiddish')}</Text>    
                        </TouchableOpacity>
                    </View>
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
                                    await AsyncStorage.clear();
                                    toggleTheme('light');
                                    i18n.changeLanguage('en');
                                    router.replace('/Login');
                                    }
                                }
                            ])
                        }                        
                    }>
                    <Text style={[styles.itemText, styles.itemTextMargin, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{t('logout')}</Text>
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
    itemContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: wp(1.5)
    },
    itemText: {
        fontSize: hp(3),        
    },
    itemTextMargin: {
        marginTop: hp(1),
    },
    itemIcon: {
        marginHorizontal: wp(1)
    }
});
