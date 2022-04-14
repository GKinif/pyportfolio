from rest_framework import viewsets, permissions

from .models import Budget, Category, Entry
from .serializers import BudgetSerializer, BudgetWithEntriesSerializer, CategorySerializer, EntrySerializer
from .filters import EntryFilter
from .permissions import IsOwner, IsAdminUserOrReadOnly


class BudgetViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Budget.objects.all()
    #serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BudgetWithEntriesSerializer
        else:
            return BudgetSerializer

    def get_queryset(self):
        return Budget.objects.filter(owner=self.request.user)


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
