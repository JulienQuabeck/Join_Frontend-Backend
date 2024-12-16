"""
URL configuration for JoinBackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from Join.views import contactModelViewSet, taskModelViewSet
from user_auth_app.api.views import UserProfileList
#from user_auth_app.api.views import UserProfileList, RegistrationView
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'contact', contactModelViewSet)
router.register(r'task', taskModelViewSet)
router.register(r'user', UserProfileList)
#router.register(r'register', RegistrationView)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
]
