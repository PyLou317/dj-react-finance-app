from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .tasks import sync_simplefin
from .models import Organization, Account, Transaction
from .serializers import OrganizationSerializer, AccountSerializer, TransactionSerializer
from rest_framework.pagination import PageNumberPagination


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
    
    def get(self, request, format=None):
        trans = Transaction.objects.filter(channel_owner=request.user)
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(trans, request)
        
        if page is not None:
            serializer = TransactionSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = TransactionSerializer(trans, many=True)
        return Response(serializer.data)