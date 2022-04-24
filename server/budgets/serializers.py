from rest_framework import serializers, pagination
from rest_framework.exceptions import ValidationError

from .models import Budget, Category, Entry


class EntrySerializer(serializers.HyperlinkedModelSerializer):
    budget = serializers.PrimaryKeyRelatedField(queryset=Budget.objects.all(), read_only=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), read_only=False)
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Entry
        fields = ['id', 'description', 'amount', 'date', 'is_positive', 'created', 'updated', 'budget', 'category',
                  'owner']

    def validate_budget(self, value):
        print(self.context['request'].user)
        print(value.owner)
        user_id = self.context['request'].user.id

        if value.owner.id != user_id:
            raise ValidationError({'budget': 'Budget must belong to the user'})
        return value


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'description', 'created', 'updated']


class BudgetSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Budget
        fields = ['id', 'title', 'description', 'created', 'updated', 'owner']


class BudgetWithEntriesSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    entries = serializers.SerializerMethodField('paginated_entries')
    total_entries = serializers.IntegerField()
    total_amount = serializers.IntegerField()

    class Meta:
        model = Budget
        fields = ['id', 'title', 'description', 'created', 'updated', 'owner', 'total_entries', 'total_amount',
                  'entries']

    def paginated_entries(self, obj):
        entries = Entry.objects.filter(budget=obj)
        paginator = pagination.PageNumberPagination()
        page = paginator.paginate_queryset(entries, self.context['request'])
        serializer = EntrySerializer(page, many=True, context={'request': self.context['request']})
        return serializer.data


class BudgetOverviewSumSerializer(serializers.Serializer):
    category__title = serializers.StringRelatedField()
    positive_sum = serializers.DecimalField(max_digits=19, decimal_places=2)
    negative_sum = serializers.DecimalField(max_digits=19, decimal_places=2)


class BudgetOverviewMonthlySumSerializer(serializers.Serializer):
    month = serializers.DateField()
    category__title = serializers.StringRelatedField()
    positive_sum = serializers.DecimalField(max_digits=19, decimal_places=2)
    negative_sum = serializers.DecimalField(max_digits=19, decimal_places=2)

