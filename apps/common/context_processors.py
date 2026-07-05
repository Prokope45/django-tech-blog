from django.conf import settings


def environment_info(request):
    db_label = ''
    match settings.ENVIRONMENT:
        case 'production':
            db_label = 'Production DB'
        case 'QA':
            db_label = 'Prod Copy DB'
        case 'development':
            db_label = 'Test DB'
        case _:
            db_label = 'Unknown'
    return {
        'environment_name': settings.ENVIRONMENT,
        'database_label': db_label,
    }
