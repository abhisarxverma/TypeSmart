from django.urls import path, include
from django.urls import re_path
from . import views

urlpatterns = [
    path('api/auth/getuser/', views.get_user_view, name='get_user'),
    
    path('api/library/add_text', views.upload_text, name='upload_text'),
    path('api/library/edit_text', views.edit_text, name='edit_text'),
    path('api/library/library/', views.get_library, name='get_library'),
    path('api/library/create_group', views.create_group, name='create_group'),
    path('api/library/add_in_group', views.add_in_group, name='add_in_group'),
    path('api/library/remove_from_group', views.remove_from_group, name='remove_from_group'),
    path('api/library/update_importance', views.update_importance, name='update_importance'),
    path('api/library/delete_text', views.delete_text, name='delete_text'),
    path('api/library/delete_group', views.delete_group, name='delete_group'),
    
    path('api/misc/send_feedback', views.send_feedback, name='send_feedback'),
]