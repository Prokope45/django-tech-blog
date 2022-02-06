from django.contrib import messages
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from django.views.generic import ListView, DetailView

from taggit.models import Tag
from git import Repo

from .forms import ContactForm
from .models import IndexDescription, Post, PhotoGallery


# Index/Home Page
def index_view(request):
    context = {'index_data': IndexDescription.objects.all()}
    return render(request, 'index.html', context)


# Blog Page
class TagMixin(object):
    def get_context_data(self, **kwargs):
        context = super(TagMixin, self).get_context_data(**kwargs)
        context['tag'] = Tag.objects.all()
        return context


class TagIndexView(TagMixin, ListView):
    model = Post
    template_name = 'post_list.html'
    context_object_name = 'posts'

    def get_queryset(self):
        return Post.objects.filter(tag__slug=self.kwargs.get('tag_slug'))


class PostList(TagMixin, ListView):
    model = Post
    template_name = 'post_list.html'
    queryset = Post.objects.filter(status=1).order_by('-created_on')
    context_object_name = 'posts'


class PostDetail(DetailView):
    model = Post
    template_name = 'post_detail.html'


# Gallery Page
def gallery_view(request):
    image_list = PhotoGallery.objects.all()
    context = {'photo_list': image_list}
    print(context)
    return render(request, 'gallery.html', context)


# Contact Page
def contact_view(request):
    if request.method == 'POST':
        data = request.POST.copy()
        if 'h-captcha-response' in data:
            data['captcha'] = data['h-captcha-response']
        form = ContactForm(data)
        if form.is_valid():
            form.save()
            from_email = form.cleaned_data["email"]
            email_subject = f'New contact {form.cleaned_data["name"]} with email {from_email}: ' \
                            f'{form.cleaned_data["subject"]}'
            email_message = form.cleaned_data['message']
            try:
                send_mail(email_subject, email_message, settings.DEFAULT_FROM_EMAIL, ['jpaubel@pm.me', settings.DEFAULT_FROM_EMAIL], fail_silently=False)
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
            messages.success(request, 'Message sent!')
            return redirect('contact')
        messages.error(request, 'Please complete HCaptcha below.')
    else:
        form = ContactForm()

    context = {'form': form}
    return render(request, 'contact.html', context)


# GitHub-to-PythonAnywhere Update Webhook
@csrf_exempt
def update(request):
    if request.method == "POST":
        '''
        Pass the path of the directory where your project will be
        stored on PythonAnywhere in the git.Repo() as parameter.
        '''
        repo = Repo("jpaubel.tech/")
        origin = repo.remotes.origin

        origin.pull()

        return HttpResponse("Updated code on PythonAnywhere")
    else:
        return HttpResponse("Couldn't update the code on PythonAnywhere")
