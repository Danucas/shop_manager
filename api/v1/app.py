#!/usr/bin/python3
"""
Initializes the API server
"""

from api.v1.auth import app_auth
from api.v1.shop import app_shop
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from functools import wraps
import jwt
from models import storage
from models.product import Product
from models.user import User
from models.auth import CachedUser
from models.order import Order
from models.client import Client
from flasgger import Swagger, LazyJSONEncoder, LazyString
from api.v1.docs import template


app = Flask(__name__)
app.register_blueprint(app_auth)
app.register_blueprint(app_shop)

app.json_encoder = LazyJSONEncoder
swagger = Swagger(app, template=template)

app.config['SECRET_KEY'] = 'thisisasecretkey'
CORS(app)


@app.teardown_appcontext
def teardown(exception):
    """Teardown trigger"""
    print(exception)
    storage.close()

if __name__ == '__main__':
    storage.reload()
    app.run(host="0.0.0.0", port='8080')