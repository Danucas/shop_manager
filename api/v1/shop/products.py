#!/usr/bin/python3
"""
API Shop Manager Products endpoints
"""

from api.v1.shop import app_shop
from api.v1.auth import token_required
from flask import request, jsonify, Response
import json
from models.product import Product
from models.shop import Shop
from models.category import Category
from models import storage

@app_shop.route('/products',
                methods=['POST'],
                strict_slashes=False)
@token_required
def create_product():
    """
    Creates a new category linked to a shop linked to a user
    create a shop if the user doesn't have one
    """
    state = request.get_json()

    product = Product()
    product.title = state['title']
    product.description = state['description']
    product.category = state['category_id']
    product.price = int(state['price'])
    # check the values
    imagePath = '/usr/src/app/api/v1/shop/images/{}.b64'.format(product.id)
    print(request.user)
    with open(imagePath, 'w') as imageFile:
        imageFile.write(state['image'])
    product.image = imagePath
    product.save()
    # print(state)
    return jsonify(id=product.id)


@app_shop.route('/products',
                methods=['GET'],
                strict_slashes=False)
@token_required
def get_products():
    """
    Return a list of products for the shop
    """
    user = request.user
    shop = storage.filter_by(Shop, 'user', user)
    if not shop:
        return jsonify(message='Shop is not found'), 404
    categories = shop[0].categories
    prods = []
    for cat in categories:
        for prod in cat.products:
            p_dict = prod.to_dict()
            with open(p_dict['image'], 'r') as img_file:
                p_dict['image'] = img_file.read()
            prods.append(p_dict)
    return Response(json.dumps(prods), mimetype='application/json')