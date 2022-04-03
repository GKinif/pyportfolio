from django.db import models
from django.conf import settings
from datetime import date


class Budget(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=500, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='budgets', on_delete=models.CASCADE)

    class Meta:
        ordering = ['created']

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(max_length=1000, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created']

    def __str__(self):
        return self.title


class Entry(models.Model):
    description = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=19, decimal_places=2)
    date = models.DateField(default=date.today)
    is_positive = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    budget = models.ForeignKey(Budget, related_name='entries', on_delete=models.CASCADE)
    category = models.ForeignKey(Category, related_name='entries', on_delete=models.CASCADE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='entries', on_delete=models.CASCADE)

    class Meta:
        ordering = ['created']

    def __str__(self):
        return self.description
