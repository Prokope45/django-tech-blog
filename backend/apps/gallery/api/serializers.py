from rest_framework import serializers
from apps.gallery.models import Country, City, CityPhoto, CountryAlbum, CityGallery


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()

    class Meta:
        model = City
        fields = '__all__'


class CityPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityPhoto
        fields = '__all__'


class CityGallerySerializer(serializers.ModelSerializer):
    city = CitySerializer()
    city_photos = CityPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = CityGallery
        fields = ['id', 'title', 'slug', 'city', 'city_photos', 'date_added', 'is_public']


class CountryAlbumListSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    city_galleries = CityGallerySerializer(many=True, read_only=True)

    class Meta:
        model = CountryAlbum
        fields = ['id', 'title', 'slug', 'country', 'city_galleries']


class CountryAlbumDetailSerializer(serializers.ModelSerializer):
    country = CountrySerializer()
    city_galleries = CityGallerySerializer(many=True, read_only=True)

    class Meta:
        model = CountryAlbum
        fields = '__all__'
