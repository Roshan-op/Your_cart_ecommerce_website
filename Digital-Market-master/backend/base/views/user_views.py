from django.shortcuts import render
from rest_framework.response import Response
from base.serializer import UserSerializer,UserSerializerWithToken
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
import re


def validate_name(name):
    """
    Validate user name according to business rules:
    - Must not be empty
    - Must not start with a digit
    - Must only contain letters, spaces, hyphens, and apostrophes
    - Must be between 2-50 characters
    
    Returns: (is_valid, error_message)
    """
    if not name or not name.strip():
        return False, "Name cannot be empty"
    
    if re.match(r'^[0-9]', name):
        return False, "Name cannot start with a number"
    
    if not re.match(r"^[a-zA-Z\s'-]+$", name):
        return False, "Name can only contain letters, spaces, hyphens, and apostrophes"
    
    if len(name) < 2 or len(name) > 50:
        return False, "Name must be between 2 and 50 characters"
    
    return True, None


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v

        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data
    
    # Validate name
    is_valid, error_msg = validate_name(data.get('name', ''))
    if not is_valid:
        return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password']),
        )
        serializer = UserSerializerWithToken(user,many=False)
        return Response(serializer.data)
    except:
        message={'detail':'User with this email already exists'}
        return Response(message,status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data
    
    # Validate name
    is_valid, error_msg = validate_name(data.get('name', ''))
    if not is_valid:
        return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserSerializerWithToken(user,many=False)
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])
    
    user.save()

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users= User.objects.all()
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request,pk):
    user= User.objects.get(id=pk)
    serializer = UserSerializer(user,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request,pk):
    user = User.objects.get(id=pk)
    data = request.data
    
    # Validate name
    is_valid, error_msg = validate_name(data.get('name', ''))
    if not is_valid:
        return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)
    
    print(data)
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_superuser = data['isAdmin']
    user.is_staff = data['isVendor']
    
    user.save()
    serializer = UserSerializer(user,many=False)

    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete() 
    return Response('User was deleted')

