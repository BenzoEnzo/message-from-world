import React from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (

        <ImageBackground
            source={require('@/assets/images/background.webp')}
            style={styles.imageBackground}
            resizeMode="cover"
        >
            <View style={styles.contentContainer}>
                {children}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        width: width,
        height: height,
    },
    overlayGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    }
});