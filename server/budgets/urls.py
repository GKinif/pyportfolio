from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'budgets', api.BudgetViewSet)
router.register(r'categories', api.CategoryViewSet)
router.register(r'entries', api.EntryViewSet, basename='entries')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('budgets/<int:budget_id>/overview/', api.budget_overview, name='budget_overview'),
    path('', include(router.urls)),
]
