#!/usr/bin/python3
"""
Initializes the ORM engine
"""
from models.user import User
from models.product import Product
from models.category import Category
from models.shop import Shop
from models.auth import CachedUser

from models.engine.db_engine import DBEngine
storage = DBEngine()
storage.reload()
