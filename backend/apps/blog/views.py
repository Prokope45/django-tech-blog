"""Blog views.

Author: Jared Paubel
Version: 0.1
"""
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


# GitHub-to-PythonAnywhere Update Webhook
@csrf_exempt
def update(request):
    """Update webook. Dead code."""
    if request.method == "POST":
        '''
        Pass the path of the directory where your project will be
        stored on PythonAnywhere in the git.Repo() as parameter.
        '''
        repo = Repo("django-tech-blog")

        git = repo.git
        git.checkout('master')

        git.pull()

        return HttpResponse("Updated code on PythonAnywhere")
    else:
        return HttpResponse(
            "Couldn't update the code on PythonAnywhere",
        status=400)
