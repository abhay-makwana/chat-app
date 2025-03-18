import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";


export default function Login() {
    const { i18n, t } = useTranslation();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <SafeAreaView style={styles.container}>
                <Text style={styles.titleText}>{t('login.login')}</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder={t('login.email')}
                />

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder={t('login.password')}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={() => {}}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>{t('login.login')}</Text>
                </TouchableOpacity>

                <Link href="/registration" style={styles.registerButton}>
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
        marginBottom: hp(5)
    },
    input: {
        width: wp(80),
        backgroundColor: '#FFFFFF',
        marginVertical: hp(1),
        borderRadius: hp(0.5),
        padding: hp(1.5)
    },
    loginButton: {
        width: wp(80),
        backgroundColor: 'grey',
        alignItems: 'center',
        paddingVertical: hp(1),
        borderRadius: hp(0.5),
        marginTop: hp(2)
    },
    buttonText: {
        fontSize: hp(2),
        color: '#FFFFFF'
    },
    registerButton: {
        textDecorationLine: 'underline',
        marginTop: hp(2)
    },
});
