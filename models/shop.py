#!/usr/bin/python3
"""
Defines a shop object
"""

from models.base import BaseModel, Base
from sqlalchemy import Column, Integer,String, ForeignKey
from sqlalchemy.orm import relationship
from models.user import User
import models


class Shop(BaseModel, Base):
    """
    Defines a Shop Model
    """
    __tablename__ = 'shops'
    country = Column(String(64), nullable=True)
    title = Column(String(64), nullable=True)
    link = Column(String(64), nullable=True)
    phone = Column(String(13), nullable=True)
    user = Column(String(64), ForeignKey('users.id'), nullable=False)

    def __init__(self, *args, **kwargs):
        """
        Initializes a Shop Instance
        """
        super().__init__(*args, **kwargs)

    @property
    def categories(self):
        """
        Return the categories list for the shop
        """
        from models.category import Category
        categories = models.storage.filter_by(Category, 'shop', self.id)
        return categories