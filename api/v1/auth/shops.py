#!/usr/bin/python3
"""
Check and Handle the Auth flow
"""

from api.v1.auth import app_auth, token_required
from models import storage
from models.user import User
from models.auth import CachedUser
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta


@app_auth.route('/login',
                methods=['POST'],
                strict_slashes=False)
def login():
    """
    User login using jwt
    this checks the correct pass and username provided
    ---
    parameters:
      - in: query
        name: username
        required: true
        schema:
          type: string
      - in: query
        name: passwd
        required: true
        schema:
          type: string
    """
    print(request.get_json())
    user = request.get_json()['username']
    passwd = request.get_json()['passwd']
    user_check = storage.get_user(User, user)
    if not user:
        return jsonify(message='missing value'), 401
    if not user_check:
        return jsonify(message='error'), 401
    if user == user_check.username and passwd == user_check.passwd:
        token = jwt.encode(
            {
                'user_id': user_check.id,
                'exp': datetime.utcnow() + timedelta(minutes=60)
            },
            current_app.config['SECRET_KEY']
        )
        token = token.decode('UTF-8')
        return jsonify(token=token), 200
    if user == user_check.username and passwd != user_check.passwd:
        return jsonify(message='authorization failed'), 403
    return jsonify(message='authorization failed'), 403


@app_auth.route('/merged',
                methods=['POST'],
                strict_slashes=False)
@token_required
def formalize_user():
    """
    This method formalizes a temporal user into a permanent one
    ---
    parameters:
      - in: header
        name: authorization
        required: true
        schema:
          type: string
      - in: query
        name: username
        required: true
        schema:
          type: string
      - in: query
        name: passwd
        required: true
        schema:
          type: string
    responses:
      200:
        description: Succesfully merged the user with the temporal one
        schema:
          type: object
          properties:
            message:
              type: string
              example: Success
      309:
        description: an error occurred while merging the users
        schema:
          type: object
          properties:
            message:
              type: string
              example: Error creating user
    """
    print(request.get_json())
    username = request.get_json()['username']
    passwd = username = request.get_json()['passwd']
    # Check if the user exists by comparing the username
    # this contains the registered email
    existing_user = storage.filter_by(User, 'username', username)
    if not existing_user:
        user = storage.get(User, request.user)
        user.username = username
        user.passwd = passwd
        user.save()
        return jsonify(message='Success')
    return jsonify(message='Error creating user'), 309


@app_auth.route('/tmp_user',
                methods=['POST'],
                strict_slashes=False)
def tmp_user():
    """
    Create a temporal user
    Previous to the store creation
    you can get a temporal user and explore the App
    ---
    parameters:
      - in: query
        name: username
        required: true
        schema:
          type: string
      - in: query
        name: password
        required: true
        schema:
          type: string
    responses:
      200:
        description: use username and password to generate a jwt token
        schema:
          type: object
          properties:
            token:
              type: string
              example: 13fer78erfb82f8sbdubuf4y3f.34fu3nj4j3fjifuiu
      401:
        description: the user missed the username or the password
        schema:
          type: object
          properties:
            message:
              type: string
              example: Please include your username and password
    """
    user = request.values.get('username')
    passwd = request.values.get('password')
    if not user or not passwd:
        user = request.get_json()['username']
        passwd = request.get_json()['password']
    if not user or not passwd:
        return jsonify(
            message="Please include your username and password"), 401
    user_instance = User()
    user_instance.username = user
    user_instance.passwd = passwd
    token = jwt.encode(
        {
            'user_id': user_instance.id,
            'exp': datetime.utcnow() + timedelta(minutes=60)
        },
        current_app.config['SECRET_KEY']
    )
    token = token.decode('UTF-8')
    cached_user = CachedUser()
    cached_user.user_id = user_instance.id
    cached_user.token = token
    user_instance.save()
    cached_user.save()
    return jsonify(token=token, id=user_instance.id)


@app_auth.route('/test',
                methods=['GET'],
                strict_slashes=False)
@token_required
def test():
    """
    Testing endpoint
    """
    print(request.user)
    return 'Success'


@app_auth.route('/status')
@token_required
def auth_status():
    """
    Check the token validation from the client
    ---
    responses:
      200:
        description: means the user has access
        schema:
          type: object
          properties:
            message:
              type: string
              example: Success
    """
    return jsonify(message='Success')