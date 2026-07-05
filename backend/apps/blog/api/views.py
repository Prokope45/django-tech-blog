from rest_framework import viewsets, generics, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from taggit.models import Tag
from apps.blog.models import Post, Contact
from apps.blog.api.serializers import (
    PostListSerializer,
    PostDetailSerializer,
    TagSerializer,
    ContactSerializer,
)


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.filter(status=1)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tag__name']
    search_fields = ['title', 'content']
    ordering_fields = ['title', 'created_on', 'updated_on']
    ordering = ['-created_on']

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostDetailSerializer

    def get_queryset(self):
        queryset = Post.objects.filter(status=1)
        tags = self.request.query_params.getlist('tags')
        if tags:
            queryset = queryset.filter(tag__name__in=tags).distinct()
        return queryset


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = []
    pagination_class = None


class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]
