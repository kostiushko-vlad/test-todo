import { Todo } from '@/types/todo';
import { useTodoStore } from '@/store/todoStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoStore();

  const handleToggle = async () => {
    await toggleTodo(todo.id);
  };

  const handleDelete = async () => {
    if (confirm('Möchten Sie dieses Todo wirklich löschen?')) {
      await deleteTodo(todo.id);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-base ${
                todo.completed
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={`text-sm mt-1 ${
                  todo.completed
                    ? 'line-through text-muted-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {todo.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
