#!/usr/bin/python3
"""
Defines a Client object
"""

import models
from models.base import BaseModel, Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
import json


class Client(BaseModel, Base):
    """
    This Client can buy
    """
    __tablename__ = 'clients'
    username = Column(String(64), nullable=False)
    email = Column(String(64), nullable=False)
    phone = Column(String(32), nullable=False)
