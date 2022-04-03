from rest_framework import serializers, pagination
from .models import Budget, Category, Entry


class EntrySerializer(serializers.HyperlinkedModelSerializer):
    budget = serializers.ReadOnlyField(source='budget.id')
    category = serializers.ReadOnlyField(source='category.title')

    class Meta:
        model = Entry
        fields = ['id', 'description', 'amount', 'date', 'is_positive', 'created', 'updated', 'budget', 'category']


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    entries = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'title', 'description', 'created', 'updated', 'entries']


class BudgetSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Budget
        fields = ['id', 'title', 'description', 'created', 'updated', 'owner']


class BudgetWithEntriesSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    entries = serializers.SerializerMethodField('paginated_entries')

    class Meta:
        model = Budget
        fields = ['id', 'title', 'description', 'created', 'updated', 'owner', 'entries']

    def paginated_entries(self, obj):
        entries = Entry.objects.filter(budget=obj)
        paginator = pagination.PageNumberPagination()
        page = paginator.paginate_queryset(entries, self.context['request'])
        serializer = EntrySerializer(page, many=True, context={'request': self.context['request']})
        return serializer.data
