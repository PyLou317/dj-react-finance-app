from django.shortcuts import render
from django.db.models.functions import Coalesce
from django.db.models import Sum, Q, Value, DecimalField

from .tasks import sync_simplefin
from .models import Organization, Account, Transaction, Budget, Category
from .serializers import OrganizationSerializer, AccountSerializer, TransactionSerializer, TransactionWriteSerializer, BudgetSerializer, CategorySerializer

from rest_framework import filters, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django_filters.rest_framework import DjangoFilterBackend

from django.utils import timezone
from datetime import date

from .tasks import daily_sync, initial_sync
import datetime


# SimpleFIN
class TriggerLongSFSync(APIView):
    def post(self, request):
        sync_simplefin.delay()
        return Response({"message": "Syncing transactions"}, status=202)

class Trigger2DaySFSync(APIView):
    def post(self, request):
        sync_simplefin.delay()
        return Response({"message": "Syncing transactions"}, status=202)
    

# Standard Views
class ListOrganizationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        orgs = Organization.objects.all()
        serializer = OrganizationSerializer(orgs, many=True)
        return Response(serializer.data)

class ListAccountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

class ListTransactionView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['account_id', 'category_id']
    search_fields = ['account__name', 'description', 'payee', 'category__name']
    
    def get_queryset(self):
        month_raw = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        category = self.request.query_params.get('category')
        
        queryset = Transaction.objects.filter(account__user=self.request.user)
        
        if year:
            queryset = queryset.filter(date_posted__year=year)
        
        if month_raw:
            try:
                if isinstance(month_raw, str) and not month_raw.isdigit():
                    # Converts "January" or "january" to 1
                    month = datetime.datetime.strptime(month_raw, "%B").month
                else:
                    month = int(month_raw)
                    
                queryset = queryset.filter(date_posted__month=month)
            except ValueError:
                pass
        
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
        
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Combine into one database hit
        total = queryset.aggregate(
            total=Sum('amount')
        )['total'] or 0

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            
            response.data['total_sum'] = total
            return response

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total_sum': total,
            'results': serializer.data
        })
        

class TransactionDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TransactionWriteSerializer
        return TransactionSerializer
    
    def get_queryset(self):
        return Transaction.objects.filter(account__user=self.request.user)
        

class DashboardTransactionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        queryset = Transaction.objects.filter(account__user=request.user)
        total_count = queryset.count()
        sliced_data = queryset[:5]
        
        serializer = TransactionSerializer(sliced_data, many=True)
        
        return Response({
            "count": total_count,
            "results": serializer.data
            })


class ListTBudgetView(APIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category']
    
    def get(self, request, format=None):
        queryset = Budget.objects.filter(user=request.user)
        serializer = BudgetSerializer(queryset, many=True)
        return Response(serializer.data)


class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)


class CategoryTotalsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        today = timezone.localtime(timezone.now())

        month_raw = request.query_params.get('month', today.month)
        year = request.query_params.get('year', today.year)
        
        try:
            if isinstance(month_raw, str) and not month_raw.isdigit():
                # Converts "January" or "january" to 1
                month = datetime.datetime.strptime(month_raw, "%B").month
            else:
                month = int(month_raw)
        except ValueError:
            month = today.month
        
        queryset = Category.objects.annotate(
            category_sum=Coalesce(
                Sum(
                    'transactions__amount',
                    filter=Q(
                        transactions__account__user=request.user,
                        transactions__date_posted__month=month,
                        transactions__date_posted__year=year
                    )
                ),
                Value(0),
                output_field=DecimalField()
            )
        ).filter(category_sum__lt=0)
        
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)
    
    
class SyncTransactions(APIView):
    def post(self, request):
        # daily_sync.delay()
        initial_sync.delay()

        return Response(
            {"status": "Syncing transactions triggered"}, 
            status=status.HTTP_202_ACCEPTED
        )
    
