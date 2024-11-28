import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {IMAGES} from '../FoodAppData/FoodData'
import { useRouter } from 'expo-router';

export default function login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handlePhoneNumberChange = (text) => {
        let newText = '';
        for (let i = 0; i < text.length; i++) {
            if (text[i] >= '0' && text[i] <= '9') {
                newText += text[i];
            }
        }
        if (newText.length <= 11) {
            setUsername(newText);
        }
    };

    const handleLogin = () => {
        if (username.trim() === '' || password.trim() === '') {
            Alert.alert(
                "Lỗi đăng nhập",
                "Vui lòng nhập cả số điện thoại và mật khẩu",
                [{ text: "OK" }]
            );
        } else if (username.trim() === '0123456789'  && password.trim() === 'Dethi@03') {
            console.log('Đăng nhập với: ', username, password);
            router.push('/foodpage');
        } else {
            Alert.alert(
                "Lỗi đăng nhập",
                "Vui lòng nhập cả số điện thoại và mật khẩu",
                [{ text: "OK" }]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>TYGA</Text>
            <View>
                <Text style={styles.title_login}>Đăng nhập</Text>
                <Text style={styles.mini_title}>Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ</Text>
            </View>
            <View>
                <Text style={styles.title_input}>Số điện thoại *</Text>
                <View style={styles.box}>
                    <View style={{width:70,borderRightWidth:1, borderColor: '#ddd',}}>
                        <TouchableOpacity style={{flexDirection:'row'}}>
                            <Text>(+84) </Text>
                            <Image source={IMAGES.star} style={styles.starr}></Image>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder='  Nhập số điện thoại của bạn'
                        value={username}
                        onChangeText={handlePhoneNumberChange}
                        keyboardType='numeric'
                        maxLength={11}
                    />
                </View>
                <Text style={styles.title_input}>Mật khẩu *</Text>
                <View style={styles.box}>
                    <TextInput
                        placeholder='Nhập mật khẩu của bạn'
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <View style={{position:'absolute', right:10}}>
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View>
                <TouchableOpacity>
                    <Text style={styles.forget_password}>Quên mật khẩu ?</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.button_login}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#ffffff'
    },
    header: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        color: 'blue',
        textShadowColor: 'gray',
        textShadowOffset: { width: 3, height: 3},
        textShadowRadius: 4,
    },
    title_login: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        textAlign: 'center',
    },
    mini_title: {
        fontSize: 14,
        marginBottom: 20,
        color: 'gray',
        textAlign: 'center',
    },
    starr: {
        width: 20,
        height: 20
    },
    title_input: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        marginBottom: 8
    },
    box: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    forget_password: {
        marginTop: 10,
        marginBottom: 20,
        color: '#00b2ee',
        textAlign: 'right',
    },
    button_login: {
        backgroundColor: 'lightgray',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
