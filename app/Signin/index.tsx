import { Text, View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useTranslation } from "react-i18next";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { setDoc, doc } from 'firebase/firestore';


export default function Signin() {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validateInputs = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
        if (!name) {
            setNameError(t("signin.nameRequired"))
            return false
        } else if (!email) {
            setEmailError(t("signin.emailRequired"))
            return false
        } else if (email && !emailRegex.test(email)) {
            setEmailError(t("signin.emailInvalid"))
            return false
        } else if (!password) {
            setPasswordError(t("signin.passwordRequired"))
            return false
        } else if (password && password.length < 6) {
            setPasswordError(t("signin.passwordMinlength"))
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

    const handleSignin = () => {
        if (validateInputs()) {
            registerUser()
        }
    }

    return (
        <SafeAreaView style={styles.container}>
                <Text style={styles.titleText}>{t('signin.signin')}</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setName(text);
                        setNameError("");
                    }}
                    value={name}
                    placeholder={t('signin.name')}
                />
                {nameError && <Text style={styles.errorText}>{nameError}</Text>}
                
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailError("");
                    }}
                    value={email}
                    placeholder={t('signin.email')}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}

                <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError("");
                    }}
                    value={password}
                    placeholder={t('signin.password')}
                    secureTextEntry
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                <TouchableOpacity
                    onPress={() => {handleSignin()}}
                    style={styles.signinButton}
                >
                    <Text style={styles.buttonText}>{t('signin.signin')}</Text>
                </TouchableOpacity>

                <Link href="/Login" style={styles.registerButton}>
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
        fontWeight: 'bold',
        color: 'grey',
        marginBottom: hp(4)
    },
    input: {
        width: wp(80),
        backgroundColor: '#FFFFFF',
        padding: hp(1.5),
        marginVertical: hp(1),
        borderRadius: hp(0.5)
    },
    errorText: {
        width: wp(80),
        textAlign: 'left'
    },
    signinButton: {
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
