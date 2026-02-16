import { useEffect } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { TodoItem } from './TodoItem';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TodoList() {
  const { todos, loading, error, fetchTodos } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (todos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Keine Todos vorhanden. Erstellen Sie Ihr erstes Todo!
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {completedCount} von {todos.length} erledigt
      </div>
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
