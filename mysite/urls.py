from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django_otp.admin import OTPAdminSite
from django.urls import path, include

# Force TOPT entry for admin login
admin.site.__class__ = OTPAdminSite

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
    path('summernote/', include('django_summernote.urls')),
    path('photologue/', include('photologue.urls', namespace='photologue')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
