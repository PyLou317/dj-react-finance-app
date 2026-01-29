import os
import requests
import time
from datetime import datetime
from celery import shared_task
from django.utils.dateparse import parse_date
from django.utils.timezone import make_aware
from django.db import transaction
from .models import Organization, Account, Transaction, Category, Budget
from .utils import categorize_transaction
from datetime import date
    
    
@shared_task
def sync_simplefin(days):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    db_cache = {}
    
    try:
        user_instance = User.objects.get(username='lucas')
    except User.DoesNotExist:
        return "User not found in database"
    
    access_url = os.environ.get('SIMPLEFIN_ACCESS_URL')
    if not access_url:
        return "No ACCESS_URL"

    # 1. Get transactions from the last 2 days
    duration = int(time.time()) - (days * 24 * 60 * 60)
    sync_url = f"{access_url}/accounts?start-date={duration}"

    try:
        response = requests.get(sync_url, timeout=120)
        data = response.json()
        
        # Debug print to verify data receipt
        print(f"Syncing {len(data.get('accounts', []))} accounts")

        with transaction.atomic():
            for acc_data in data.get('accounts', []):
                # Organization Sync
                org_info = acc_data.get('org', {})
                org, _ = Organization.objects.update_or_create(
                    external_id=f"{org_info.get('sfin-url')}-{org_info.get('domain')}",
                    defaults={
                        'name': org_info.get('name', ''),
                        'domain': org_info.get('domain', '')
                    }
                )

                # Account Sync (with Timezone Fix)
                b_date = None
                if acc_data.get('balance-date'):
                    b_date = make_aware(datetime.fromtimestamp(acc_data['balance-date']))

                account, _ = Account.objects.update_or_create(
                    external_id=acc_data['id'],
                    defaults={
                        'org': org,
                        'user': user_instance,
                        'name': acc_data['name'],
                        'currency': acc_data.get('currency', 'CAD'),
                        'balance': acc_data.get('balance', 0),
                        'available_balance': acc_data.get('available-balance', 0),
                        'balance_date': b_date,
                    }
                )

                # Transaction Sync
                transactions_list = acc_data.get('transactions', [])
                
                for txn_data in transactions_list: # Variable now correctly scoped
                    raw_posted = txn_data.get('posted')
                    if isinstance(raw_posted, (int, float)):
                        posted_date = datetime.fromtimestamp(raw_posted).date()
                    else:
                        posted_date = parse_date(str(raw_posted))
                    
                    # Categorize transaction
                    category = categorize_transaction(
                        description=txn_data['description'], 
                        payee=txn_data['payee'],
                        db_cache=db_cache,
                        )

                    Transaction.objects.update_or_create(
                        external_id=txn_data['id'],
                        defaults={
                            'account': account,
                            'amount': txn_data['amount'],
                            'date_posted': posted_date,
                            'payee': txn_data['payee'],
                            'description': txn_data['description'],
                            'is_pending': txn_data.get('pending', False),
                            'extra_data': txn_data.get('extra', {}),
                            'category': category,
                        }
                    )
        
        return "Sync successful"
    except Exception as e:
        return f"Sync failed: {str(e)}"
    

@shared_task
def initial_sync():
    return sync_simplefin(days=365)

@shared_task
def daily_sync():
    return sync_simplefin(days=4)