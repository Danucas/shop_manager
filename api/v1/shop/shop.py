#!/usr/bin/python3
"""
This module manage the Shop transactions, storing and fetch
"""

from api.v1.shop import app_shop
from api.v1.auth import token_required
from flask import request, jsonify, Response
from models import storage
from models.user import User
from models.shop import Shop
from models.category import Category
from models.order import Order
from models.client import Client
import json


@app_shop.route('/info',
                methods=['GET'],
                strict_slashes=False)
@token_required
def get_shop_info():
    """
    Return the first shop instance found for the user
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
    """
    user = storage.get(User, request.user)
    return Response(
        json.dumps(user.shops[0].to_dict()),
        mimetype='application/json')


@app_shop.route('/',
                methods=['PATCH'],
                strict_slashes=False)
@token_required
def update_shop():
    """
    Update the shop info
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: country
        required: false
        schema:
          type: string
      - in: query
        name: link
        required: false
        schema:
          type: string
      - in: query
        name: title
        required: false
        schema:
          type: string
      - in: query
        name: phone
        required: false
        schema:
          type: string
    responses:
      200:
        description: the shop was successfully updated
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Success
    """
    user = storage.get(User, request.user)
    shop_data = request.get_json()
    shop = user.shops[0]
    shop.country = shop_data['country']
    shop.title = shop_data['title']
    shop.phone = shop_data['phone']
    shop.link = shop_data['link']
    shop.save()
    return jsonify(message='Success')
