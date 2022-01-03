from django.contrib import admin
from .models import IndexDescription, Post, Contact, Image
from django_summernote.admin import SummernoteModelAdmin


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


class IndexAdmin(admin.ModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


admin.site.register(IndexDescription, IndexAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Image)
admin.site.register(Contact)
