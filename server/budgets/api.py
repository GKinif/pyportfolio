from django.db.models import Count, Sum, Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.utils import translate_validation

from .models import Budget, Category, Entry
from .serializers import BudgetSerializer, CategorySerializer, EntrySerializer, \
    BudgetOverviewSerializer
from .filters import EntryFilter
from .permissions import IsOwner, IsAdminUserOrReadOnly


class BudgetViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return Budget.objects.filter(owner=self.request.user).annotate(
            total_entries=Count('entries'),
            total_amount=Sum('entries__amount'),
        )


class CategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUserOrReadOnly]
    pagination_class = None


class EntryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filterset_class = EntryFilter

    def get_queryset(self):
        user = self.request.user
        return Entry.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def budget_overview(request, budget_id):
    f = EntryFilter(request.GET, queryset=Entry.objects.filter(owner=request.user, budget=budget_id), request=request)

    if not f.is_valid():
        raise translate_validation(f.errors)

    sums = f.qs.values('category__title').annotate(
        positive_sum=Sum('amount', filter=Q(is_positive=True)),
        negative_sum=Sum('amount', filter=Q(is_positive=False)), )

    print('SUMS: ', sums)

    serializer = BudgetOverviewSerializer(sums, many=True)

    return Response(serializer.data)
