"""Index API tests.

Author: Jared Paubel
Version: 0.1
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.index.models import Index


# class IndexAPITests(TestCase):
#     """Index API test class."""

#     def setUp(self):
#         self.client = APIClient()
#         Index.objects.all().delete()
#         self.index = Index.objects.create()

#     def test_index_list_returns_200(self):
#         response = self.client.get(reverse('index-list'))
#         self.assertEqual(response.status_code, 200)

#     def test_index_list_returns_single_object(self):
#         response = self.client.get(reverse('index-list'))
#         self.assertEqual(response.data['count'], 1)
#         self.assertEqual(len(response.data['results']), 1)

#     def test_index_detail_returns_200(self):
#         response = self.client.get(
#             reverse('index-detail', args=[self.index.pk])
#         )
#         self.assertEqual(response.status_code, 200)

#     def test_index_detail_returns_correct_data(self):
#         response = self.client.get(
#             reverse('index-detail', args=[self.index.pk])
#         )
#         self.assertEqual(
#             response.data['greeting_title'],
#             'Welcome to Prokope.io!'
#         )
#         self.assertEqual(
#             response.data['about_me_title'],
#             'About Jay'
#         )
