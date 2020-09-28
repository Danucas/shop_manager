#!/usr/bin/python3
"""
Defines a category object
"""

import models
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship


class CachedUser(BaseModel, Base):
    """
    This model stores a temporal user
    """
    __tablename__ = 'casers'
    user_id = Column(String(64), nullable=False)
    token = Column(String(400), nullable=False)

    def __init__(self, *args, **kwargs):
        """
        Defines a new CachedUser instance
        """
        super().__init__(*args, **kwargs)
