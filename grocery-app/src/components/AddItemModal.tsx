import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { ItemCategory, ItemUnit } from '../types';

interface AddItemModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (item: {
        name: string;
        quantity: number;
        unit: ItemUnit;
        price?: number;
        category: ItemCategory;
        store?: string;
        notes?: string;
    }) => void;
}


const UNITS: ItemUnit[] = ['pcs', 'kg', 'lbs', 'oz', 'g', 'ml', 'l'];

export const AddItemModal: React.FC<AddItemModalProps> = ({ visible, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unit, setUnit] = useState<ItemUnit>('pcs');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');

    const handleAdd = () => {
        if (name.trim()) {
            onAdd({
                name: name.trim(),
                quantity: parseFloat(quantity) || 1,
                unit,
                price: price ? parseFloat(price) : undefined,
                category,
                notes: notes.trim() || undefined,
            });
            resetForm();
            onClose();
        }
    };

    const resetForm = () => {
        setName('');
        setQuantity('1');
        setUnit('pcs');
        setPrice('');
        setCategory('');
        setNotes('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

                <View style={styles.modal}>
                    <LinearGradient
                        colors={theme.colors.primary.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <Text style={styles.title}>Add Item</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Item Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Apples"
                                value={name}
                                onChangeText={setName}
                                autoFocus
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Quantity</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Unit</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScroll}>
                                    {UNITS.map((u) => (
                                        <TouchableOpacity
                                            key={u}
                                            style={[styles.unitChip, unit === u && styles.unitChipActive]}
                                            onPress={() => setUnit(u)}
                                        >
                                            <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>{u}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Price (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Category</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Fruits, Vegetables, Dairy"
                                value={category}
                                onChangeText={setCategory}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Notes (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Any additional notes..."
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleAdd}
                            disabled={!name.trim()}
                            activeOpacity={0.8}
                            style={{ marginBottom: 20 }}
                        >
                            <LinearGradient
                                colors={name.trim() ? theme.colors.primary.gradient : ['#D1D5DB', '#9CA3AF'] as const}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.addButton}
                            >
                                <MaterialIcons name="add" size={24} color="#fff" />
                                <Text style={styles.addButtonText}>Add Item</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        backgroundColor: theme.colors.background.white,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        maxHeight: '90%',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: theme.spacing.lg,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    unitScroll: {
        flexDirection: 'row',
    },
    unitChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.background.secondary,
        marginRight: 8,
    },
    unitChipActive: {
        backgroundColor: theme.colors.primary.main,
    },
    unitText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    unitTextActive: {
        color: '#fff',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: 8,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});
