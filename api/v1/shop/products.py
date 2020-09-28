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
from models.user import User
from models.category import Category
from models import storage


@app_shop.route('/products',
                methods=['POST'],
                strict_slashes=False)
@token_required
def create_product():
    """
    Creates a new product linked to a category
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: title
        required: true
        schema:
          type: string
      - in: query
        name: description
        required: true
        schema:
          type: string
      - in: query
        name: category
        required: true
        schema:
          type: string
      - in: query
        name: price
        required: true
        schema:
          type: integer
      - in: query
        name: category
        required: true
        schema:
          type: atring
      - in: query
        name: image
        required: true
        schema:
          type: string
    responses:
      200:
        description: success at storing the new Product
        schema:
          type: object
          parameters:
            id:
              type: string
              example: 23refe34r23-4r234r-234r234r234r-r23423r4
            shop:
              type: boolean
              example: true
    """
    user = storage.get(User, request.user)
    state = request.get_json()
    product = Product()
    product.title = state['title']
    product.description = state['description']
    product.category = state['category']
    product.price = str(state['price'])
    # check the values
    imagePath = '/usr/src/app/api/v1/shop/images/{}.b64'.format(product.id)
    print(request.user)
    with open(imagePath, 'w') as imageFile:
        imageFile.write(state['image'])
    product.image = imagePath
    product.save()
    # print(state)
    if not user.shops[0].country:
        return jsonify(shop='true')
    return jsonify(id=product.id)


@app_shop.route('/products',
                methods=['GET'],
                strict_slashes=False)
@token_required
def get_products():
    """
    Return a list of products for the shop
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
    responses:
      200:
        description: return a list of productos for the user's shop
        schema:
          type: array
          items:
            type: object
            parameters:
              id:
                type: string
                example: 12dwqe3f42-f423f-432-4f23-432-324f234f2
              title:
                type: string
                example: any name for a product
              description:
                type: string
                example: any description for a product
              category:
                type: string
                example: any category for a product
              price:
                type: integer
                example: 45000
              image:
                type: string
                example: any name for a product
      404:
        description: shop not found
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
            try:
                with open(p_dict['image'], 'r') as img_file:
                    p_dict['image'] = img_file.read()
            except Exception as e:
                print('Image preservation Error')
                print('image from a Product is no longer available')
                print('Try Uploading a new one')
                p_dict['image'] = 'no image'
            p_dict['category_str'] = cat.title
            prods.append(p_dict)
    return Response(json.dumps(prods), mimetype='application/json')


@app_shop.route('/products',
                methods=['PATCH'],
                strict_slashes=False)
@token_required
def patch_product():
    """
    Updates some attributes for a product
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: id
        required: true
        schema:
          type: string
    responses:
      200:
        description: successfully updated product
        schema:
          type: object
          parameters:
            id:
              type: string
              example: 12dwqe3f42-f423f-432-4f23-432-324f234f2
      404:
        description: error not found
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Not found
    """
    in_instance = request.get_json()
    user = storage.get(User, request.user)
    product = None
    for cat in user.shops[0].categories:
        for prod in cat.products:
            if prod.id == in_instance['id']:
                product = prod
    # Check if the user owns the product
    print(in_instance)
    if product:
        if 'title' in in_instance:
            product.title = in_instance['title']
        if 'description' in in_instance:
            product.description = in_instance['description']
        if 'price' in in_instance:
            product.price = int(float(in_instance['price']))
        if 'category' in in_instance:
            product.category = in_instance['category']
        if 'image' in in_instance:
            imagePath = '/usr/src/app/api/v1/shop/images/{}.b64'
            imagePath = imagePath.format(product.id)
            print(request.user)
            with open(imagePath, 'w') as imageFile:
                imageFile.write(in_instance['image'])
            product.image = imagePath
        product.save()
        return jsonify(id=product.id)
    return jsonify(message='Not found'), 404


@app_shop.route('/products',
                methods=['DELETE'],
                strict_slashes=False)
@token_required
def delete_product():
    """
    Deletes a product instance
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: id
        required: true
        schema:
          type: string
    responses:
      200:
        description: successfully deleted product
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Success
      404:
        description: error not found
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Not found
    """
    _id = request.get_json()['id']
    user = storage.get(User, request.user)
    product = None
    for cat in user.shops[0].categories:
        for prod in cat.products:
            if prod.id == _id:
                product = prod
    print(_id)
    if product:
        storage.delete(product)
        storage.save()
        return jsonify(message='Success')
    return jsonify(message='Not found'), 404