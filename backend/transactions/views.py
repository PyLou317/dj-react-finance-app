from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .tasks import sync_simplefin
from .models import Organization, Account, Transaction, Budget
from .serializers import OrganizationSerializer, AccountSerializer, TransactionSerializer, BudgetSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters


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

class ListTransactionView(APIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['account__name', 'amount', 'description', 'payee', 'date_posted']
    
    def get(self, request, format=None):
        queryset = Transaction.objects.filter(account__user=request.user)
        
        # Get transactions filtered by account 
        account_id = request.query_params.get('account_id')
        if account_id:
            queryset = queryset.filter(account_id=account_id)
            
        # Get transactions filtered by category
        category_id = request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(queryset, request)
        
        if page is not None:
            serializer = TransactionSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = TransactionSerializer(queryset, many=True)
        return Response(serializer.data)


class ListTBudgetView(APIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category', 'amount', 'month', 'year']
    
    def get(self, request, format=None):
        queryset = Budget.objects.filter(user=request.user)
        serializer = BudgetSerializer(queryset, many=True)
        return Response(serializer.data)
    
