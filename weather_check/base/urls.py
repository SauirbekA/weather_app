from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', index, name='index')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)