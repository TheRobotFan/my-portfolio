import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { ShoppingList } from '../types';

interface ShoppingListCardProps {
    list: ShoppingList;
    onPress: () => void;
    onDelete?: () => void;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ list, onPress, onDelete }) => {
    const checkedItems = list.items.filter((item) => item.isChecked).length;
    const progress = list.totalItems > 0 ? (checkedItems / list.totalItems) * 100 : 0;

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                list.isCompleted && styles.completedCard,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <MaterialIcons
                        name={list.isCompleted ? 'check-circle' : 'shopping-basket'}
                        size={24}
                        color={list.isCompleted ? theme.colors.status.success : theme.colors.primary.main}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={styles.listName} numberOfLines={1}>
                        {list.name}
                    </Text>
                    {list.store && (
                        <View style={styles.storeContainer}>
                            <MaterialIcons name="store" size={14} color={theme.colors.text.secondary} />
                            <Text style={styles.storeText}>{list.store}</Text>
                        </View>
                    )}
                </View>
                {!onDelete && (
                    <MaterialIcons name="chevron-right" size={24} color={theme.colors.text.tertiary} />
                )}
                {onDelete && (
                    <TouchableOpacity
                        onPress={onDelete}
                        style={styles.deleteButton}
                        activeOpacity={0.6}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="delete-outline" size={24} color={theme.colors.status.error} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.footer}>
                <View style={styles.stats}>
                    <Text style={styles.statsText}>
                        {checkedItems}/{list.totalItems} items
                    </Text>
                    {list.totalPrice > 0 && (
                        <>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.priceText}>${list.totalPrice.toFixed(2)}</Text>
                        </>
                    )}
                </View>
                <Text style={styles.dateText}>{formatDate(list.updatedAt)}</Text>
            </View>

            {list.totalItems > 0 && (
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    completedCard: {
        opacity: 0.7,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    content: {
        flex: 1,
    },
    listName: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    storeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    storeText: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statsText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    dot: {
        color: theme.colors.text.tertiary,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.primary.main,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
    },
    progressBar: {
        height: 4,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: 2,
        marginTop: theme.spacing.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary.main,
        borderRadius: 2,
    },
    deleteButton: {
        padding: 4,
    },
});
