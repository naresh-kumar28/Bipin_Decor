from django.contrib import admin
from .models import (
    Category, Service, Project, ProjectReview, ProjectRequest, 
    ServiceRequest, Booking, SiteSetting, WhyChooseUs, OurProcess, Testimonial
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'created_at')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'rating', 'created_at')
    list_filter = ('category',)

@admin.register(ProjectReview)
class ProjectReviewAdmin(admin.ModelAdmin):
    list_display = ('project', 'user_name', 'rating', 'created_at')

@admin.register(ProjectRequest)
class ProjectRequestAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'project', 'status', 'created_at')
    list_filter = ('status',)

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'service', 'status', 'created_at')
    list_filter = ('status',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'consultation_date', 'status', 'created_at')
    list_filter = ('status', 'consultation_date')

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    fieldsets = (
        ('General Settings', {
            'fields': ('website_name', 'logo', 'favicon', 'primary_color', 'footer_description', 'maintenance_mode')
        }),
        ('SEO Settings', {
            'fields': ('seo_title', 'seo_description', 'seo_keywords')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'contact_address')
        }),
        ('Social Media', {
            'fields': ('whatsapp_number', 'whatsapp_message', 'facebook_url', 'instagram_url', 'youtube_url')
        }),
        ('Home Page Hero', {
            'fields': ('hero_subtitle', 'hero_title', 'hero_description', 'hero_video', 'hero_background_image')
        }),
        ('About Page', {
            'fields': (
                'about_hero_subtitle', 'about_hero_title', 'about_hero_description', 'about_hero_image',
                'about_story_subtitle', 'about_story_title', 'about_story_p1', 'about_story_p2', 
                'about_story_years', 'about_story_projects', 'about_story_image',
                'about_philosophy_subtitle', 'about_philosophy_title',
                'about_card1_title', 'about_card1_desc', 'about_card1_icon',
                'about_card2_title', 'about_card2_desc', 'about_card2_icon',
                'about_card3_title', 'about_card3_desc', 'about_card3_icon',
                'about_expertise_subtitle', 'about_expertise_title', 'about_expertise_p1', 'about_expertise_p2',
                'about_expertise_image1', 'about_expertise_image2'
            )
        }),
        ('Services Page', {
            'fields': ('service_hero_subtitle', 'service_hero_title', 'service_hero_description', 'service_hero_image')
        }),
        ('Portfolio (Our Work) Page', {
            'fields': ('portfolio_hero_subtitle', 'portfolio_hero_title', 'portfolio_hero_description', 'portfolio_hero_image')
        }),
        ('Section Titles', {
            'fields': (
                'category_section_subtitle', 'category_section_title',
                'service_section_subtitle', 'service_section_title',
                'why_choose_subtitle', 'why_choose_title', 'why_choose_description', 'why_choose_image',
                'process_section_subtitle', 'process_section_title', 'process_section_description',
                'testimonial_section_subtitle', 'testimonial_section_title'
            )
        }),
        ('Call To Action (CTA)', {
            'fields': ('cta_title', 'cta_description', 'cta_button_text', 'cta_background_image')
        }),
    )

    def has_add_permission(self, request):
        return not SiteSetting.objects.exists()

@admin.register(WhyChooseUs)
class WhyChooseUsAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')

@admin.register(OurProcess)
class OurProcessAdmin(admin.ModelAdmin):
    list_display = ('title', 'order')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'rating', 'is_active', 'order')
    list_filter = ('is_active', 'rating')
