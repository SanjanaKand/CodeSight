from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    JSON,
    TIMESTAMP,
    func,
)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import relationship

from server.database import Base


# ----------------------------------------
# Users table
# ----------------------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
    )

    sessions = relationship(
        "CodeSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# ----------------------------------------
# Sessions table
# ----------------------------------------

class CodeSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    session_name = Column(String(150), nullable=False)
    language = Column(String(50), nullable=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    user = relationship(
        "User",
        back_populates="sessions",
    )

    snippets = relationship(
        "Snippet",
        back_populates="session",
        cascade="all, delete-orphan",
    )


# ----------------------------------------
# Snippets table
# ----------------------------------------

class Snippet(Base):
    __tablename__ = "snippets"

    id = Column(Integer, primary_key=True, autoincrement=True)

    session_id = Column(
        Integer,
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
    )

    code = Column(LONGTEXT, nullable=False)
    language = Column(String(50), nullable=False)
    ast_json = Column(JSON, nullable=True)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
    )

    session = relationship(
        "CodeSession",
        back_populates="snippets",
    )
