#!/usr/bin/python3
"""
Defines a user object
"""

import models
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    """
    Defines a User Model
    """
    __tablename__ = 'users'
    username = Column(String(64), nullable=False)
    passwd = Column(String(64), nullable=False)

    def __init__(self, *args, **kwargs):
        """
        Initializes a User Instance
        """
        super().__init__(*args, **kwargs)

    def check_password(self, password):
        return True

    @property
    def shops(self):
        """
        Return the stored shop for this user
        """
        from models.shop import Shop
        shops = models.storage.filter_by(Shop, 'user', self.id)
        return shops