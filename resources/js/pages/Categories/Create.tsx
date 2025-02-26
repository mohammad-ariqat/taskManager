import React from 'react';
import { Head, useForm} from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Category } from '@/types/Category';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, SharedData } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';


export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    color: '#3b82f6', // Default to a blue color
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('categories.store'));
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Create Category',
      href: '/categories/create',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Category" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-black border-b">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-1 block w-full bg-accent"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="color">Color</Label>
                  <div className="mt-1 flex items-center gap-4">
                    <Input
                      id="color"
                      type="color"
                      className="h-10 w-16 p-1 cursor-pointer"
                      value={data.color}
                      onChange={(e) => setData('color', e.target.value)}
                    />
                    <Input
                      type="text"
                      className="bg-accent"
                      value={data.color}
                      onChange={(e) => setData('color', e.target.value)}
                      placeholder="#RRGGBB"
                    />
                    <div 
                      className="w-10 h-10 rounded" 
                      style={{ backgroundColor: data.color }}
                      aria-label="Color preview"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a color or enter a hex color code
                  </p>
                  <InputError message={errors.color} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={processing}
                  >
                    Create Category
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}