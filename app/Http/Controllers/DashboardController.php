<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Task stats
        $now = Carbon::now();
        $today = Carbon::today();
        
        $taskStats = [
            'total' => Task::count(),
            'completed' => Task::where('status', 'completed')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'pending' => Task::where('status', 'pending')->count(),
            'overdue' => Task::where('status', '!=', 'completed')
                ->where('due_date', '<', $now)
                ->count(),
            'due_today' => Task::where('status', '!=', 'completed')
                ->whereDate('due_date', $today)
                ->count(),
        ];

        // Category stats
        $categoryStats = Category::select('categories.id', 'categories.name')
            ->selectRaw('COUNT(tasks.id) as count')
            ->leftJoin('tasks', 'categories.id', '=', 'tasks.category_id')
            ->groupBy('categories.id', 'categories.name')
            ->get();

        // Priority stats
        $priorityStats = DB::table('tasks')
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->get();

        return response()->json([
            'taskStats' => $taskStats,
            'categoryStats' => $categoryStats,
            'priorityStats' => $priorityStats,
        ]);
    }
}