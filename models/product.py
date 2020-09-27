#!/usr/bin/python3
"""
Defines a product object
"""

from models.base import BaseModel, Base
from sqlalchemy import Column, Integer,String, ForeignKey
from sqlalchemy.orm import relationship
from models.category import Category


class Product(BaseModel, Base):
    """
    Defines a Product Object
    """
    __tablename__ = 'products'
    title = Column(String(64), nullable=False)
    description = Column(String(128), nullable=False)
    price = Column(Integer, default=0)
    category = Column(String(64), ForeignKey('categories.id'), nullable=True)
    image = Column(String(256), nullable=True)

    def __init__(self, *args, **kwargs):
        """
        Initializes a Product Instance
        """
        super().__init__(*args, **kwargs)
