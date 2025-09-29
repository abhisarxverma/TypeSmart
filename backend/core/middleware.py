from decouple import config
import logging
from django.http import JsonResponse
from supabase import create_client, Client, ClientOptions
from django.core.cache import cache
import time


logger = logging.getLogger(__name__)

SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_KEY = config("SUPABASE_ANON_KEY")
print("Key : ", SUPABASE_KEY)
print("Url : ", SUPABASE_URL)

supabase: Client = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_KEY)


def get_access_token(request):
    """Extract Bearer token from Authorization header or cookie."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    return request.COOKIES.get("sb-access-token")


def supabase_for_user(access_token: str):
    """Create a Supabase client scoped to the user by injecting Authorization header."""
    return create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        options=ClientOptions(
            headers={"Authorization": f"Bearer {access_token}"}
        ),
    )


class RequireAuthMiddleware:
    """Middleware that validates Supabase JWT and attaches user + sb client to request."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if not request.path.startswith("/api/"):
            return self.get_response(request)

        if request.path == "/api/misc/send_feedback":
            return self.get_response(request)

        token = get_access_token(request)

        # print("DEBUG token:", token)

        if not token:
            return JsonResponse({"error": "Missing access token"}, status=401)

        try:
            user_resp = supabase.auth.get_user(token)
            # print("DEBUG supabase user:", user_resp.user)

            if not user_resp.user:
                return JsonResponse({"error": "Invalid or expired token"}, status=401)

            request.sb_user = user_resp.user
            request.sb = supabase_for_user(token)


        except Exception as e:
            print("\n\nError in Require auth middleware : "+str(e)+"\n\n")
            logger.exception("Error in require auth middleware")
            return JsonResponse(
                {"error": "Auth check failed", "details": str(e)}, status=401
            )

        return self.get_response(request)

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if not request.path.startswith("/api/"):
            return self.get_response(request)
    
        if request.path.startswith('/admin/') or request.path.startswith('/static/'):
            return self.get_response(request)
        
        ip = self.get_client_ip(request)
        
        cache_key = f"rate_limit_{ip}_{request.path}"
        
        current_requests = cache.get(cache_key, [])
        now = time.time()
        
        current_requests = [req_time for req_time in current_requests 
                          if now - req_time < 3600]
        
        if len(current_requests) >= 10:
            return JsonResponse({"status":"failed", "message":"Too many requests. Try again later."}, status=429)
        
        current_requests.append(now)
        cache.set(cache_key, current_requests, 3600)
        
        response = self.get_response(request)
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
