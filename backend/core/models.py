from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['-created_at']

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    features = models.TextField(help_text="Enter features separated by new lines", blank=True)
    image = models.ImageField(upload_to='services/')
    icon = models.CharField(max_length=50, default='lucide:grid-3x3', help_text="Iconify icon name")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='projects')
    image = models.ImageField(upload_to='projects/')
    description = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    rating_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def recalculate_rating(self):
        reviews = self.reviews.all()
        count = reviews.count()
        if count > 0:
            from django.db.models import Avg
            average = reviews.aggregate(Avg('rating'))['rating__avg']
            self.rating = average
            self.rating_count = count
        else:
            self.rating = 0
            self.rating_count = 0
        self.save()

    def __str__(self):
        return self.title

class ProjectRequest(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='requests')
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=15)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pending') # Pending, Contacted, Completed

    def __str__(self):
        return f"Request for {self.project.title} by {self.user_name}"

class ServiceRequest(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='requests')
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=15)
    requirements = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pending') # Pending, Contacted, Completed

    def __str__(self):
        return f"Quote for {self.service.title} by {self.user_name}"

class Booking(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    consultation_date = models.DateField()
    consultation_time = models.CharField(max_length=20)
    service_interested = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pending') # Pending, Confirmed, Cancelled

    def __str__(self):
        return f"Booking by {self.full_name} on {self.consultation_date}"

class ProjectReview(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.project.title} by {self.user_name}"

class SiteSetting(models.Model):
    # General
    website_name = models.CharField(max_length=100, default='Bipin Decor')
    footer_description = models.TextField(blank=True, default='Premium interior decoration and home renovation services specializing in UV Marble Sheets, PVC Paneling, and False Ceilings.')
    logo = models.ImageField(upload_to='settings/', blank=True, null=True)
    favicon = models.ImageField(upload_to='settings/', blank=True, null=True)
    maintenance_mode = models.BooleanField(default=False)
    
    # Contact
    contact_email = models.EmailField(blank=True, default='info@bipindecor.com')
    contact_phone = models.CharField(max_length=20, blank=True, default='+91 9876543210')
    contact_address = models.TextField(blank=True, default='123 Decor Street, City')
    
    # Social & WhatsApp
    whatsapp_number = models.CharField(max_length=20, blank=True)
    whatsapp_message = models.CharField(max_length=200, blank=True, default='Hi Bipin Decor, I need a consultation.')
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    
    # SEO
    seo_title = models.CharField(max_length=100, blank=True, default='Bipin Interior | Premium Decor Studio')
    seo_description = models.TextField(blank=True)
    seo_keywords = models.TextField(blank=True)
    
    # Hero Section
    hero_subtitle = models.CharField(max_length=200, default='Bipin Decor Studio')
    hero_title = models.CharField(max_length=200, default='Elevate Your Living Space')
    hero_description = models.TextField(blank=True, default='Crafted with precision, designed with elegance — we transform everyday spaces into timeless Decors.')
    hero_video = models.FileField(upload_to='hero/', blank=True, null=True)
    hero_background_image = models.ImageField(upload_to='hero/', blank=True, null=True)

    # About Page Content
    about_hero_subtitle = models.CharField(max_length=200, default='Our Story')
    about_hero_title = models.CharField(max_length=200, default='About Bipin Decors')
    about_hero_description = models.TextField(blank=True, default='Crafting luxurious, functional, and timeless spaces with uncompromising attention to detail.')
    about_hero_image = models.ImageField(upload_to='about/', blank=True, null=True)

    about_story_subtitle = models.CharField(max_length=200, default='The Beginning')
    about_story_title = models.CharField(max_length=200, default='A Legacy of Design Excellence')
    about_story_p1 = models.TextField(blank=True, default='Founded with a passion for transforming ordinary rooms into extraordinary environments, Bipin Decors has grown into a premier Decor installation studio. We specialize in bringing high-end residential and commercial visions to life.')
    about_story_p2 = models.TextField(blank=True, default='Our journey began over a decade ago with a simple philosophy: Decor design should not only look stunning but also withstand the test of time. Today, we are known for our meticulous craftsmanship in UV marble sheets, PVC paneling, and bespoke false ceilings.')
    about_story_years = models.CharField(max_length=20, default='10+')
    about_story_projects = models.CharField(max_length=20, default='500+')
    about_story_image = models.ImageField(upload_to='about/', blank=True, null=True)

    about_philosophy_subtitle = models.CharField(max_length=200, default='Our Philosophy')
    about_philosophy_title = models.CharField(max_length=200, default='Uncompromising Craftsmanship')
    
    about_card1_title = models.CharField(max_length=200, default='Premium Materials')
    about_card1_desc = models.TextField(blank=True, default='We meticulously source the highest grade UV marble, PVC panels, and WPC louvers. Our materials are chosen for their durability, finish, and ability to elevate any space.')
    about_card1_icon = models.CharField(max_length=100, default='lucide:gem')

    about_card2_title = models.CharField(max_length=200, default='Precision Execution')
    about_card2_desc = models.TextField(blank=True, default='Luxury is in the details. Our installation process is marked by exact measurements, seamless joints, and a flawless finish that defines high-end Decor design.')
    about_card2_icon = models.CharField(max_length=100, default='lucide:ruler')

    about_card3_title = models.CharField(max_length=200, default='Client-Centric Approach')
    about_card3_desc = models.TextField(blank=True, default='We collaborate closely with our clients, ensuring their vision is translated into reality with transparency, timely delivery, and utmost professionalism.')
    about_card3_icon = models.CharField(max_length=100, default='lucide:users')

    about_expertise_subtitle = models.CharField(max_length=200, default='Our Expertise')
    about_expertise_title = models.CharField(max_length=200, default='Master Artisans at Work')
    about_expertise_p1 = models.TextField(blank=True, default='Behind every flawless installation is a team of dedicated artisans. Our installers are not just workers; they are craftsmen who take immense pride in their art.')
    about_expertise_p2 = models.TextField(blank=True, default='With rigorous training and years of hands-on experience, our team handles complex architectural challenges with ease, ensuring that every panel, sheet, and louver is placed with absolute perfection.')
    about_expertise_image1 = models.ImageField(upload_to='about/', blank=True, null=True)
    about_expertise_image2 = models.ImageField(upload_to='about/', blank=True, null=True)

    # Contact Page Content
    contact_hero_subtitle = models.CharField(max_length=200, default='Get in Touch')
    contact_hero_title = models.CharField(max_length=200, default="Let's Discuss Your Project")
    contact_hero_description = models.TextField(blank=True, default='Whether you have a clear vision or need expert guidance, our team is here to bring your ideas to life.')
    contact_hero_image = models.ImageField(upload_to='contact/', blank=True, null=True)

    contact_card_badge = models.CharField(max_length=100, default='Direct Support')
    contact_card_title = models.CharField(max_length=200, default='Talk to Us Directly 😊')
    contact_card_p1 = models.TextField(blank=True, default='Feel free to contact us for false ceiling, PVC paneling, renovation, or interior decoration work.')
    contact_card_p2 = models.TextField(blank=True, default='No bots, no delay — direct interaction with our team.')

    # Services Page Content
    service_hero_subtitle = models.CharField(max_length=200, default='What We Do')
    service_hero_title = models.CharField(max_length=200, default='Expert Solutions for Modern Living')
    service_hero_description = models.TextField(blank=True, default='Discover our range of premium Decor services, from precision false ceilings to elegant wall paneling.')
    service_hero_image = models.ImageField(upload_to='services_hero/', blank=True, null=True)

    # Portfolio Page Content
    portfolio_hero_subtitle = models.CharField(max_length=200, default='Our Masterpieces')
    portfolio_hero_title = models.CharField(max_length=200, default='Work Gallery')
    portfolio_hero_description = models.TextField(blank=True, default='Explore our curated portfolio of stunning transformations and bespoke installations.')
    portfolio_hero_image = models.ImageField(upload_to='portfolio_hero/', blank=True, null=True)

    # Section Titles
    category_section_subtitle = models.CharField(max_length=200, default='Explore Spaces')
    category_section_title = models.CharField(max_length=200, default='Design by Category')
    service_section_subtitle = models.CharField(max_length=200, default='Our Expertise')
    service_section_title = models.CharField(max_length=200, default='Bipin Decor Services')
    why_choose_subtitle = models.CharField(max_length=200, default='Why Choose Us')
    why_choose_title = models.CharField(max_length=200, default='Craftsmanship Meets Elegance')
    why_choose_description = models.TextField(blank=True, default="We don't just renovate spaces; we craft environments that reflect your personal style while ensuring durability and flawless execution.")
    why_choose_image = models.ImageField(upload_to='why_choose/', blank=True, null=True)
    process_section_subtitle = models.CharField(max_length=200, default='Our Process')
    process_section_title = models.CharField(max_length=200, default='A Refined Journey From Concept to Completion')
    process_section_description = models.TextField(blank=True, default='Every project is handled with thoughtful planning, premium craftsmanship, and a seamless execution process.')
    testimonial_section_subtitle = models.CharField(max_length=200, default='CLIENT STORIES')
    testimonial_section_title = models.CharField(max_length=200, default='Words of Trust')

    # CTA Section
    cta_title = models.CharField(max_length=200, default='Ready to Transform Your Space?')
    cta_description = models.TextField(blank=True, default='Book a consultation with our experts today and take the first step towards your dream Decor.')
    cta_button_text = models.CharField(max_length=100, default='Schedule Consultation')
    cta_background_image = models.ImageField(upload_to='cta/', blank=True, null=True)

    # Theme
    primary_color = models.CharField(max_length=20, blank=True, default='#C5A059')

    def save(self, *args, **kwargs):
        # Enforce singleton
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass # Prevent deletion

    def __str__(self):
        return "Site Settings"

    class Meta:
        verbose_name_plural = "Site Settings"

class WhyChooseUs(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='lucide:check-circle')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Why Choose Us"
        ordering = ['order', 'created_at']

class OurProcess(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='lucide:circle')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Our Process Steps"
        ordering = ['order', 'created_at']

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, default='Client')
    photo_url = models.URLField(blank=True, default='')
    rating = models.IntegerField(default=5)
    review = models.TextField()
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.role}"

    class Meta:
        verbose_name_plural = "Testimonials"
        ordering = ['order', 'created_at']

class SocialLink(models.Model):
    platform_name = models.CharField(max_length=50)
    url = models.URLField()
    icon = models.CharField(max_length=100, help_text="Iconify icon name e.g. lucide:twitter, mdi:telegram")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.platform_name

    class Meta:
        verbose_name_plural = "Social Links"
        ordering = ['order', 'created_at']

