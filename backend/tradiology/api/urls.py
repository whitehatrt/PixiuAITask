from django.urls import path
from . import views

urlpatterns = [
    path('user/register/', views.userRegister, name="user-register"),
    path('user/login/', views.userLogin, name="user-login"),
    path('user/<int:uid>/ideas/', views.getUserIdeas, name="user-ideas"),
    path('user/ideas/', views.getAllIdeas, name="all-ideas"),
    path('user/createidea/',views.createIdea,name="create-idea"),
    path('user/idea/<int:iid>/subscribeidea/<int:uid>/',views.subscribeIdea,name="subscribe-idea"),
]
