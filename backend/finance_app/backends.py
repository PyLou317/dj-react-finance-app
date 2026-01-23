import os
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions
from clerk_backend_api import authenticate_request, AuthenticateRequestOptions, Clerk

User = get_user_model()
CLERK_SECRET_KEY = os.environ.get('CLERK_API_SECRET_KEY')
ALLOWED_CLERK_ID = os.environ.get('ALLOWED_CLERK_ID')

class ClerkAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        print('Auth started')
        
        if 'Authorization' not in request.headers:
            return None

        try:
            request_state = authenticate_request(
                request,
                AuthenticateRequestOptions(
                    secret_key=CLERK_SECRET_KEY
                )
            )

            if not request_state.is_signed_in:
                print("Authentication failed!", request_state.message)
                return None

            clerk_id = request_state.payload["sub"]

            # Only allow YOU
            if clerk_id != ALLOWED_CLERK_ID:
                raise exceptions.PermissionDenied("Access Denied")

            # Return your one and only Django user
            user = User.objects.get(username='lucas')
            return (user, None)

        except Exception as e:
            print(f"Auth error: {e}")
            return None

        return (user, None)