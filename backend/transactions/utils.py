import os
import json
import csv
import pandas as pd
from io import StringIO, BytesIO
from transactions.models import Category
from functools import lru_cache


@lru_cache(maxsize=1)
def load_categories():
    """
    Loads categories from the categories.json file.
    """
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'categories.json')
    with open(file_path, 'r') as f:
        return json.load(f)


def categorize_transaction(description: str, payee: str, db_cache=None):
    '''
    Categorize transaction based on keywords

    Args: 
        Transaction description: str

    Return: 
        Category: str
    '''
    text = f"{description} {payee}".lower()
    
    categories = load_categories()  # Get the list of categories
    
    # 1. Find the sub-category name based on keywords
    matched_sub_name = "Other" # Fallback
    for category, keywords in categories['CATEGORY_KEYWORDS'].items():
        if any(word.lower() in text for word in keywords):
            matched_sub_name = category
            break

    # 2. Find the parent name
    matched_parent_name = None
    for parent, children in categories['PARENT_GROUPS'].items():
        if matched_sub_name in children:
            matched_parent_name = parent
            break

    # 3. Database operations
    if db_cache is not None and matched_sub_name in db_cache:
        return db_cache[matched_sub_name]
    
    parent_obj = None
    if matched_parent_name:
        parent_obj, _ = Category.objects.get_or_create(name=matched_parent_name, parent=None)

    category_obj, _ = Category.objects.get_or_create(
        name=matched_sub_name, 
        parent=parent_obj
    )
    
    if db_cache is not None:
        db_cache[matched_sub_name] = category_obj
    
    return category_obj