from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.db.models import Count
from django.db.models.functions import TruncMonth
from .serializers import (
    RegisterSerializer, UserSerializer, CategorySerializer, 
    ProjectSerializer, ProjectRequestSerializer, ProjectReviewSerializer,
    ServiceSerializer, ServiceRequestSerializer, BookingSerializer, SiteSettingSerializer,
    WhyChooseUsSerializer, OurProcessSerializer, TestimonialSerializer, SocialLinkSerializer
)
from .models import Category, Project, ProjectRequest, ProjectReview, Service, ServiceRequest, Booking, SiteSetting, WhyChooseUs, OurProcess, Testimonial, SocialLink
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('-created_at')
    serializer_class = ServiceSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def rate(self, request, pk=None):
        project = self.get_object()
        new_rating = request.data.get('rating')
        if new_rating:
            try:
                new_rating = float(new_rating)
                if new_rating < 1 or new_rating > 5:
                    return Response({'error': 'Rating must be between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
                
                from decimal import Decimal
                current_rating = Decimal(str(project.rating))
                new_rating_dec = Decimal(str(new_rating))
                
                total_score = (current_rating * project.rating_count) + new_rating_dec
                project.rating_count += 1
                project.rating = total_score / project.rating_count
                project.save()
                return Response({'status': 'rating updated', 'rating': project.rating, 'rating_count': project.rating_count})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'rating required'}, status=status.HTTP_400_BAD_REQUEST)

class ProjectRequestViewSet(viewsets.ModelViewSet):
    queryset = ProjectRequest.objects.all().order_by('-created_at')
    serializer_class = ProjectRequestSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        pending_count = ProjectRequest.objects.filter(status='Pending').count()
        return Response({'pending_count': pending_count})

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all().order_by('-created_at')
    serializer_class = ServiceRequestSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class WhyChooseUsViewSet(viewsets.ModelViewSet):
    queryset = WhyChooseUs.objects.all()
    serializer_class = WhyChooseUsSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAdminUser()]

class OurProcessViewSet(viewsets.ModelViewSet):
    queryset = OurProcess.objects.all()
    serializer_class = OurProcessSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAdminUser()]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer

    def get_queryset(self):
        # Admin sees all; public sees only active
        if self.request.user and self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

class ProjectReviewViewSet(viewsets.ModelViewSet):
    queryset = ProjectReview.objects.all().order_by('-created_at')
    serializer_class = ProjectReviewSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            project_id = request.data.get('project')
            if project_id:
                Project.objects.get(id=project_id).recalculate_rating()
        return response

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        project = instance.project
        response = super().destroy(request, *args, **kwargs)
        project.recalculate_rating()
        return response

class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class SiteSettingAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return [IsAdminUser()]
        return [AllowAny()]

    def get_object(self):
        obj, created = SiteSetting.objects.get_or_create(pk=1)
        return obj

    def get(self, request):
        serializer = SiteSettingSerializer(self.get_object(), context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        obj = self.get_object()
        serializer = SiteSettingSerializer(obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_project_enquiries = ProjectRequest.objects.count()
        total_service_enquiries = ServiceRequest.objects.count()
        total_enquiries = total_project_enquiries + total_service_enquiries
        
        pending_project_enquiries = ProjectRequest.objects.filter(status='Pending').count()
        pending_service_enquiries = ServiceRequest.objects.filter(status='Pending').count()
        pending_enquiries = pending_project_enquiries + pending_service_enquiries
        
        total_projects = Project.objects.count()
        total_services = Service.objects.count()
        total_reviews = ProjectReview.objects.count()
        total_bookings = Booking.objects.count()
        pending_bookings = Booking.objects.filter(status='Pending').count()
        
        monthly_stats = ProjectRequest.objects.annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('-month')[:6]
        
        recent_enquiries = ProjectRequest.objects.all().order_by('-created_at')[:5]
        recent_bookings = Booking.objects.all().order_by('-created_at')[:5]
        
        serialized_recent_enquiries = []
        for item in recent_enquiries:
            serialized_recent_enquiries.append({
                'id': item.id,
                'user_name': item.user_name,
                'user_phone': item.user_phone,
                'created_at': item.created_at,
                'status': item.status,
                'title': item.project.title
            })
            
        serialized_recent_bookings = []
        for item in recent_bookings:
            serialized_recent_bookings.append({
                'id': item.id,
                'full_name': item.full_name,
                'consultation_date': item.consultation_date,
                'consultation_time': item.consultation_time,
                'service_name': item.service_interested.title if item.service_interested else 'General',
                'status': item.status
            })

        return Response({
            'stats': {
                'total_enquiries': total_enquiries,
                'pending_enquiries': pending_enquiries,
                'total_projects': total_projects,
                'total_services': total_services,
                'total_reviews': total_reviews,
                'total_bookings': total_bookings,
                'pending_bookings': pending_bookings,
            },
            'monthly_stats': list(monthly_stats),
            'recent_enquiries': serialized_recent_enquiries,
            'recent_bookings': serialized_recent_bookings
        })
