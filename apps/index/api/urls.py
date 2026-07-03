from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.index.api.views import IndexViewSet

router = DefaultRouter()
router.register('index', IndexViewSet, basename='index')

urlpatterns = [
    path('', include(router.urls)),
]
