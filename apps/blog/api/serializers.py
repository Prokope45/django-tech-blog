from rest_framework import serializers
from taggit.models import Tag
from apps.blog.models import Post, Contact


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class PostListSerializer(serializers.ModelSerializer):
    tag = serializers.StringRelatedField(many=True)
    author = serializers.StringRelatedField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'author', 'created_on',
            'updated_on', 'status', 'thumb', 'tag',
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    tag = TagSerializer(many=True)
    author = serializers.StringRelatedField()

    class Meta:
        model = Post
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'message']
