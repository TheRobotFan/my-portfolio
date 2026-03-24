import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useShoppingLists } from '../hooks/useShoppingLists';

interface CreateListModalProps {
    visible: boolean;
    onClose: () => void;
    onCreated?: (listId: string) => void;
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
    visible,
    onClose,
    onCreated,
}) => {
    const { createList } = useShoppingLists();
    const [listName, setListName] = useState('');
    const [store, setStore] = useState('');

    const handleCreate = () => {
        if (listName.trim()) {
            const newList = createList(listName.trim(), store.trim() || undefined);
            setListName('');
            setStore('');
            onCreated?.(newList.id);
            onClose();
        }
    };

    const handleClose = () => {
        setListName('');
        setStore('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose}
                />

                <View style={styles.modal}>
                    <LinearGradient
                        colors={theme.colors.primary.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <Text style={styles.title}>Create Shopping List</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    <View style={styles.content}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>List Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Weekly Groceries"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={listName}
                                onChangeText={setListName}
                                autoFocus
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Store (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Walmart, Target"
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={store}
                                onChangeText={setStore}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleCreate}
                            disabled={!listName.trim()}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={
                                    listName.trim()
                                        ? theme.colors.primary.gradient
                                        : ['#D1D5DB', '#9CA3AF'] as const
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.createButton}
                            >
                                <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
                                <Text style={styles.createButtonText}>Create List</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
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
        overflow: 'hidden',
        ...theme.shadows.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
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
        paddingBottom: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
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
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: 8,
        marginTop: theme.spacing.md,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
});
