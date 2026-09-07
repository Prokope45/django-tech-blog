"""Blog urls.

Author: Jared Paubel
Version: 0.1
"""
from apps.blog.views import update
from django.urls import path


urlpatterns = [
    path('update_server/', update, name='update'),
]