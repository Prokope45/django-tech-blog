from django.db import models
from django.contrib.auth.models import User

from photologue.models import Gallery


# Index Page
class IndexDescription(models.Model):
    plans = models.TextField()
    about_me = models.TextField()

    def __str__(self):
        return self.plans


# Blog Page
STATUS = (
    (0, "Draft"),
    (1, "Publish")
)


class Post(models.Model):
    title = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    updated_on = models.DateTimeField(auto_now=True)
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(choices=STATUS, default=0)
    thumb = models.ImageField(blank=True)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return self.title


# Gallery Page
class Image(models.Model):
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
