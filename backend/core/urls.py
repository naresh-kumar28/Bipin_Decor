from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, UserProfileView, CategoryViewSet, 
    ProjectViewSet, ProjectRequestViewSet, ProjectReviewViewSet,
    ServiceViewSet, DashboardStatsView, ServiceRequestViewSet, BookingViewSet,
    SiteSettingAPIView, WhyChooseUsViewSet, OurProcessViewSet, TestimonialViewSet, SocialLinkViewSet
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'project-requests', ProjectRequestViewSet)
router.register(r'project-reviews', ProjectReviewViewSet)
router.register(r'service-requests', ServiceRequestViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'why-choose-us', WhyChooseUsViewSet)
router.register(r'our-process', OurProcessViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'social-links', SocialLinkViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('settings/', SiteSettingAPIView.as_view(), name='site_settings'),
]
