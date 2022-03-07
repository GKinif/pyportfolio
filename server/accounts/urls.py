from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from rest_framework.urlpatterns import format_suffix_patterns
from . import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', views.UserViewSet)  # or router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# urlpatterns = [
#     path('', views.UserList.as_view(), name='user-list'),
#     path('<int:pk>/', views.UserList.as_view(), name='user-detail'),
# ]
#
# urlpatterns = format_suffix_patterns(urlpatterns)
