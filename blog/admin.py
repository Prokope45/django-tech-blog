from django.contrib import admin
from .models import Post, Contact, Image
from django_summernote.admin import SummernoteModelAdmin


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


admin.site.register(Post, PostAdmin)
admin.site.register(Image)
admin.site.register(Contact)
