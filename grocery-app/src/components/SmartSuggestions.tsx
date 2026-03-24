import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SuggestedItem, ShoppingList } from '../types';
import { useShoppingLists } from '../hooks/useShoppingLists';

interface SmartSuggestionsProps {
    suggestions: SuggestedItem[];
    onAddToList: (item: SuggestedItem, listId: string) => void;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
    suggestions,
    onAddToList,
}) => {
    const { lists } = useShoppingLists();
    const [selectedItem, setSelectedItem] = useState<SuggestedItem | null>(null);
    const [showListSelector, setShowListSelector] = useState(false);

    if (suggestions.length === 0) return null;

    const handleAddPress = (item: SuggestedItem) => {
        setSelectedItem(item);
        if (lists.length === 1) {
            // If only one list, add directly
            onAddToList(item, lists[0].id);
        } else if (lists.length > 0) {
            // Show list selector
            setShowListSelector(true);
        } else {
            // No lists (edge case, but handled)
            alert('Please create a shopping list first.');
        }
    };

    const handleListSelect = (listId: string) => {
        if (selectedItem) {
            onAddToList(selectedItem, listId);
            setShowListSelector(false);
            setSelectedItem(null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="auto-awesome" size={24} color={theme.colors.secondary.main} />
                    <Text style={styles.title}>Smart Suggestions</Text>
                </View>
                <Text style={styles.subtitle}>Based on your history</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {suggestions.map((item, index) => (
                    <View key={`${item.name}-${index}`} style={styles.card}>
                        <LinearGradient
                            colors={['#ffffff', '#f9fafb']}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryText}>{item.category}</Text>
                                </View>
                                <View style={styles.frequencyBadge}>
                                    <MaterialIcons name="repeat" size={12} color={theme.colors.primary.main} />
                                    <Text style={styles.frequencyText}>{item.frequency}</Text>
                                </View>
                            </View>

                            <Text style={styles.itemName} numberOfLines={2}>
                                {item.name}
                            </Text>

                            <View style={styles.cardFooter}>
                                <Text style={styles.itemMeta}>
                                    {item.avgQuantity} {item.unit}
                                </Text>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => handleAddPress(item)}
                                >
                                    <LinearGradient
                                        colors={theme.colors.primary.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.addButtonGradient}
                                    >
                                        <MaterialIcons name="add" size={20} color="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={showListSelector}
                transparent
                animationType="fade"
                onRequestClose={() => setShowListSelector(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowListSelector(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add to List</Text>
                        <Text style={styles.modalSubtitle}>
                            Where should we add "{selectedItem?.name}"?
                        </Text>
                        <ScrollView style={styles.listSelector}>
                            {lists.map((list) => (
                                <TouchableOpacity
                                    key={list.id}
                                    style={styles.listItem}
                                    onPress={() => handleListSelect(list.id)}
                                >
                                    <View style={styles.listItemIcon}>
                                        <MaterialIcons
                                            name="shopping-bag"
                                            size={24}
                                            color={theme.colors.primary.main}
                                        />
                                    </View>
                                    <View style={styles.listItemContent}>
                                        <Text style={styles.listItemName}>{list.name}</Text>
                                        <Text style={styles.listItemCount}>
                                            {list.totalItems} items
                                        </Text>
                                    </View>
                                    <MaterialIcons
                                        name="chevron-right"
                                        size={24}
                                        color={theme.colors.text.tertiary}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    subtitle: {
        fontSize: 12,
        color: theme.colors.text.secondary,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
        gap: 12,
    },
    card: {
        width: 160,
        height: 140,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
        backgroundColor: theme.colors.background.white,
    },
    cardGradient: {
        flex: 1,
        borderRadius: theme.borderRadius.lg,
        padding: 12,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    categoryBadge: {
        backgroundColor: theme.colors.background.secondary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 10,
        color: theme.colors.text.secondary,
        fontWeight: '500',
    },
    frequencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#ECFDF5', // green-50
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    frequencyText: {
        fontSize: 10,
        color: theme.colors.primary.main,
        fontWeight: '600',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginVertical: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemMeta: {
        fontSize: 12,
        color: theme.colors.text.secondary,
    },
    addButton: {
        ...theme.shadows.sm,
    },
    addButtonGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    modalContent: {
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        maxHeight: '60%',
        ...theme.shadows.xl,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    listSelector: {
        maxHeight: 300,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    listItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ECFDF5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    listItemContent: {
        flex: 1,
    },
    listItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    listItemCount: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
});
