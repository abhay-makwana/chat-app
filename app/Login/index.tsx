import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, I18nManager } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import * as SecureStore from 'expo-secure-store';


const isRtl = I18nManager.isRTL;

export default function Login() {
    const { i18n, t } = useTranslation();

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
        <SafeAreaView style={styles.container}>
                <Text style={styles.titleText}>{t('login.login')}</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setEmail(text)
                        setEmailError("")
                    }}
                    value={email}
                    placeholder={t('login.email')}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setPassword(text)
                        setPasswordError("")
                    }}
                    value={password}
                    placeholder={t('login.password')}
                    secureTextEntry
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                <TouchableOpacity
                    onPress={() => {handleLogin()}}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>{t('login.login')}</Text>
                </TouchableOpacity>

                <Link href="/Signin" style={styles.registerButton}>
                    {t('login.createAccount')}
                </Link>
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
        fontWeight: 'bold',
        color: 'grey',
        marginBottom: hp(4)
    },
    input: {
        width: wp(80),
        backgroundColor: '#FFFFFF',
        marginVertical: hp(1),
        borderRadius: hp(0.5),
        padding: hp(1.5)
    },
    errorText: {
        width: wp(80),
        textAlign: 'left'
    },
    loginButton: {
        width: wp(80),
        backgroundColor: 'powderblue',
        alignItems: 'center',
        paddingVertical: hp(1),
        borderRadius: hp(0.5),
        marginTop: hp(2)
    },
    buttonText: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    registerButton: {
        marginTop: hp(2)
    },
});
