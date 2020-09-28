#!/usr/bin/python3
"""
Unittest for order model
"""

import unittest
from models import storage
from models.user import User
from models.shop import Shop
from models.client import Client
from models.order import Order
from models.category import Category
from models.product import Product
from tests.test_models.test_category import create_shop
import json

def create_product(shop):
    category = Category()
    category.title = 'test_title'
    category.description = 'test_description'
    category.shop = shop.id
    category.save()
    product = Product()
    product.title = 'test_title'
    product.description = 'test_description'
    product.category = category.id
    product.price = 1000
    product.image = 'test_image'
    product.save()
    return product

class TestOrder(unittest.TestCase):
    """
    Model Order tester class
    """
    def test_create(self):
        """
        test a single order creation
        """
        shop = create_shop()
        order = Order()
        order.date = 'test_date'
        order.client = shop.client
        order.origin = 'test_admin'
        order.shop = shop.id
        order.total = 1000
        order.description = '{"test_product": 4}'
        order.save()
        self.assertEqual(order.id, shop.orders[0].id)
        storage.delete(storage.get(User, shop.user))
        storage.save()
        storage.close()

    def test_description(self):
        """
        test the description serialization
        """
        shop = create_shop()
        order = Order()
        order.date = 'test_date'
        order.client = shop.client
        order.origin = 'test_admin'
        order.shop = shop.id
        product = create_product(shop)
        order.description = json.dumps({
            product.id: 3
        })
        order.save()
        savedProds = order.products
        self.assertEqual(savedProds[product.id]['total'], 3000)
        storage.delete(storage.get(User, shop.user))
        storage.save()
        storage.close()


if __name__ == '__main__':
    unittest.main() 