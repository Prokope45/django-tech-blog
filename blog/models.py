from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from taggit.managers import TaggableManager

from photologue.models import Gallery


# Index Page
class IndexDescription(models.Model):
    greeting_title = models.CharField(max_length=200, default='', null=True)
    greeting_description = models.TextField(default='', null=True)

    about_me_title = models.CharField(max_length=200, default='', null=True)
    about_me_description = models.TextField(default='', null=True)

    plans_title = models.CharField(max_length=200, default='', null=True)
    plans_description = models.TextField(default='', null=True)

    def __str__(self):
        return "Greeting, About Me & Future Plans"


# Blog Page
class Post(models.Model):
    STATUS = (
        (0, "Draft"),
        (1, "Publish")
    )

    title = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    updated_on = models.DateField(default=timezone.now)
    created_on = models.DateField(default=timezone.now)
    content = models.TextField()
    status = models.IntegerField(choices=STATUS, default=0)
    thumb = models.ImageField(blank=True)
    tag = TaggableManager()

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return self.title


# Gallery Page
class PhotoGallery(models.Model):
    gallery = models.ForeignKey(Gallery, on_delete=models.SET_NULL, null=True)

    title = models.CharField(max_length=199)
    content = models.TextField()

    slug = models.SlugField(max_length=250, allow_unicode=True, blank=True)

    def __str__(self):
        return self.title


# Contact Page
class Contact(models.Model):
    name = models.CharField(max_length=255, default='')
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()

    def __str__(self):
        return self.email
