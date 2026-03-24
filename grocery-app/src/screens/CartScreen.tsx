import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useShoppingLists } from '../hooks/useShoppingLists';
import { CreateListModal } from '../components/CreateListModal';
import { ListDetailModal } from '../components/ListDetailModal';
import { ShoppingListCard } from '../components/ShoppingListCard';

export default function CartScreen() {
    const { lists, setActiveList } = useShoppingLists();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);
    const [showCompleted, setShowCompleted] = useState(true);

    const activeLists = lists.filter((list) => !list.isCompleted);
    const completedLists = lists.filter((list) => list.isCompleted);
    const displayLists = showCompleted ? lists : activeLists;

    const handleListPress = (listId: string) => {
        setActiveList(listId);
        setSelectedListId(listId);
    };

    const handleListCreated = (listId: string) => {
        setActiveList(listId);
        setSelectedListId(listId);
    };

    return (
        <>
            <View style={styles.container}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={theme.colors.primary.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerSubtitle}>My Shopping</Text>
                            <Text style={styles.headerTitle}>Lists</Text>
                        </View>
                        <View style={styles.cartBadgeContainer}>
                            <MaterialIcons name="shopping-cart" size={32} color="#fff" />
                            {lists.length > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{lists.length}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </LinearGradient>

                {/* Filter Controls */}
                {lists.length > 0 && (
                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setShowCompleted(!showCompleted)}
                        >
                            <MaterialIcons
                                name={showCompleted ? 'visibility' : 'visibility-off'}
                                size={20}
                                color={theme.colors.primary.main}
                            />
                            <Text style={styles.filterText}>
                                {showCompleted ? 'Hide Completed' : 'Show All'}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.statsChip}>
                            <Text style={styles.statsText}>
                                {activeLists.length} active • {completedLists.length} completed
                            </Text>
                        </View>
                    </View>
                )}

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {displayLists.length === 0 ? (
                        /* Empty State */
                        <View style={styles.emptyStateContainer}>
                            <LinearGradient
                                colors={['#F9FAFB', '#F3F4F6'] as const}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.emptyStateGradient}
                            >
                                <View style={styles.emptyIconContainer}>
                                    <MaterialIcons name="shopping-basket" size={64} color={theme.colors.primary.main} />
                                </View>
                                <Text style={styles.emptyTitle}>
                                    {lists.length === 0 ? 'No lists yet' : 'No active lists'}
                                </Text>
                                <Text style={styles.emptyText}>
                                    {lists.length === 0
                                        ? 'Create your first shopping list to get started'
                                        : 'All your lists are completed!'}
                                </Text>

                                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowCreateModal(true)}>
                                    <LinearGradient
                                        colors={theme.colors.primary.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.startShoppingButton}
                                    >
                                        <MaterialIcons name="add-shopping-cart" size={24} color="#fff" />
                                        <Text style={styles.startShoppingText}>Create New List</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    ) : (
                        /* Lists Display */
                        <>
                            {activeLists.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Active Lists</Text>
                                    {activeLists.map((list) => (
                                        <ShoppingListCard
                                            key={list.id}
                                            list={list}
                                            onPress={() => handleListPress(list.id)}
                                        />
                                    ))}
                                </View>
                            )}

                            {showCompleted && completedLists.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Completed</Text>
                                    {completedLists.map((list) => (
                                        <ShoppingListCard
                                            key={list.id}
                                            list={list}
                                            onPress={() => handleListPress(list.id)}
                                        />
                                    ))}
                                </View>
                            )}
                        </>
                    )}

                    {/* Tips Section */}
                    {lists.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.featureCard}>
                                <View style={styles.featureIconContainer}>
                                    <MaterialIcons name="lightbulb" size={24} color={theme.colors.accent.orange} />
                                </View>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>Shopping Tip</Text>
                                    <Text style={styles.featureText}>
                                        Check off items as you shop to track your progress
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Floating Add Button */}
                <TouchableOpacity
                    style={styles.fab}
                    activeOpacity={0.8}
                    onPress={() => setShowCreateModal(true)}
                >
                    <LinearGradient
                        colors={theme.colors.primary.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.fabGradient}
                    >
                        <MaterialIcons name="add" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <CreateListModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleListCreated}
            />

            <ListDetailModal
                visible={selectedListId !== null}
                listId={selectedListId}
                onClose={() => setSelectedListId(null)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: theme.spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    cartBadgeContainer: {
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: theme.colors.status.error,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: '#fff',
    },
    cartBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.background.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary.main,
    },
    statsChip: {
        backgroundColor: theme.colors.background.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statsText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 100,
    },
    emptyStateContainer: {
        marginTop: theme.spacing.lg,
    },
    emptyStateGradient: {
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    startShoppingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: theme.borderRadius.full,
        gap: 8,
        ...theme.shadows.md,
    },
    startShoppingText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    section: {
        marginTop: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        ...theme.shadows.sm,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        lineHeight: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        borderRadius: 32,
        ...theme.shadows.xl,
    },
    fabGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
