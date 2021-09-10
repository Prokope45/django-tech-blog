
from . import views
from django.urls import path


from .views import contact_view

urlpatterns = [
    path('', views.PostList.as_view(), name='blog'),
    path('contact/', contact_view, name='contact'),
    path('<slug:slug>/', views.PostDetail.as_view(), name='post_detail'),
]

