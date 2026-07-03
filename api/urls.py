from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/', include('apps.index.api.urls')),
    path('api/', include('apps.blog.api.urls')),
    path('api/', include('apps.gallery.api.urls')),
    path('api/', include('apps.common.api.urls')),
    path('api/api-token-auth/', obtain_auth_token, name='api-token-auth'),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
