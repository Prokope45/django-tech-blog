from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.index.api.views import IndexViewSet
from apps.blog.api.views import PostViewSet, TagListView, ContactCreateView
from apps.gallery.api.views import (
    CountryViewSet,
    CityViewSet,
    CityPhotoViewSet,
    CountryAlbumViewSet,
)
from apps.common.api.views import SearchAPIView

router = DefaultRouter()
router.register('index', IndexViewSet, basename='index')
router.register('posts', PostViewSet, basename='post')
router.register('countries', CountryViewSet, basename='country')
router.register('cities', CityViewSet, basename='city')
router.register('photos', CityPhotoViewSet, basename='photo')
router.register('country-albums', CountryAlbumViewSet, basename='country-album')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/tags/', TagListView.as_view(), name='tag-list'),
    path('api/contact/', ContactCreateView.as_view(), name='contact-create'),
    path('api/search/', SearchAPIView.as_view(), name='api-search'),
    path('api/api-token-auth/', obtain_auth_token, name='api-token-auth'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
