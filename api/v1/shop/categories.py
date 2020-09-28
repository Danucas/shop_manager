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
    Creates a new category linked to a shop
    create a shop if the user doesn't have one
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
    responses:
      200:
        description: the category was saved succefully
        schema:
          type: object
          parameters:
            id:
              type: string
              example: 1239102941-1231290412-dfs12rf-123re-1234r223
      400:
        description: incomplete request
        schema:
          type: object
          parameters:
            message:
              type: string
              example: incomplete request
    """
    state = request.get_json()
    user = request.user
    # tests the input values
    print(state)
    if not state['title'] or not state['description']:
        return jsonify(message="incomplete request"), 400
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
@token_required
def all_categories():
    """
    Return all categories for the registered user
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
    responses:
      200:
        description: the category was saved succefully
        schema:
          type: array
          items:
            type: object
            parameters:
              id:
                type: string
                example: 1241234r34532-4523-4532-46245-456345634563
              title:
                type: string
                example: any category stored
              description:
                type: string
                example: any description for this category
    """
    try:
        shop = storage.filter_by(Shop, 'user', request.user)[0]
        categories = shop.categories
        categories = [category.to_dict() for category in categories]
        return Response(json.dumps(categories), mimetype='application/json')
    except Exception as e:
        print(e)
        return Response(json.dumps([]), mimetype='application/json')


@app_shop.route('/categories',
                methods=['PATCH'],
                strict_slashes=False)
@token_required
def patch_category():
    """
    Updates some attributes for a category instance
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: id
        required: false
        schema:
          type: string
      - in: query
        name: title
        required: false
        schema:
          type: string
      - in: query
        name: description
        required: false
        schema:
          type: string
    responses:
      200:
        description: succesfully update the category instance
        schema:
          type: object
          properties:
            message:
              type: string
              example: Success
    """
    in_instance = request.get_json()
    user = storage.get(User, request.user)
    for cat in user.shops[0].categories:
        if cat.id == in_instance['id']:
            if 'title' in in_instance:
                cat.title = in_instance['title']
            if 'description' in in_instance:
                cat.description = in_instance['description']
            cat.save()
        print(in_instance)
    return jsonify(message='Success')


@app_shop.route('/categories',
                methods=['DELETE'],
                strict_slashes=False)
@token_required
def delete_category():
    """
    Deletes a category in cascade remove all products attached to it
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
        description: successfully delete it
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Success
      404:
        description: the category doesn't exists
        schema:
          type: object
          parameters:
            message:
              type: string
              example: Not found
    """
    _id = request.get_json()['id']
    print(_id)
    user = storage.get(User, request.user)
    for cat in user.shops[0].categories:
        if cat.id == _id:
            storage.delete(cat)
            storage.save()
            return jsonify(message='Success')
    return jsonify(message='Not found'), 404