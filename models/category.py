#!/usr/bin/python3
"""
Defines a category object
"""

from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.shop import Shop
import models


class Category(BaseModel, Base):
    """
    Defines a Category Model
    """
    __tablename__ = 'categories'
    title = Column(String(64), nullable=False)
    description = Column(String(128), nullable=False)
    shop = Column(
        String(64),
        ForeignKey('shops.id',
                   ondelete='CASCADE'),
        nullable=False
    )

    def __init__(self, *args, **kwargs):
        """
        Initializes a Category Instance
        """
        super().__init__(*args, **kwargs)

    @property
    def products(self):
        """
        Return the products corresponding with this Category
        """
        from models.product import Product
        prods = models.storage.filter_by(Product, 'category', self.id)
        return prods
