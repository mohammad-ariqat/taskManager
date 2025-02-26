<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with('category')
            ->where('user_id', Auth::id())
            ->orderBy('due_date')
            ->get();
            
        $categories = Category::where('user_id', Auth::id())->get();
            
        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::where('user_id', Auth::id())->get();
        
        return Inertia::render('Tasks/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'category_id' => 'nullable|exists:categories,id',
        ]);
        
        $validated['user_id'] = Auth::id();
        $validated['status'] = 'pending';
        
        Task::create($validated);
        
        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        // Check if the task belongs to the user
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }
        
        $categories = Category::where('user_id', Auth::id())->get();
        
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        // Check if the task belongs to the user
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high'])],
            'status' => ['sometimes', 'required', Rule::in(['pending', 'in_progress', 'completed'])],
            'category_id' => 'nullable|exists:categories,id',
        ]);
        
        $task->update($validated);
        
        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Check if the task belongs to the user
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }
        
        $task->delete();
        
        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}