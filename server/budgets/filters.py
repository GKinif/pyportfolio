from django_filters import rest_framework as filters
from .models import Entry


class EntryFilter(filters.FilterSet):
    description = filters.CharFilter(lookup_expr='icontains')
    # date = filters.IsoDateTimeFilter(field_name='date', lookup_expr='iexact')
    # date__gte = filters.IsoDateTimeFilter(field_name='date', lookup_expr='gte')
    # date__lte = filters.IsoDateTimeFilter(field_name='date', lookup_expr='lte')
    # year__lte = filters.IsoDateTimeFilter(field_name='date', lookup_expr='year__lte')

    class Meta:
        model = Entry
        fields = {
            'amount': ['lt', 'gt'],
            'date': ['exact', 'lte', 'gte', 'year', 'month'],
        }
