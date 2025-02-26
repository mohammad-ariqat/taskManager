import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BreadcrumbItem, SharedData } from '@/types';

import { Category } from '@/types/Category';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface CategoriesIndexProps extends SharedData {
  categories: Category[];
}

export default function Index({ categories }: CategoriesIndexProps) {
 
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      router.delete(route('categories.destroy', id));
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Categories',
      href: '/categories',
    },
  ];
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />
      <div className="py-0 sm:px-6 lg:px-8">
        <div className="">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-violet-800 border-b border-gray-200">
              <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <Link href={route('categories.create')}>
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add New category
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-6 h-6 rounded-full border border-gray-300" 
                              style={{ backgroundColor: category.color }}
                              aria-label={`Color: ${category.color}`}
                            />
                            <span className="text-sm text-gray-700">
                              {category.color}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={route('categories.edit', category.id)}>
                              <Button className="bg-blue-500 hover:bg-blue-700 text-white">
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              className="bg-red-500 hover:bg-red-700 text-white" 
                              onClick={() => handleDelete(category.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}