from django.contrib import admin
from .models import *


@admin.register(Organization)
class OrgAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'balance')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'amount', 'payee', 'category')
    list_display_links = ('id', 'payee',) 

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'color', 'icon')

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'amount', 'month', 'year')
    # ordering = ['category']