from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey,Boolean
from sqlalchemy.orm import sessionmaker, declarative_base
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)


class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    place = Column(String, nullable=False)


class MyAtlas(Base):
    __tablename__ = "myatlas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("account.id"), nullable=False)
    place = Column(String, nullable=False)
    visited = Column(Boolean, default=False, nullable=False)