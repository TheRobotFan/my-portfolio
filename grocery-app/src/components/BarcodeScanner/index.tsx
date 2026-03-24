import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as IntentLauncher from 'expo-intent-launcher';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface BarcodeScannerProps {
    onBarcodeScanned: (data: string) => void;
    children?: React.ReactNode;
    zoom?: number;
    enableTorch?: boolean;
}

export default function BarcodeScanner({ onBarcodeScanned, children, zoom = 0, enableTorch = false }: BarcodeScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    <MaterialIcons name="camera-alt" size={64} color={theme.colors.text.tertiary} style={{ marginBottom: 20 }} />
                    <Text style={styles.message}>We need your permission to use the camera for scanning.</Text>

                    <Text style={{ color: '#666', fontSize: 12, marginBottom: 20, textAlign: 'center' }}>
                        Status: {permission.status} | Can Ask: {permission.canAskAgain ? 'Yes' : 'No'}
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, { marginBottom: 12 }]}
                        onPress={requestPermission}
                    >
                        <Text style={styles.buttonText}>Request Permission</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#444' }]}
                        onPress={() => {
                            if (Platform.OS === 'android') {
                                IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS);
                            } else {
                                Linking.openSettings();
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Open System Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                autofocus="on"
                zoom={zoom}
                enableTorch={enableTorch}
                mode="video"
                onBarcodeScanned={(result) => onBarcodeScanned(result.data)}
                barcodeScannerSettings={{
                    barcodeTypes: [
                        "ean13",
                        "ean8",
                        "upc_a",
                        "upc_e",
                        "qr",
                        "code128",
                        "code39",
                        "aztec",
                        "pdf417"
                    ]
                }}
            >
                {children}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    message: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    button: {
        backgroundColor: theme.colors.primary.main,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    camera: {
        flex: 1,
    },
});
