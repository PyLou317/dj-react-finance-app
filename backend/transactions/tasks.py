import os
import csv
import requests
import time
from datetime import datetime, timedelta
from celery import shared_task
from django.utils.dateparse import parse_date
from django.utils import timezone
from django.utils.timezone import make_aware
from django.db import transaction
from .models import Organization, Account, Transaction
from .utils import categorize_transaction
from io import StringIO, BytesIO
from decimal import Decimal
import pandas as pd
from django.db import models
import logging
    
logger = logging.getLogger(__name__)

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
        
        logger.info(f"Syncing {len(data.get('accounts', []))} accounts")

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

                # Account Sync
                now = timezone.now()
                
                b_date = None
                if acc_data.get('balance-date'):
                    raw_date = make_aware(datetime.fromtimestamp(acc_data['balance-date']))
                    
                    if raw_date > now + timedelta(days=1):
                        b_date = now
                    else: 
                        b_date = raw_date

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
                
                for txn_data in transactions_list:
                    raw_posted = txn_data.get('posted')
                    if isinstance(raw_posted, (int, float)):
                        posted_date = datetime.fromtimestamp(raw_posted).date()
                    else:
                        posted_date = parse_date(str(raw_posted))

                    obj, created = Transaction.objects.get_or_create(
                        external_id=txn_data['id'],
                        defaults={
                            'amount': txn_data['amount'],
                            'date_posted': posted_date,
                            'description': txn_data['description'],
                            'account': account,
                            'payee': txn_data['payee'],
                            'is_pending': txn_data.get('pending', False),
                            'extra_data': txn_data.get('extra', {}),
                        }
                    )
                    
                    if created:
                        obj.category = categorize_transaction(
                            description=txn_data['description'], 
                            payee=txn_data['payee'],
                            db_cache=db_cache,
                        )
                        obj.save()
        
        return "Sync successful"
    except Exception as e:
        return f"Sync failed: {str(e)}"
    

@shared_task
def initial_sync(days=90):
    return sync_simplefin(days)

@shared_task
def daily_sync(days=90):
    return sync_simplefin(days)


def add_header(uploaded_file):
    col_names =['Date', 'Payee', 'Debit', 'Credit', 'Account']

    file_content = uploaded_file.read().decode('utf-8') 
    csvfile = StringIO(file_content) # creates a StringIO object to process it without saving on disk

    try:
        df = pd.read_csv(csvfile, header=None, names=col_names)

        # If value empty fill with a zero to prevent NaN
        df['Debit'] = df['Debit'].fillna(0)
        df['Credit'] = df['Credit'].fillna(0)

        # Turn Debit and Credit columns into numbers
        df['Debit'] = pd.to_numeric(df['Debit'], errors='coerce')
        df['Credit'] = pd.to_numeric(df['Credit'], errors='coerce')

        # Merge Debit and Credit into new column, create a negative amount for expenses
        df['Amount'] = df['Credit'] - df['Debit']
        # Delete columns:
        df = df.drop(columns=['Debit', 'Credit', 'Account'])

        # Convert back into a Django object
        output = StringIO()
        df.to_csv(output, index=False, quoting=csv.QUOTE_NONNUMERIC) # Prevent issues with text fields.
        output.seek(0)
        csv_string = output.getvalue()
        csv_bytes = csv_string.encode('utf-8')

        print(f'Header Added to file successfully')
        return BytesIO(csv_bytes)  # Return a BytesIO object
    
    except Exception as e:
        print(f'Error processing CSV: {e}')
        return False
    
    

def processUploadedFile(file, account_id, user):
    try:
        # Use .get() to get the specific instance
        account_obj = Account.objects.get(user=user, id=account_id)
        print("Account Obj ID:", account_obj.id)
    except Account.DoesNotExist:
        print(f"DEBUG: Lookup failed for '{account_id}'.")
        return f"Error: Could not find an account for '{account_id}'"
    
    if not account_obj:
        print(f"DEBUG: Lookup failed for '{account_id}'. User accounts: {Account.objects.filter(user=user).values_list('name', flat=True)}")
        return f"Error: Could not find an account for '{account_id}'"
    
    file.seek(0)
    file_content = ""
    
    if 'cibc' in file.name.lower():
        try:
            file_with_header = add_header(file)
            if file_with_header:
                file_with_header.seek(0)
                file_content = file_with_header.read().decode('utf-8') 
            else:
                return "Error: add_header failed to process file."
        except Exception as e:
            print(f'Cannot read file, error: {e}')
            return f"Processing error: {e}"
    else:
        file_content = file.read().decode('utf-8')

    if not file_content:
        print("DEBUG: file_content is empty!")
        return "Error: File content is empty."
    
    csvfile = StringIO(file_content)
    reader = csv.DictReader(csvfile)
    
    db_cache = {}
    created_count = 0
    
    try:
        with transaction.atomic():
            for row in reader:
                print(row)
                
                date_str = row.get('Date')
                description = row.get('Payee') or row.get('Sub-description')
                payee = row.get('Payee')
                amount_str = row.get('Amount') or row.get('debit') or row.get('credit')
                
                print("Date string", date_str)
                print("Description", description)
                print("Payee", payee)
                print("Amount", amount_str)

                if not all([date_str, description, amount_str]):
                    continue
                
                try:
                    date = datetime.strptime(date_str, '%Y-%m-%d').date()
                    amount = Decimal(amount_str.replace(',', ''))
                except (ValueError, TypeError):
                    continue
                
                identifier = f"manual-{account_obj.id}-{date}-{amount}-{description[:20]}"
                
                obj, created = Transaction.objects.get_or_create(
                    external_id=identifier,
                    defaults={
                        'amount': amount,
                        'date_posted': date,
                        'description': description,
                        'account': account_obj,
                        'payee': payee,
                        'is_pending': False,
                    }
                )
                    
                if created:
                    obj.category = categorize_transaction(
                        description=description, 
                        payee=obj.payee,
                        db_cache=db_cache,
                    )
                    obj.save()
                    created_count += 1
    
        return f"Successfully processed {created_count} new transactions"
    except Exception as e:
        return f"File upload failed: {str(e)}"
    