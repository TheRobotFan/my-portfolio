import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ShoppingList,
    ShoppingItem,
    ShoppingListContextType,
    FilterOptions,
    SortOption,
    SuggestedItem,
    ItemUnit,
} from '../types';

const STORAGE_KEY = '@grocery_app_lists';

export const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

interface ShoppingListProviderProps {
    children: ReactNode;
}

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
    const [lists, setLists] = useState<ShoppingList[]>([]);
    const [activeListId, setActiveListId] = useState<string | null>(null);

    // Load lists from AsyncStorage on mount
    useEffect(() => {
        loadLists();
    }, []);

    // Save lists to AsyncStorage whenever they change
    useEffect(() => {
        if (lists.length > 0) {
            saveLists();
        }
    }, [lists]);

    const loadLists = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert date strings back to Date objects
                const listsWithDates = parsed.map((list: any) => ({
                    ...list,
                    createdAt: new Date(list.createdAt),
                    updatedAt: new Date(list.updatedAt),
                    items: list.items.map((item: any) => ({
                        ...item,
                        addedAt: new Date(item.addedAt),
                    })),
                }));
                setLists(listsWithDates);
            }
        } catch (error) {
            console.error('Error loading lists:', error);
        }
    };

    const saveLists = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
        } catch (error) {
            console.error('Error saving lists:', error);
        }
    };

    const generateId = () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const calculateTotals = (items: ShoppingItem[]) => {
        const totalItems = items.length;
        const totalPrice = items.reduce((sum, item) => {
            return sum + (item.price ? item.price * item.quantity : 0);
        }, 0);
        return { totalItems, totalPrice };
    };

    // List operations
    const createList = (name: string, store?: string): ShoppingList => {
        const newList: ShoppingList = {
            id: generateId(),
            name,
            store,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: [],
            totalItems: 0,
            totalPrice: 0,
            isCompleted: false,
        };

        setLists((prev) => [newList, ...prev]);
        setActiveListId(newList.id);
        return newList;
    };

    const updateList = (id: string, updates: Partial<ShoppingList>) => {
        setLists((prev) =>
            prev.map((list) =>
                list.id === id
                    ? { ...list, ...updates, updatedAt: new Date() }
                    : list
            )
        );
    };

    const deleteList = (id: string) => {
        setLists((prev) => prev.filter((list) => list.id !== id));
        if (activeListId === id) {
            setActiveListId(null);
        }
    };

    const setActiveList = (id: string | null) => {
        setActiveListId(id);
    };

    const getListById = (id: string): ShoppingList | undefined => {
        return lists.find((list) => list.id === id);
    };

    // Item operations
    const addItem = (
        listId: string,
        itemData: Omit<ShoppingItem, 'id' | 'addedAt' | 'isChecked'>
    ) => {
        const newItem: ShoppingItem = {
            ...itemData,
            id: generateId(),
            addedAt: new Date(),
            isChecked: false,
        };

        setLists((prev) =>
            prev.map((list) => {
                if (list.id === listId) {
                    const updatedItems = [...list.items, newItem];
                    const totals = calculateTotals(updatedItems);
                    return {
                        ...list,
                        items: updatedItems,
                        ...totals,
                        updatedAt: new Date(),
                    };
                }
                return list;
            })
        );
    };

    const updateItem = (
        listId: string,
        itemId: string,
        updates: Partial<ShoppingItem>
    ) => {
        setLists((prev) =>
            prev.map((list) => {
                if (list.id === listId) {
                    const updatedItems = list.items.map((item) =>
                        item.id === itemId ? { ...item, ...updates } : item
                    );
                    const totals = calculateTotals(updatedItems);
                    return {
                        ...list,
                        items: updatedItems,
                        ...totals,
                        updatedAt: new Date(),
                    };
                }
                return list;
            })
        );
    };

    const deleteItem = (listId: string, itemId: string) => {
        setLists((prev) =>
            prev.map((list) => {
                if (list.id === listId) {
                    const updatedItems = list.items.filter((item) => item.id !== itemId);
                    const totals = calculateTotals(updatedItems);
                    return {
                        ...list,
                        items: updatedItems,
                        ...totals,
                        updatedAt: new Date(),
                    };
                }
                return list;
            })
        );
    };

    const toggleItemChecked = (listId: string, itemId: string) => {
        setLists((prev) =>
            prev.map((list) => {
                if (list.id === listId) {
                    const updatedItems = list.items.map((item) =>
                        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
                    );
                    const allChecked = updatedItems.length > 0 && updatedItems.every((item) => item.isChecked);
                    return {
                        ...list,
                        items: updatedItems,
                        isCompleted: allChecked,
                        updatedAt: new Date(),
                    };
                }
                return list;
            })
        );
    };

    // Utility functions
    const getFilteredItems = (listId: string, filters: FilterOptions): ShoppingItem[] => {
        const list = getListById(listId);
        if (!list) return [];

        let filtered = [...list.items];

        // Filter by search query
        if (filters.searchQuery && filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter((item) => {
                const nameMatch = item.name.toLowerCase().includes(query);
                const notesMatch = item.notes?.toLowerCase().includes(query);
                return nameMatch || notesMatch;
            });
        }

        // Filter by categories
        if (filters.categories && filters.categories.length > 0) {
            filtered = filtered.filter((item) => filters.categories!.includes(item.category));
        }

        // Filter by price range
        if (filters.priceRange) {
            filtered = filtered.filter((item) => {
                if (!item.price) return false;
                return (
                    item.price >= filters.priceRange!.min &&
                    item.price <= filters.priceRange!.max
                );
            });
        }

        // Filter by checked status
        if (filters.showChecked === false) {
            filtered = filtered.filter((item) => !item.isChecked);
        }

        return filtered;
    };

    const getSortedItems = (items: ShoppingItem[], sortBy: SortOption): ShoppingItem[] => {
        const sorted = [...items];

        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'category':
                return sorted.sort((a, b) => a.category.localeCompare(b.category));
            case 'price':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'dateAdded':
                return sorted.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
            default:
                return sorted;
        }
    };

    const getSuggestedItems = (limit: number = 6): SuggestedItem[] => {
        // Aggregate all items from all lists
        const itemMap = new Map<string, {
            category: string;
            unit: ItemUnit;
            count: number;
            totalQuantity: number;
            totalPrice: number;
            priceCount: number;
            lastAdded: Date;
        }>();

        lists.forEach(list => {
            list.items.forEach(item => {
                const key = item.name.toLowerCase();
                const existing = itemMap.get(key);

                if (existing) {
                    existing.count++;
                    existing.totalQuantity += item.quantity;
                    if (item.price) {
                        existing.totalPrice += item.price;
                        existing.priceCount++;
                    }
                    if (item.addedAt > existing.lastAdded) {
                        existing.lastAdded = item.addedAt;
                        existing.category = item.category;
                        existing.unit = item.unit;
                    }
                } else {
                    itemMap.set(key, {
                        category: item.category,
                        unit: item.unit,
                        count: 1,
                        totalQuantity: item.quantity,
                        totalPrice: item.price || 0,
                        priceCount: item.price ? 1 : 0,
                        lastAdded: item.addedAt,
                    });
                }
            });
        });

        // Convert to SuggestedItem array and sort
        const suggestions: SuggestedItem[] = Array.from(itemMap.entries())
            .map(([name, data]) => ({
                name,
                category: data.category,
                unit: data.unit,
                frequency: data.count,
                lastAdded: data.lastAdded,
                avgQuantity: Math.round(data.totalQuantity / data.count),
                avgPrice: data.priceCount > 0 ? data.totalPrice / data.priceCount : undefined,
            }))
            .sort((a, b) => {
                // Sort by frequency first, then by recency
                if (b.frequency !== a.frequency) {
                    return b.frequency - a.frequency;
                }
                return b.lastAdded.getTime() - a.lastAdded.getTime();
            })
            .slice(0, limit);

        return suggestions;
    };

    const value: ShoppingListContextType = {
        lists,
        activeListId,
        createList,
        updateList,
        deleteList,
        setActiveList,
        getListById,
        addItem,
        updateItem,
        deleteItem,
        toggleItemChecked,
        getFilteredItems,
        getSortedItems,
        getSuggestedItems,
    };

    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
};
