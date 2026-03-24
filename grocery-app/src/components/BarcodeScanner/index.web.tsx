import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { theme } from '../../theme';

interface BarcodeScannerProps {
    onBarcodeScanned: (data: string) => void;
    children?: React.ReactNode;
    zoom?: number; // Not used on web for now, kept for interface compatibility
    enableTorch?: boolean; // Not used on web for now
}

export default function BarcodeScanner({ onBarcodeScanned, children }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    // Use a unique ID for the scanner element
    const scannerId = "html5-qrcode-reader";

    useEffect(() => {
        // Initialize the scanner
        // We need to ensure the element exists before initializing
        const timeout = setTimeout(() => {
            if (!scannerRef.current) {
                const formatsToSupport = [
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39,
                ];

                const html5QrcodeScanner = new Html5QrcodeScanner(
                    scannerId,
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        formatsToSupport: formatsToSupport,
                        showTorchButtonIfSupported: true,
                        rememberLastUsedCamera: true
                    },
                    /* verbose= */ false
                );

                scannerRef.current = html5QrcodeScanner;

                const onScanSuccess = (decodedText: string, decodedResult: any) => {
                    // Stop scanning after successful scan to avoid multiple triggers
                    html5QrcodeScanner.clear().then(() => {
                        onBarcodeScanned(decodedText);
                    }).catch(err => {
                        console.error("Failed to clear scanner", err);
                        // Even if clear fails, we should still notify success
                        onBarcodeScanned(decodedText);
                    });
                };

                const onScanFailure = (error: any) => {
                    // handle scan failure, usually better to ignore and keep scanning.
                    // console.warn(`Code scan error = ${error}`);
                };

                html5QrcodeScanner.render(onScanSuccess, onScanFailure);
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear().catch(error => {
                        console.error("Failed to clear html5-qrcode scanner during cleanup", error);
                    });
                } catch (e) {
                    console.error("Error cleaning up scanner", e);
                }
            }
        };
    }, [onBarcodeScanned]);

    return (
        <View style={styles.container}>
            <View style={styles.webContainer}>
                <View style={styles.scannerWrapper}>
                    <div id={scannerId} style={{ width: '100%', maxWidth: '500px' }} />
                </View>
                <Text style={styles.hint}>
                    Request camera permissions if prompted.
                </Text>

                {/* Overlay for UI elements */}
                <View style={styles.webOverlayContainer} pointerEvents="box-none">
                    {children}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    webContainer: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    scannerWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        minHeight: 300
    },
    hint: {
        color: '#fff',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.8
    },
    webOverlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
});
