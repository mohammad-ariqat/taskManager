import React from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Category } from '@/types/Category';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, SharedData } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Task } from '@/types/Task';

interface EditTaskProps extends SharedData {
  categories: Category[];
  task: Task;
}

export default function Edit({ categories, task }: EditTaskProps) {
  const { data, setData, patch, processing, errors } = useForm({
    title: task.title, 
    description: task.description || '',
    due_date: task.due_date || '',
    priority: task.priority,
    category_id: task.category_id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('tasks.update', task.id));
  };
const breadcrumbs: BreadcrumbItem[] = [

      {
          title: 'Create Task',
          href: '/tasks/create',
      },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Task" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className=" overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-black border-b">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    className="bg-accent mt-1 block w-full "
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                  />
                  <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="mt-1 bg-accent block w-full  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    className="mt-1 block w-full bg-accent"
                    value={data.due_date}
                    onChange={(e) => setData('due_date', e.target.value)}
                  />
                  <InputError message={errors.due_date} className="mt-2" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="bg-accent mt-1 block w-full focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    value={data.priority}
                    onChange={(e) => setData('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <InputError message={errors.priority} className="mt-2" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="category_id"  >Category</Label>
                  <select
                    id="category_id"
                    className="bg-accent mt-1 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.category_id} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4 gap-2">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={processing}
                  >
                    Update Task
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.get(route('tasks.index'))}
                    className="bg-amber-400 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
                    disabled={processing}
                  >
                     cancel
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