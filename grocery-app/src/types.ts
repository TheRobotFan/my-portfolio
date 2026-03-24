export type ItemUnit = 'pcs' | 'kg' | 'lbs' | 'oz' | 'g' | 'ml' | 'l';

export type ItemCategory = string;

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    unit: ItemUnit;
    price?: number;
    category: ItemCategory;
    store?: string;
    notes?: string;
    isChecked: boolean;
    addedAt: Date;
}

export interface SuggestedItem {
    name: string;
    category: string;
    unit: ItemUnit;
    frequency: number;
    lastAdded: Date;
    avgQuantity: number;
    avgPrice?: number;
}

export interface ShoppingList {
    id: string;
    name: string;
    store?: string;
    createdAt: Date;
    updatedAt: Date;
    items: ShoppingItem[];
    totalItems: number;
    totalPrice: number;
    isCompleted: boolean;
}

export interface FilterOptions {
    searchQuery?: string;
    categories?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
    showChecked?: boolean;
}

export type SortOption = 'name' | 'category' | 'price' | 'dateAdded';

export interface ShoppingListContextType {
    lists: ShoppingList[];
    activeListId: string | null;

    // List operations
    createList: (name: string, store?: string) => ShoppingList;
    updateList: (id: string, updates: Partial<ShoppingList>) => void;
    deleteList: (id: string) => void;
    setActiveList: (id: string | null) => void;
    getListById: (id: string) => ShoppingList | undefined;

    // Item operations
    addItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'addedAt' | 'isChecked'>) => void;
    updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
    deleteItem: (listId: string, itemId: string) => void;
    toggleItemChecked: (listId: string, itemId: string) => void;

    // Utility functions
    getFilteredItems: (listId: string, filters: FilterOptions) => ShoppingItem[];
    getSortedItems: (items: ShoppingItem[], sortBy: SortOption) => ShoppingItem[];
    getSuggestedItems: (limit?: number) => SuggestedItem[];
}
