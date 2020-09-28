#!/usr/bin/python
"""
Test Category storage behavior
"""

import unittest
from models import storage
from models.user import User
from models.shop import Shop
from models.client import Client
from models.category import Category
from models.product import Product


def create_shop():
    user = User()
    user.username = 'test_user'
    user.passwd = 'test_pass'
    user.save()
    client = Client()
    client.username = 'test_user'
    client.email = 'test_phone'
    client.phone = 'test_pass'
    client.save()
    shop = Shop()
    shop.user = user.id
    shop.client = client.id
    shop.save()
    return shop


class TestCategory(unittest.TestCase):
    """
    test DBEngine functionality
    """
    def test_create(self):
        """
        Test a category creation
        """
        shop = create_shop()
        category = Category()
        category.title = 'test_title'
        category.description = 'test_description'
        category.shop = shop.id
        category.save()
        storage.close()
        savedCat = shop.categories[0]
        self.assertIsNotNone(savedCat)
        us = storage.get(User, shop.user)
        storage.delete(us)
        storage.save()
        storage.close()

    def test_products(self):
        """
        Test the products @property
        """
        shop = create_shop()
        category = Category()
        category.title = 'test_title'
        category.description = 'test_description'
        category.shop = shop.id
        category.save()
        product = Product()
        product.title = 'test_title'
        product.description = 'test_description'
        product.price = 1000
        product.category = category.id
        product.image = 'test_image'
        product.save()
        storage.close()
        savedProd = category.products[0]
        self.assertEqual(savedProd.id, product.id)
        us = storage.get(User, shop.user)
        storage.delete(us)
        storage.save()
        storage.close()


if __name__ == '__main__':
    unittest.main()
