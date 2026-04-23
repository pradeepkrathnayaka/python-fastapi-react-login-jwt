import logging

from sqlalchemy.orm import Session

from src.db.base import Base
from src.db.session import engine

logger = logging.getLogger("app")


def init_db(db: Session) -> None:
    # Import all models so SQLAlchemy registers them before create_all
    from src.models import user, token  # noqa: F401

    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created / verified")

    _seed_superuser(db)


def _seed_superuser(db: Session) -> None:
    from src.models.user import User
    from src.core.security import get_password_hash

    existing = db.query(User).filter(User.email == "admin@example.com").first()
    if existing:
        return

    admin = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("Admin@123456"),
        full_name="Administrator",
        is_active=True,
        is_superuser=True,
    )
    db.add(admin)
    db.commit()
    logger.info("Default admin user created (admin@example.com / Admin@123456)")
