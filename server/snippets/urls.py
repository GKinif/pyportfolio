from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from rest_framework.urlpatterns import format_suffix_patterns
from . import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', views.SnippetViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]

# urlpatterns = [
#     path('', views.SnippetList.as_view(), name='snippet-list'),
#     path('<int:pk>/', views.SnippetDetail.as_view(), name='snippet-detail'),
#     path('<int:pk>/highlight/', views.SnippetHighlight.as_view(), name='snippet-highlight'),
# ]
#
# urlpatterns = format_suffix_patterns(urlpatterns)
