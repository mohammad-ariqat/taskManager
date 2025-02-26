import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/auth-layout';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/Category';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

interface CreateTaskProps extends SharedData {
  categories: Category[];
}
const { auth } = usePage<SharedData>().props;
export default function Create({ auth, categories }: CreateTaskProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    category_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('tasks.store'));
  };

  return (
    <AuthenticatedLayout
      title='Create Task'
      description="Create a new task and assign it to a category."
    >
      <Head title="Create Task" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    className="mt-1 block w-full"
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
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
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
                    className="mt-1 block w-full"
                    value={data.due_date}
                    onChange={(e) => setData('due_date', e.target.value)}
                  />
                  <InputError message={errors.due_date} className="mt-2" />
                </div>

                <div className="mb-4">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
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
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
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

                <div className="flex items-center justify-end mt-4">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={processing}
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}