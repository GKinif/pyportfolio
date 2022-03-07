from rest_framework import serializers
from .models import CustomUser
from snippets.models import Snippet


class CustomUserSerializer(serializers.ModelSerializer):
    snippets = serializers.PrimaryKeyRelatedField(many=True, queryset=Snippet.objects.all())

    class Meta:
        model = CustomUser
        fields = ['id', 'url', 'email', 'snippets']
