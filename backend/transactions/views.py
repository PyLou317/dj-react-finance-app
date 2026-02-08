from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .tasks import sync_simplefin
from .models import Organization, Account, Transaction, Budget, Category
from .serializers import OrganizationSerializer, AccountSerializer, TransactionSerializer, BudgetSerializer, CategorySerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Q, Value, DecimalField
from datetime import date
from django.db.models.functions import Coalesce


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


class CategoryTotalsByCurrentMonthView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        today = timezone.localtime(timezone.now())
        print("Today:", today)
        # Filters categories by users and transaction amounts
        queryset = Category.objects.annotate(
            category_sum=Coalesce(
                Sum(
                    'transactions__amount',
                    filter=Q(
                        transactions__account__user=request.user,
                        transactions__date_posted__month=today.month,
                        transactions__date_posted__year=today.year
                    )
                ),
                Value(0),
                output_field=DecimalField()
            )
        ).filter(category_sum__lt=0)
        
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
        daily_sync.delay()

        return Response(
            {"status": "Syncing transactions triggered"}, 
            status=status.HTTP_202_ACCEPTED
        )
    
