from . import views
from django.urls import path

from .views import index_view, contact_view, gallery_view

urlpatterns = [
    path('', index_view, name='home'),
    path('update_server/', views.update, name='update'),
    path('blog/', views.PostList.as_view(), name='blog'),
    path('contact/', contact_view, name='contact'),
    path('gallery/', gallery_view, name='gallery'),
    path('<slug:slug>/', views.PostDetail.as_view(), name='post_detail'),
    path('tags/<slug:tag_slug>/', views.TagIndexView.as_view(), name='posts_by_tag'),
]

