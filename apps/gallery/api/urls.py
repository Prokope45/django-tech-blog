from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.gallery.api.views import (
    CountryViewSet,
    CityViewSet,
    CityPhotoViewSet,
    CountryAlbumViewSet,
)

router = DefaultRouter()
router.register('countries', CountryViewSet, basename='country')
router.register('cities', CityViewSet, basename='city')
router.register('photos', CityPhotoViewSet, basename='photo')
router.register('country-albums', CountryAlbumViewSet, basename='country-album')

urlpatterns = [
    path('', include(router.urls)),
]
