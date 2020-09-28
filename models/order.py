#!/usr/bin/python3
"""
Defines a Order object
"""

import models
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.category import Category
from models.product import Product
from models.client import Client
import json


class Order(BaseModel, Base):
    """
    Defines a Product Object
    """
    __tablename__ = 'orders'
    date = Column(String(64), nullable=False)
    origin = Column(String(64), nullable=False)
    client = Column(
        String(64),
        nullable=False)
    description = Column(String(8000), nullable=False)
    total = Column(String(10), default=0)
    shop = Column(
        String(64),
        ForeignKey('shops.id', ondelete='CASCADE'),
        nullable=False)

    def __init__(self, *args, **kwargs):
        """
        Initializes a Product Instance
        """
        super().__init__(*args, **kwargs)

    @property
    def products(self):
        """
        Return all instances stored for this Order
        """
        products = json.loads(self.description)
        print(products)
        for prod in products.keys():
            last = products[prod]
            products[prod] = {}
            db_prod = models.storage.get(Product, prod)
            if db_prod:
                products[prod]['count'] = last
                products[prod]['total'] = last * float(db_prod.price)
        # print(products)
        return products