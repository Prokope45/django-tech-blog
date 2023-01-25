from django.contrib import admin
from django.conf import settings
from django_summernote.admin import SummernoteModelAdmin

from .models import IndexDescription, Post, Contact, PhotoGallery


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)
    prepopulated_fields = { 'slug': ('title',), }


class GalleryAdmin(admin.ModelAdmin):
    prepopulated_fields = { 'slug': ('country',), }


class IndexAdmin(admin.ModelAdmin):
    if not settings.DEBUG:
        def has_delete_permission(self, request, obj=None):
            return False

        def has_add_permission(self, request):
            return False


admin.site.register(IndexDescription, IndexAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(PhotoGallery, GalleryAdmin)
admin.site.register(Contact)
