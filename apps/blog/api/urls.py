from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.blog.api.views import PostViewSet, TagListView, ContactCreateView

router = DefaultRouter()
router.register('posts', PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('contact/', ContactCreateView.as_view(), name='contact-create'),
]
