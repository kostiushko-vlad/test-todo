import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Todo App
          </h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Aufgaben effizient
          </p>
        </header>

        <div className="space-y-8">
          <TodoForm />
          <TodoList />
        </div>
      </div>
    </div>
  );
}

export default App;
