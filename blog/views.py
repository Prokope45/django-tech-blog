from django.contrib import messages
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views import generic

from .forms import ContactForm
from .models import IndexDescription, Post, Image


def index_view(request):
    context = {'index_data': IndexDescription.objects.all()}
    return render(request, 'index.html', context)


class PostList(generic.ListView):
    queryset = Post.objects.filter(status=1).order_by('-created_on')
    template_name = 'post.html'


class PostDetail(generic.DetailView):
    model = Post
    template_name = 'post_detail.html'


def gallery_view(request):
    image_list = Image.objects.all()
    context = {'image_list': image_list}
    print(context)
    return render(request, 'gallery.html', context)


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
                send_mail(email_subject, email_message, from_email, ['admin@example.com'], fail_silently=False)
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
            messages.success(request, 'Message sent!')
            return redirect('contact')
        messages.error(request, 'Please complete HCaptcha below.')
    else:
        form = ContactForm()

    context = {'form': form}
    return render(request, 'contact.html', context)
