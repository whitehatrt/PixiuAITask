from django.conf import settings
import jwt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .renderers import UserRenderer
from .serializers import IdeaSerializer, SubscribeSerializer, RegisterSerializer, LoginSerializer
from .models import Idea, Subscribe, User
from rest_framework import exceptions, status
from .auth import generate_access_token, generate_refresh_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie, csrf_exempt







@api_view(['POST'])
@ensure_csrf_cookie
def userRegister(request):
    username = request.data['username']
    password = request.data['password']
    email = request.data['email']
    response = Response()
    if (username is None) or (password is None) or (email is None):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response
    user = request.data
    serializer = RegisterSerializer(data=user)

    if serializer.is_valid():
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data['email'])
        access_token = generate_access_token(user)
        refresh_token = generate_refresh_token(user)
        response.set_cookie(key='refreshtoken',
                            value=refresh_token,
                            httponly=True)
        response.data = {
            'access_token': access_token,
            'user': user.id,
        }
        response.status_code = status.HTTP_200_OK
        return response

    response.status_code = status.HTTP_400_BAD_REQUEST
    return response


@api_view(['POST'])
@ensure_csrf_cookie
def userLogin(request):
    email = request.data['email']
    password = request.data['password']
    response = Response()
    if (email is None) or (password is None):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return response

    user = User.objects.get(email=email)
    if(user is None):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response
    if (not user.check_password(password)):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return response

    serialized_user = LoginSerializer(user).data

    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)

    response.set_cookie(key='refreshtoken', value=refresh_token,
                        httponly=True, samesite='None', secure=True)
    response.data = {
        'access_token': access_token,
        'user': serialized_user['id'],
    }

    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def getAllIdeas(request):
    data = []
    try:
        idea = Idea.objects.all()
        for i in idea:
            data.append({
                "iCrypto": i.iCrypto,
                "iName": i.iName,
                "iRisk": i.iRisk,
                "iStoploss": i.iStoploss,
                "iTarget": i.iTarget,
                "iType": i.iType,
                "id": i.id,
                "userId": i.user.id,
                "userName": i.user.username
            })
        return Response(data=data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserIdeas(request, uid):
    data = []
    try:
        idea = Idea.objects.filter(user=uid)
        
        for i in idea:
            subs = Subscribe.objects.filter(idea=i.id)
              
            data.append({
                "iCrypto": i.iCrypto,
                "iName": i.iName,
                "iRisk": i.iRisk,
                "iStoploss": i.iStoploss,
                "iTarget": i.iTarget,
                "iType": i.iType,
                "id": i.id,
                "userId": i.user.id,
                "userName": i.user.username,
                'userJoined':len(subs)
            })
        return Response(data=data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createIdea(request):
    serializer = IdeaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(data=None, status=status.HTTP_200_OK)

    return Response(data=None, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribeIdea(request,iid,uid):
    try:
        subs = Subscribe.objects.get(idea=iid,user=uid)
        if subs:
            return Response(data={'msg':"Already Subscribed"}, status=status.HTTP_200_OK)
    except Subscribe.DoesNotExist:
        data={
            'idea':iid,
            'user':uid
        }
        serializer = SubscribeSerializer(data=data)
       
        if serializer.is_valid():
            serializer.save()
            return Response(data={'msg':"You Subscribed To Idea"}, status=status.HTTP_201_CREATED)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response(data=None, status=status.HTTP_400_BAD_REQUEST)
   