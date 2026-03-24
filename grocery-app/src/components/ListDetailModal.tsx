import React, { useState, useMemo } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useShoppingLists } from '../hooks/useShoppingLists';
import { AddItemModal } from './AddItemModal';
import { FilterSearchPanel } from './FilterSearchPanel';
import { SortOption } from '../types';

interface ListDetailModalProps {
    visible: boolean;
    listId: string | null;
    onClose: () => void;
}

export const ListDetailModal: React.FC<ListDetailModalProps> = ({ visible, listId, onClose }) => {
    const { getListById, deleteList, toggleItemChecked, deleteItem, addItem, getSortedItems } = useShoppingLists();
    const [showAddItem, setShowAddItem] = useState(false);
    const [showChecked, setShowChecked] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState<SortOption>('dateAdded');

    const list = listId ? getListById(listId) : null;

    // Extract unique categories from list items
    const uniqueCategories = useMemo(() => {
        if (!list) return [];
        const categories = new Set(list.items.map(item => item.category).filter(Boolean));
        return Array.from(categories).sort();
    }, [list?.items]);

    // Apply filters and sorting
    const filteredAndSortedItems = useMemo(() => {
        if (!list) return [];
        let items = [...list.items];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter((item) => {
                const nameMatch = item.name.toLowerCase().includes(query);
                const notesMatch = item.notes?.toLowerCase().includes(query);
                return nameMatch || notesMatch;
            });
        }

        // Filter by categories
        if (selectedCategories.length > 0) {
            items = items.filter((item) => selectedCategories.includes(item.category));
        }

        // Filter by price range
        const minPrice = priceRange.min ? parseFloat(priceRange.min) : null;
        const maxPrice = priceRange.max ? parseFloat(priceRange.max) : null;
        if (minPrice !== null || maxPrice !== null) {
            items = items.filter((item) => {
                if (!item.price) return false;
                if (minPrice !== null && item.price < minPrice) return false;
                if (maxPrice !== null && item.price > maxPrice) return false;
                return true;
            });
        }

        // Filter by checked status
        if (!showChecked) {
            items = items.filter((item) => !item.isChecked);
        }

        // Apply sorting
        return getSortedItems(items, sortBy);
    }, [list?.items, searchQuery, selectedCategories, priceRange, showChecked, sortBy, getSortedItems]);

    // Calculate active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery.trim()) count++;
        if (selectedCategories.length > 0) count++;
        if (priceRange.min || priceRange.max) count++;
        if (!showChecked) count++;
        if (sortBy !== 'dateAdded') count++;
        return count;
    }, [searchQuery, selectedCategories, priceRange, showChecked, sortBy]);

    const handleDeleteList = () => {
        deleteList(list.id);
        onClose();
    };

    const handleDeleteItem = (itemId: string, itemName: string) => {
        deleteItem(list.id, itemId);
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setPriceRange({ min: '', max: '' });
        setSortBy('dateAdded');
        setShowChecked(true);
    };

    if (!list) return null;

    return (
        <>
            <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={theme.colors.primary.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <View style={styles.headerTop}>
                            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                                <MaterialIcons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeleteList} style={styles.deleteButton}>
                                <MaterialIcons name="delete" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.listName}>{list.name}</Text>
                        {list.store && (
                            <View style={styles.storeContainer}>
                                <MaterialIcons name="store" size={16} color="rgba(255,255,255,0.9)" />
                                <Text style={styles.storeText}>{list.store}</Text>
                            </View>
                        )}
                        <View style={styles.statsContainer}>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>{list.totalItems}</Text>
                                <Text style={styles.statLabel}>Items</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>${list.totalPrice.toFixed(2)}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {list.items.filter((i) => i.isChecked).length}
                                </Text>
                                <Text style={styles.statLabel}>Checked</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    <FilterSearchPanel
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        categories={uniqueCategories}
                        selectedCategories={selectedCategories}
                        onCategoryToggle={handleCategoryToggle}
                        priceRange={priceRange}
                        onPriceRangeChange={setPriceRange}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        showChecked={showChecked}
                        onShowCheckedToggle={() => setShowChecked(!showChecked)}
                        onClearFilters={handleClearFilters}
                        activeFilterCount={activeFilterCount}
                    />

                    <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                        {filteredAndSortedItems.length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="inbox" size={64} color={theme.colors.text.tertiary} />
                                <Text style={styles.emptyText}>
                                    {activeFilterCount > 0 ? 'No items match your filters' : showChecked ? 'No items yet' : 'All items checked!'}
                                </Text>
                            </View>
                        ) : (
                            filteredAndSortedItems.map((item) => (
                                <View
                                    key={item.id}
                                    style={[styles.itemCard, item.isChecked && styles.itemCardChecked]}
                                >
                                    <TouchableOpacity
                                        onPress={() => toggleItemChecked(list.id, item.id)}
                                        style={styles.checkbox}
                                    >
                                        <MaterialIcons
                                            name={item.isChecked ? 'check-box' : 'check-box-outline-blank'}
                                            size={24}
                                            color={item.isChecked ? theme.colors.primary.main : theme.colors.text.tertiary}
                                        />
                                    </TouchableOpacity>

                                    <View style={styles.itemContent}>
                                        <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
                                            {item.name}
                                        </Text>
                                        <View style={styles.itemMeta}>
                                            <Text style={styles.itemQuantity}>
                                                {item.quantity} {item.unit}
                                            </Text>
                                            {item.price && (
                                                <>
                                                    <Text style={styles.dot}>•</Text>
                                                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                                                </>
                                            )}
                                            <Text style={styles.dot}>•</Text>
                                            <Text style={styles.itemCategory}>{item.category}</Text>
                                        </View>
                                        {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteItem(item.id, item.name)}
                                        style={styles.deleteItemButton}
                                    >
                                        <MaterialIcons name="close" size={20} color={theme.colors.text.tertiary} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => setShowAddItem(true)}
                        activeOpacity={0.8}
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
            </Modal>

            <AddItemModal
                visible={showAddItem}
                onClose={() => setShowAddItem(false)}
                onAdd={(itemData) => addItem(list.id, itemData)}
            />
        </>
    );
};

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
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    deleteButton: {
        padding: 4,
    },
    listName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    storeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    storeText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    itemsList: {
        flex: 1,
        padding: theme.spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginTop: 16,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.sm,
    },
    itemCardChecked: {
        opacity: 0.6,
    },
    checkbox: {
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    itemNameChecked: {
        textDecorationLine: 'line-through',
        color: theme.colors.text.secondary,
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    itemQuantity: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    dot: {
        color: theme.colors.text.tertiary,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary.main,
    },
    itemCategory: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
    },
    itemNotes: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: 4,
        fontStyle: 'italic',
    },
    deleteItemButton: {
        padding: 4,
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
