from django.contrib import admin
from .models import Post, Contact
from django_summernote.admin import SummernoteModelAdmin


class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)


admin.site.register(Post, PostAdmin)
admin.site.register(Contact)
