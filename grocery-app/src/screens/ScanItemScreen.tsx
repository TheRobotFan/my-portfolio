import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { theme } from '../theme';
import BarcodeScanner from '../components/BarcodeScanner';

export default function ScanItemScreen() {
    const navigation = useNavigation();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(0);
    const [torch, setTorch] = useState(false);


    const handleBarCodeScanned = async (data: string) => {
        if (scanned || loading) return;
        setScanned(true);
        setLoading(true);

        try {
            // Fetch product data from OpenFoodFacts
            const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);

            if (response.data.status === 1) {
                const product = response.data.product;
                const productName = product.product_name || product.product_name_en || 'Unknown Product';
                const brands = product.brands || '';
                const category = 'Other';

                Alert.alert(
                    'Product Found',
                    `${productName}\n${brands}`,
                    [
                        {
                            text: 'Add to List',
                            onPress: () => {
                                navigation.navigate('Dashboard' as never, {
                                    scannedItem: {
                                        name: productName,
                                        category,
                                        notes: brands
                                    }
                                } as never);
                            }
                        },
                        { text: 'Scan Again', onPress: () => { setScanned(false); setLoading(false); } }
                    ]
                );

            } else {
                Alert.alert('Product Not Found', 'Could not find details for this barcode.', [
                    { text: 'Scan Again', onPress: () => { setScanned(false); setLoading(false); } }
                ]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch product details.', [
                { text: 'Scan Again', onPress: () => { setScanned(false); setLoading(false); } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BarcodeScanner
            onBarcodeScanned={handleBarCodeScanned}
            zoom={zoom}
            enableTorch={torch}
        >
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <MaterialIcons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Scan Barcode</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setTorch(!torch);
                        }}
                        style={styles.closeButton}
                    >
                        <MaterialIcons name={torch ? "flash-on" : "flash-off"} size={28} color={torch ? "#FFD700" : "#fff"} />
                    </TouchableOpacity>
                </View>

                <View style={styles.scanAreaContainer}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.instructions}>Point camera at a barcode</Text>

                    <View style={styles.zoomContainer}>
                        {[0.01, 0.2, 0.5].map((zoomValue, index) => {
                            const label = index === 0 ? '1x' : index === 1 ? '2x' : '5x';
                            const isActive = zoom === zoomValue;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setZoom(zoomValue)}
                                    style={[styles.zoomButton, isActive && styles.activeZoomButton]}
                                >
                                    <Text style={[styles.zoomText, isActive && styles.activeZoomText]}>{label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {loading && (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Fetching product details...</Text>
                    </View>
                )}
            </View>
        </BarcodeScanner>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        // Background color is handled by the BarcodeScanner/CameraView
        justifyContent: 'space-between',
        // Make sure overlay covers everything if needed, but BarcodeScanner puts it as children
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    scanAreaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: theme.colors.primary.main,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    instructions: {
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
    },
    zoomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 25,
        padding: 4,
        gap: 8,
    },
    zoomButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    activeZoomButton: {
        backgroundColor: '#fff',
    },
    zoomText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    activeZoomText: {
        color: '#000',
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: theme.colors.primary.main,
        fontWeight: '600',
    },
});
