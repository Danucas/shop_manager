#!/usr/bin/python3
"""
This module manage the Orders transactions, storing and fetch
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
from datetime import datetime


@app_shop.route('/orders',
                methods=['POST'],
                strict_slashes=False)
@token_required
def create_order():
    """
    Create a new order by placing products and client
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: shop
        required: true
        schema:
          type: object
          parameters:
            id:
              type: integer
      - in: query
        name: total
        required: true
        schema:
          type: integer
    responses:
      200:
        description: Successfully created the order
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Success
    """
    user = request.user
    shop = storage.get(User, user).shops[0]
    in_order = request.get_json()
    order = Order()
    order.date = str(datetime.utcnow())
    order.description = json.dumps(in_order['shop'])
    order.total = in_order['total']
    order.shop = shop.id
    order.origin = 'admin'
    client = storage.get(Client, shop.client)
    if client:
        order.client = client.id
    else:
        client = Client()
        client.username = shop.title
        client.email = storage.get(User, user).username
        client.phone = shop.phone
        order.client = client.id
        client.save()
    order.save()
    print()
    return jsonify(message='Success')


@app_shop.route('/orders',
                methods=['GET'],
                strict_slashes=False)
@token_required
def get_orders():
    """
    Return a list of stored orders in a shop
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        shema:
          type: string
    responses:
      200:
        description: a list of order instances
        schema:
          type: array
          items:
            type: object
            paremeters:
              id:
                type: string
                example: qwqe23rf3-34f234f234-234-f234-f2-34f-f34234f2
              origin:
                type: string
                example: admin
              client:
                type: string
                example: q32d123d12-d123d12d31-d312d-312d312d321d32
              description:
                type: object
                parameters:
                  21r3134f43r23-r234-v23423432-4v234v2:
                    type: integer
                    example: 3
              total:
                type: integer
                example: 4000
              shop:
                type: string
                example: 23r4r234wfe-234d234f23-423f42-3f423f43243
    """
    us = request.user
    user = storage.get(User, us)
    shop = user.shops[0]
    orders = shop.orders
    response = []
    for order in orders:
        orde = order.to_dict()
        orde['description'] = json.loads(orde['description'])
        response.append(orde)
    return Response(json.dumps(response), mimetype='application/json')
