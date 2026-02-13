"""Database engine and session setup."""
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from config import get_settings

settings = get_settings()

# Convert postgresql:// to postgresql+asyncpg:// for async support
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(
    database_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

async_session = async_sessionmaker(engine, expire_on_commit=False)

Base = declarative_base()


async def init_db():
    """Create all tables from ORM models."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Dependency for FastAPI routes."""
    async with async_session() as session:
        yield session
