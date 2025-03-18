import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";


export default function Signin() {
    const { t } = useTranslation();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <SafeAreaView style={styles.container}>
                <Text style={styles.titleText}>{t('signin.signin')}</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    placeholder={t('signin.name')}
                />
                
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder={t('signin.email')}
                />

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder={t('signin.password')}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress={() => {}}
                    style={styles.loginButton}
                >
                    <Text style={styles.buttonText}>{t('signin.signin')}</Text>
                </TouchableOpacity>

                <Link href="/login" style={styles.registerButton}>
                    {t('signin.alreadyHaveAccount')}
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
        padding: hp(1.5),
        marginVertical: hp(1),
        borderRadius: hp(0.5)
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
