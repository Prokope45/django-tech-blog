from django.http import JsonResponse


def tailscale_webfinger(request):
    return JsonResponse({
        "subject": "acct:jpaubel@prokope.io",
        "links": [
            {
                "rel": "http://openid.net/specs/connect/1.0/issuer",
                "href": "https://id.prokope.io"
            }
        ],
        "Access-Control-Allow-Origin": "*"
    })