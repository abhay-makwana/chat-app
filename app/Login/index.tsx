import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useContext, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import * as SecureStore from 'expo-secure-store';
import { ThemeContext } from '@/context/ThemeCOntext';
import { Colors } from '@/constants/Colors';


const isRtl = I18nManager.isRTL;

export default function Login() {
    const { i18n, t } = useTranslation();

    const { currentTheme } = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const changeLanguage = async (lang: string) => {
        await AsyncStorage.setItem("language", lang);
        i18n.changeLanguage(lang);
    };

    const validateInputs = () => {
        if (!email) {
            setEmailError(t("login.emailRequired"))
            return false
        } else if (!password) {
            setPasswordError(t("login.passwordRequired"))
            return false
        } else {
            return true
        }
    }

    const loginUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userRes) => {
                const user = userRes.user;
                console.log("FBase res:- ", userRes);
                await SecureStore.setItemAsync('user', JSON.stringify(user));
                router.replace('/ChatList');
            })
            .catch((err) => {
                let msg = err.message
                console.log("FBase err:- ", err);
                msg = msg.includes("auth/invalid-email") || msg.includes("auth/invalid-credential") ? t('login.invalidEmailOrPassword') : msg
                alert(msg)
            })
    }

    const handleLogin = () => {
        if (validateInputs()) {
            loginUser()
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? Colors.dark.background : Colors.light.background }]}>
                <Image
                    source={require('../../assets/images/auth/lock.png')}
                    style={styles.loginImg}
                />
                
                <Text style={styles.titleText}>{t('login.login')}</Text>

                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme === 'dark' ? '#2b2f31' : '#f5f5f5', color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}
                    onChangeText={(text) => {
                        setEmail(text)
                        setEmailError("")
                    }}
                    value={email}
                    placeholder={t('login.email')}
                    placeholderTextColor={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text}
                />
                {emailError && <Text style={[styles.errorText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{emailError}</Text>}

                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme === 'dark' ? '#2b2f31' : '#f5f5f5', color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}
                    onChangeText={(text) => {
                        setPassword(text)
                        setPasswordError("")
                    }}
                    value={password}
                    placeholder={t('login.password')}
                    placeholderTextColor={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text}
                    secureTextEntry
                />
                {passwordError && <Text style={[styles.errorText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{passwordError}</Text>}

                <TouchableOpacity
                    onPress={() => {handleLogin()}}
                    style={styles.loginButton}
                >
                    <Text style={[styles.buttonText, { color: currentTheme === 'dark' ? Colors.light.text : 'white' }]}>{t('login.login')}</Text>
                </TouchableOpacity>

                <Link href="/Signup" style={[styles.registerButton, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>
                    {t('login.createAccount')}
                </Link>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginImg: {
        width: wp(60),
        height: hp(25),
        resizeMode: 'contain',
    },
    titleText: {
        fontSize: hp(4.3),
        fontWeight: 'bold',
        color: 'grey',
        marginBottom: hp(3)
    },
    input: {
        width: wp(80),
        // backgroundColor: '#f5f5f5',
        marginVertical: hp(1),
        borderRadius: hp(5),
        padding: hp(1.7),
        fontSize: hp(2.3)
    },
    errorText: {
        width: wp(80),
        textAlign: 'left',
        fontSize: hp(2)
    },
    loginButton: {
        width: wp(80),
        backgroundColor: 'powderblue',
        alignItems: 'center',
        paddingVertical: hp(1.2),
        borderRadius: hp(5),
        marginTop: hp(2)
    },
    buttonText: {
        fontSize: hp(2.7),
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    registerButton: {
        marginTop: hp(2),
        fontSize: hp(2.3)
    },
});
