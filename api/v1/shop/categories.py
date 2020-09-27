#!/usr/bin/python3
"""
API Shop Manager Categories endpoints
"""

from api.v1.shop import app_shop
from api.v1.auth import token_required
from flask import request, jsonify, Response
from models import storage
from models.user import User
from models.shop import Shop
from models.category import Category
import json

@app_shop.route('/categories',
                methods=['POST'],
                strict_slashes=False)
@token_required
def create_category():
    """
    Creates a new category linked to a shop linked to a user
    create a shop if the user doesn't have one
    """
    state = request.get_json()
    user = request.user
    # tests the input values
    print(state)
    if not state['title'] or not state['description']:
        return jsonify(message=""), 400
    # verify the store for the user
    shops = storage.filter_by(Shop, 'user', user)
    shop = None
    for shp in shops:
        if shp.user == user:
            shop = shp
    # if shop doesn't exists create a new instance
    if not shop:
        shop = Shop()
        shop.user = user
        shop.save()
    # Create the Category instance
    category = Category()
    category.title = state['title']
    category.description = state['description']
    category.shop = shop.id
    category.save()
    return jsonify(id=category.id)


@app_shop.route('/categories',
                methods=['GET'],
                strict_slashes=False)
def all_categories():
    """
    Return all categories for the registered user
    """
    try:
        shop = storage.filter_by(Shop, 'user', request.user)[0]
        categories = shop.categories
        categories = [category.to_dict() for category in categories]
        return Response(json.dumps(categories), mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(json.dumps('[]'), mimetype='application/json')