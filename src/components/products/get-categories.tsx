// src/components/products/get-categories.tsx

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/lib/products';
import { Loader2 } from 'lucide-react';

interface GetCategoriesProps {
    onSelectCategory?: (category: string) => void;
    selectedCategory?: string;
}

export default function GetCategories({ onSelectCategory, selectedCategory }: Readonly<GetCategoriesProps>) {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchCategories();
                // Ensure data is an array
                setCategories(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Failed to load categories:', err);
                setError(err instanceof Error ? err.message : 'Failed to load categories');
                setCategories([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const handleSelectCategory = (category: string) => {
        onSelectCategory?.(category);
        setIsOpen(false);
    };

    if (loading) {
        return (
            <div className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr)/50">
                <Loader2 className="w-3 h-3 animate-spin mx-auto" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-sm text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="relative sec-ff">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff cursor-pointer hover:border-(--pry-clr) transition-colors flex items-center justify-between"
            >
                <span className={!selectedCategory ? 'text-(--pry-clr)/50' : ''}>
                    {selectedCategory || "Select a category"}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            
            {isOpen && categories && categories.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                        <div
                            key={category}
                            onClick={() => handleSelectCategory(category)}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                                selectedCategory === category ? 'bg-(--prof-clr)/10 text-(--prof-clr)' : 'text-(--pry-clr)'
                            }`}
                        >
                            {category}
                        </div>
                    ))}
                </div>
            )}
            
            {isOpen && categories?.length === 0 && !loading && !error && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <div className="px-3 py-2 text-sm text-(--pry-clr)/50">
                        No categories available
                    </div>
                </div>
            )}
        </div>
    );
}