#!/usr/bin/python3
"""
Base model for MSSQL SQL ORM
"""

import models
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import uuid
import json
from datetime import datetime

Base = declarative_base()

time = "%Y-%m-%dT%H:%M:%S.%f"


class BaseModel:
    """
    This model starts a new instance applying
    a uuid record
    """
    id = Column(String(64), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self):
        """Apply a new id"""
        self.id = str(uuid.uuid4())

    def save(self):
        """
        Saves the inherited object
        """
        models.storage.new(self)
        models.storage.save()

    def to_dict(self):
        """
        Returns a Json representation for the inherited model
        """
        dic = self.__dict__.copy()
        if '_sa_instance_state' in dic:
            del dic['_sa_instance_state']
        dic['created_at'] = dic['created_at'].strftime(time)
        dic['updated_at'] = dic['updated_at'].strftime(time)
        return dic