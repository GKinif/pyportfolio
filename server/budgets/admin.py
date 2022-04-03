from django.contrib import admin

from .models import Budget, Category, Entry

admin.site.register(Budget)
admin.site.register(Entry)
admin.site.register(Category)
