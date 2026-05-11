from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from models import Base

DATABASE_URL = "sqlite:///./restaurant.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
    )
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)