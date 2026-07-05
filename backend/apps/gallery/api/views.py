from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from apps.gallery.models import Country, City, CityPhoto, CountryAlbum
from apps.gallery.api.serializers import (
    CountrySerializer,
    CitySerializer,
    CityPhotoSerializer,
    CountryAlbumListSerializer,
    CountryAlbumDetailSerializer,
)


class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = []


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    permission_classes = []
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['country']


class CityPhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CityPhoto.objects.all()
    serializer_class = CityPhotoSerializer
    permission_classes = []
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['city', 'country']


class CountryAlbumViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CountryAlbum.objects.all().order_by('country')
    lookup_field = 'slug'
    permission_classes = []

    def get_serializer_class(self):
        if self.action == 'list':
            return CountryAlbumListSerializer
        return CountryAlbumDetailSerializer
