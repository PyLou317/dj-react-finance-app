from rest_framework import serializers
from .models import Account, Organization, Transaction, Budget, Category


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
        depth = 2


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        depth = 2


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        depth = 2

class TransactionWriteSerializer(serializers.ModelSerializer):
    # This tells DRF to expect an ID, not a nested object
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Transaction
        fields = ['category', 'notes']

class TransactionSumSerializer(serializers.ModelSerializer):
    total_sum = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['total_sum']

    def get_total_sum(self, obj):
        return Transaction.get_total_amount()


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        depth = 2


class CategorySerializer(serializers.ModelSerializer):
    category_sum = serializers.DecimalField(
        max_digits=19, 
        decimal_places=2, 
        read_only=True
    )

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'icon', 'parent', 'category_sum']
        depth = 2