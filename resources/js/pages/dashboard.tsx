import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, AlertCircle, BarChart2} from 'lucide-react';
import { Task } from '@/types/Task';
import { Category } from '@/types/Category';
interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  overdue: number;
  due_today: number;
}

interface CategoryStats {
  id: number;
  name: string;
  count: number;
}

interface PriorityStats {
  priority: string;
  count: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const STATUS_COLORS = {
    pending: '#94a3b8',
    in_progress: '#3b82f6',
    completed: '#22c55e',
};

export default function Dashboard({categories}: {categories: Category[]}) {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    in_progress: 0,
    pending: 0,
    overdue: 0,
    due_today: 0,
  });
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [priorityStats, setPriorityStats] = useState<PriorityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [tasksResponse, statsResponse] = await Promise.all([
          axios.get('/api/tasks'),
          axios.get('/api/dashboard/stats'),
        ]);

        setTasks(tasksResponse.data.tasks);
        
        const sortedTasks = [...tasksResponse.data.tasks];
        
        const recent = sortedTasks
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5);
          
        const upcoming = sortedTasks
          .filter(t => t.status !== 'completed' && new Date(t.due_date) >= new Date())
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
          .slice(0, 5);
          
        setRecentTasks(recent);
        setUpcomingTasks(upcoming);
        
        // Set stats
        setTaskStats(statsResponse.data.taskStats);
        setCategoryStats(statsResponse.data.categoryStats);
        setPriorityStats(statsResponse.data.priorityStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (task: Task) => {
    if (isOverdue(task.due_date, task.status)) {
      return '#ef4444';
    }
    return STATUS_COLORS[task.status];
  };
  
  return (
    
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <BarChart2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completed} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="h-4 w-4 text-blue-500">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((taskStats.in_progress / taskStats.total) * 100) || 0}% of total tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <div className="h-4 w-4 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.due_today} due today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <div className="h-4 w-4 text-green-500">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((taskStats.completed / taskStats.total) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {taskStats.pending} still to do
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-1">
                  {isLoading ? (
                    <p>Loading upcoming tasks...</p>
                  ) : upcomingTasks.length === 0 ? (
                    <p className="text-muted-foreground">No upcoming tasks</p>
                  ) : (
                    upcomingTasks.map(task => (
                      <div key={task.id} className="flex items-center p-3 border rounded-md">
                        <div className="mr-4">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getStatusColor(task) }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{task.title}</h4>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <span className="mr-2">Due: {formatDate(task.due_date)}</span>
                            <span className="mr-2">•</span>
                            <span className="capitalize">
                            {task.category ? (
                              task.category.name
                            ) : (
                              <span className="text-muted-foreground">No category</span>
                            )}
                            </span>
                          </div>
                        </div>
                        <div 
                          className="px-2 py-1 text-xs font-medium rounded-full" 
                          style={{ 
                            backgroundColor: PRIORITY_COLORS[task.priority], 
                            color: 'white' 
                          }}
                        >
                          {task.priority}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="space-y-1">
                  {isLoading ? (
                    <p>Loading recent tasks...</p>
                  ) : recentTasks.length === 0 ? (
                    <p className="text-muted-foreground">No recent tasks</p>
                  ) : (
                    recentTasks.map(task => (
                      <div key={task.id} className="flex items-center p-3 border rounded-md">
                        <div className="mr-4">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getStatusColor(task) }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{task.title}</h4>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <span>{formatStatus(task.status)}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">
                            {task.category ? (
                              task.category.name
                            ) : (
                              <span className="text-muted-foreground">No category</span>
                            )}
                            </span>
                          </div>
                        </div>
                        <div 
                          className="px-2 py-1 text-xs font-medium rounded-full" 
                          style={{ 
                            backgroundColor: PRIORITY_COLORS[task.priority], 
                            color: 'white' 
                          }}
                        >
                          {task.priority}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}