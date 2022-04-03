from rest_framework import viewsets, permissions
from django_filters import rest_framework as filters

from .models import Budget, Category, Entry
from .serializers import BudgetSerializer, BudgetWithEntriesSerializer, CategorySerializer, EntrySerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Budget.objects.all()
    #serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BudgetWithEntriesSerializer
        else:
            return BudgetSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class EntryFilter(filters.FilterSet):
    # min_price = filters.NumberFilter(field_name="amount", lookup_expr='gte')
    # max_price = filters.NumberFilter(field_name="amount", lookup_expr='lte')

    class Meta:
        model = Entry
        # fields = ['category', 'min_price', 'max_price']
        fields = {
            'category': ['exact'],
            'amount': ['gte', 'lte'],
        }


class EntryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = EntryFilter

    def get_queryset(self):
        user = self.request.user
        return Entry.objects.filter(owner=user)
