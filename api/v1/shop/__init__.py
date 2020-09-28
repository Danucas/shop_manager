#!/usr/bin/python3
"""
API Shop Managment app
"""

from flask import Blueprint, jsonify, request, current_app
import jwt
from functools import wraps

app_shop = Blueprint(
    'api_shop',
    __name__,
    url_prefix='/api/shop'
)

from api.v1.shop.categories import *
from api.v1.shop.products import *
from api.v1.shop.orders import *
from api.v1.shop.shop import *
