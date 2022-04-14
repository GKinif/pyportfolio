from django.contrib import admin

from .models import Budget, Category, Entry

admin.site.register(Category)


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner')
    list_filter = ('created', 'owner')


@admin.register(Entry)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('description', 'budget', 'owner')
    list_filter = ('is_positive', 'date', 'owner')
    search_fields = ('description',)
