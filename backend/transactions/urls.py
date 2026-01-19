from django.urls import path
from .views import *

urlpatterns = [
    # Standard
    path('api/organizations/', ListOrganizationView.as_view(), name='organizations'),
    path('api/accounts/', ListAccountView.as_view(), name='accounts'),
    path('api/transactions/', ListTransactionView.as_view(), name='transactions'),
    
    # SimpleFIN
    path('api/trigger-sf-long-sync/', TriggerLongSFSync.as_view(), name='trigger_longsf_sync'),
    path('api/trigger-sf-2d-sync/', Trigger2DaySFSync.as_view(), name='trigger_2dsf_sync'),
]