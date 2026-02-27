import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface SavedKey {
    id: string;
    name: string;
    secret: string;
    addedAt: number;
}

const STORAGE_KEY = '2fa-saved-keys';

export function useSavedKeys() {
    const [savedKeys, setSavedKeys] = useState<SavedKey[]>(() => {
        try {
            const item = window.localStorage.getItem(STORAGE_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage for saved keys', error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedKeys));
        } catch (error) {
            console.warn('Error setting localStorage for saved keys', error);
        }
    }, [savedKeys]);

    const saveKey = (name: string, secret: string) => {
        setSavedKeys((prev) => {
            // Check if a key with the exact same secret already exists to avoid duplicates
            // Alternatively, we could just allow duplicates or update the name.
            // Let's allow duplicates but give them new IDs for simplicity, 
            // though typically you might want to prevent exactly duplicate secrets.
            const newKey: SavedKey = {
                id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
                name,
                secret,
                addedAt: Date.now(),
            };
            return [...prev, newKey];
        });
    };

    const deleteKey = (id: string) => {
        setSavedKeys((prev) => prev.filter((key) => key.id !== id));
    };

    return { savedKeys, saveKey, deleteKey };
}
