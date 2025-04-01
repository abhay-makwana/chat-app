import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useContext, useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { ThemeContext } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';


export default function Signup() {
    const { t } = useTranslation();

    const { currentTheme } = useContext(ThemeContext);

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateInputs = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
        if (!name) {
            setNameError(t("signup.nameRequired"))
            return false
        } else if (!email) {
            setEmailError(t("signup.emailRequired"))
            return false
        } else if (email && !emailRegex.test(email)) {
            setEmailError(t("signup.emailInvalid"))
            return false
        } else if (!password) {
            setPasswordError(t("signup.passwordRequired"))
            return false
        } else if (password && password.length < 6) {
            setPasswordError(t("signup.passwordMinlength"))
            return false
        } else {
            return true
        }
    }

    const registerUser = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userRes) => {
                const user = userRes.user;
                // console.log("FBase res:- ", userRes);
                setDoc(doc(db, "users", user.uid), { uid: user.uid, email: email, name: name, req: [], realFriend: [], avatar: ""  });
                router.replace('/Login');
            })
            .catch((err) => {
                // console.log("FBase err:- ", err);
                alert(err.message)
            })
    }

    const handleSignup = () => {
        if (validateInputs()) {
            registerUser()
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? Colors.dark.background : Colors.light.background }]}>
                <Image
                    source={require('../../assets/images/auth/lock.png')}
                    style={styles.loginImg}
                />

                <Text style={styles.titleText}>{t('signup.signup')}</Text>

                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme === 'dark' ? '#2b2f31' : '#f5f5f5', color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}
                    onChangeText={(text) => {
                        setName(text);
                        setNameError("");
                    }}
                    value={name}
                    placeholder={t('signup.name')}
                    placeholderTextColor={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text}
                />
                {nameError && <Text style={[styles.errorText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{nameError}</Text>}
                
                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme === 'dark' ? '#2b2f31' : '#f5f5f5', color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailError("");
                    }}
                    value={email}
                    placeholder={t('signup.email')}
                    placeholderTextColor={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text}
                />
                {emailError && <Text style={[styles.errorText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{emailError}</Text>}

                <TextInput
                    style={[styles.input, { backgroundColor: currentTheme === 'dark' ? '#2b2f31' : '#f5f5f5', color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError("");
                    }}
                    value={password}
                    placeholder={t('signup.password')}
                    placeholderTextColor={currentTheme === 'dark' ? Colors.dark.text : Colors.light.text}
                    secureTextEntry
                />
                {passwordError && <Text style={[styles.errorText, { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>{passwordError}</Text>}

                <TouchableOpacity
                    onPress={() => {handleSignup()}}
                    style={styles.signupButton}
                >
                    <Text style={[styles.buttonText, { color: currentTheme === 'dark' ? Colors.light.text : 'white' }]}>{t('signup.signup')}</Text>
                </TouchableOpacity>

                <Link href="/Login" style={[styles.registerButton, , { color: currentTheme === 'dark' ? Colors.dark.text : Colors.light.text }]}>
                    {t('signup.alreadyHaveAccount')}
                </Link>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
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
        padding: hp(1.7),
        marginVertical: hp(1),
        borderRadius: hp(5),
        fontSize: hp(2.3)
    },
    errorText: {
        width: wp(80),
        textAlign: 'left',
        fontSize: hp(2)
    },
    signupButton: {
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
