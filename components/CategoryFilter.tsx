'use client';

import { Category } from '@/app/page';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

const DEFAULT_CATEGORY_IDS = ['general', 'work', 'personal', 'shopping'];

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  onDeleteCategory,
}: CategoryFilterProps) {
  const isDefaultCategory = (categoryId: string) => DEFAULT_CATEGORY_IDS.includes(categoryId);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => {
          const canDelete = onDeleteCategory && !isDefaultCategory(category.id);
          return (
            <div key={category.id} className="relative group">
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  selectedCategory === category.id
                    ? { backgroundColor: category.color }
                    : {}
                }
              >
                {category.name}
              </button>
              {canDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete category "${category.name}"?`)) {
                      onDeleteCategory(category.id);
                    }
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete category"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
