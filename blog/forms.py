# blog/forms.py
from django import forms
from django.conf import settings
import requests
from django.core.exceptions import ValidationError
from django.forms import ModelForm

from .models import Contact


def validate_captcha(value):
    data = {'secret': settings.HCAPTCHA_SECRET, 'response': value}
    response = requests.post(settings.VERIFY_URL, data)
    if not 'success' in response.json() or not response.json()['success']:
        raise ValidationError('hcaptcha is not correct')


class ContactForm(ModelForm):
    captcha = forms.CharField(max_length=10000, validators=[validate_captcha])

    class Meta:
        model = Contact
        fields = '__all__'
