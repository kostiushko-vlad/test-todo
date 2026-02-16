from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from database import get_db
from models.todo import Todo
from schemas.todo import TodoCreate, TodoUpdate, TodoResponse, TodoListResponse

router = APIRouter()


@router.get("/api/todos", response_model=TodoListResponse)
async def get_todos(
    page: int = 1,
    page_size: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get all todos with pagination"""
    offset = (page - 1) * page_size
    
    # Get total count
    count_query = select(func.count(Todo.id))
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()
    
    # Get todos
    query = select(Todo).order_by(Todo.created_at.desc()).offset(offset).limit(page_size)
    result = await db.execute(query)
    todos = result.scalars().all()
    
    return TodoListResponse(
        items=todos,
        total=total,
        page=page,
        page_size=page_size
    )


@router.post("/api/todos", response_model=TodoResponse, status_code=201)
async def create_todo(
    todo_data: TodoCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new todo"""
    todo = Todo(
        title=todo_data.title,
        description=todo_data.description
    )
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo


@router.put("/api/todos/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: UUID,
    todo_data: TodoUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a todo"""
    query = select(Todo).where(Todo.id == todo_id)
    result = await db.execute(query)
    todo = result.scalar_one_or_none()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    if todo_data.title is not None:
        todo.title = todo_data.title
    if todo_data.description is not None:
        todo.description = todo_data.description
    if todo_data.completed is not None:
        todo.completed = todo_data.completed
    
    await db.commit()
    await db.refresh(todo)
    return todo


@router.delete("/api/todos/{todo_id}", status_code=204)
async def delete_todo(
    todo_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a todo"""
    query = select(Todo).where(Todo.id == todo_id)
    result = await db.execute(query)
    todo = result.scalar_one_or_none()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    await db.delete(todo)
    await db.commit()
    return None
