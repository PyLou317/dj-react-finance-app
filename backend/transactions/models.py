from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class BankConnection(models.Model):
    # Links to your User model
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='bank_connection'
    )
    
    # The permanent URL received from the SimpleFIN claim process
    # Contains: https://user:pass@bridge.simplefin.org/simplefin
    access_url = models.TextField() 
    
    org_name = models.CharField(max_length=255, blank=True, null=True)
    last_sync = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Connection for {self.user.username}"


# Org (Bank)
class Organization(models.Model):
    '''
    "domain": "mybank.com",
    "name": "My Bank",
    "sfin-url": "https://sfin.mybank.com"
    '''
    # Map to sfin-url
    external_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, blank=True)


# Account
class Account(models.Model):
    '''
    org": {
        "domain": "mybank.com",
        "sfin-url": "https://sfin.mybank.com"
    },
    "id": "2930002",
    "name": "Savings",
    "currency": "USD",
    "balance": "100.23",
    "available-balance": "75.23",
    "balance-date": 978366153,
    "transactions": [
        {
        "id": "12394832938403",
        "posted": 793090572,
        "amount": "-33293.43",
        "description": "Uncle Frank's Bait Shop",
        }
    ],
    "extra": {
        "account-open-date": 978360153,
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Map to transaction id
    external_id = models.CharField(max_length=255, unique=True)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=255)
    currency = models.CharField(max_length=10, default="CAD")
    balance = models.DecimalField(max_digits=19, decimal_places=2)
    available_balance = models.DecimalField(max_digits=19, decimal_places=2, null=True)
    balance_date = models.DateTimeField(null=True)
    extra = models.JSONField(default=dict, blank=True)
    

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    color = models.CharField(max_length=20, default='#CBDE0')
    icon = models.CharField(max_length=50, default='help-circle')
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='subcategories'
    )
    
    class Meta:
        unique_together = ('name', 'parent')
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


#Transaction
class Transaction(models.Model):
    '''
    "id": "12394832938403",
    "posted": 793090572,
    "amount": "-33293.43",
    "description": "Uncle Frank's Bait Shop",
    "pending": true,
    "extra": {
    "category": "food"
    '''
    # Map to "id"
    external_id = models.CharField(max_length=255, unique=True) 
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=19, decimal_places=2)
    date_posted = models.DateField()
    payee = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    is_pending = models.BooleanField(default=False)
    extra_data = models.JSONField(default=dict, blank=True)
    icon = models.CharField(max_length=50, default='help-circle')
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='transactions'
    )
    
    class Meta:
        ordering = ['-date_posted']
        
    def __str__(self):
        return f"{self.amount} - {self.payee}"
    
    

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='budgets')
    amount = models.DecimalField(max_digits=19, decimal_places=2)

    class Meta:
        unique_together = ('user', 'category')

    def __str__(self):
        return f"{self.category.name}: {self.amount})"