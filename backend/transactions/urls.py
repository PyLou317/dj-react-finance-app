from django.urls import path
from .views import *

urlpatterns = [
    # Standard
    path('organizations/', ListOrganizationView.as_view(), name='organizations'),
    path('accounts/', ListAccountView.as_view(), name='accounts'),
    path('transactions/', ListTransactionView.as_view(), name='transactions'),
    path('sync-transactions/', SyncTransactions.as_view(), name='sync-transactions'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('dashboard/transactions/', DashboardTransactionView.as_view(), name='recent-transactions'),
    path('budgets/', ListTBudgetView.as_view(), name='budgets'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('current-category-totals/', CategoryTotalsByCurrentMonthView.as_view(), name='current-category-totals'),
    path('category-totals/', CategoryTotalsView.as_view(), name='category-totals'),
    
    # SimpleFIN
    path('trigger-sf-long-sync/', TriggerLongSFSync.as_view(), name='trigger_longsf_sync'),
    path('trigger-sf-2d-sync/', Trigger2DaySFSync.as_view(), name='trigger_2dsf_sync'),
]