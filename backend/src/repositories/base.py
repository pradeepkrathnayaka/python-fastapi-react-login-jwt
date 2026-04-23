from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], db: Session) -> None:
        self.model = model
        self.db = db

    def get(self, id: int) -> ModelType | None:
        return self.db.scalar(select(self.model).where(self.model.id == id))

    def get_all(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        return list(
            self.db.scalars(select(self.model).offset(skip).limit(limit))
        )

    def delete(self, id: int) -> ModelType | None:
        obj = self.get(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
