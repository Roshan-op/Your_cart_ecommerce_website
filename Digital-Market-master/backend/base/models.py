from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import json



class Product(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('both', 'Both/Unisex'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200,null=True,blank=True)
    image = models.ImageField(null=True,blank=True,default='/placeholder.png') 
    brand = models.CharField(max_length=200,null=True,blank=True)
    category = models.CharField(max_length=200,null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    rating = models.DecimalField(max_digits=7,decimal_places=2,null=True,blank=True)
    numReviews = models.IntegerField(null=True,blank=True,default=0)
    price = models.DecimalField(max_digits=20,decimal_places=2,null=True,blank=True)
    countInStock = models.IntegerField(null=True,blank=True,default=0)
    
    # New Fields
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='both', null=True, blank=True)
    
    # Size information as JSON
    # For Clothing: "XS,S,M,L,XL"
    # For Footwear: "3,4,5,...,50"
    available_sizes = models.TextField(null=True, blank=True, help_text="Comma-separated sizes e.g., XS,S,M,L,XL or 3,4,5,6,7")
    
    # Additional images stored as JSON array of image URLs
    additional_images = models.TextField(null=True, blank=True, help_text="JSON array of image URLs")
    
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return self.name
    
    def get_additional_images(self):
        """Parse additional_images JSON"""
        if self.additional_images:
            try:
                return json.loads(self.additional_images)
            except:
                return []
        return []
    
    def set_additional_images(self, images_list):
        """Set additional_images from list"""
        self.additional_images = json.dumps(images_list)
    
    def get_available_sizes(self):
        """Parse available_sizes to list"""
        if self.available_sizes:
            return [s.strip() for s in self.available_sizes.split(',')]
        return []
    
    def set_available_sizes(self, sizes_list):
        """Set available_sizes from list"""
        self.available_sizes = ','.join(sizes_list)

class Review(models.Model):
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    name = models.CharField(max_length=200,null=True,blank=True)
    rating = models.IntegerField(null=True,blank=True,default=0)
    comment = models.TextField(null=True,blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, null=True,blank=True)
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return str(self.rating)

class Order(models.Model):
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    paymentMethod = models.CharField(max_length=200,null=True,blank=True)
    taxPrice = models.DecimalField(max_digits=20,decimal_places=2,null=True,blank=True)
    shippingPrice = models.DecimalField(max_digits=20,decimal_places=2,null=True,blank=True)
    totalPrice = models.DecimalField(max_digits=20,decimal_places=2,null=True,blank=True)
    ispaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True,blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True,blank=True)
    createdAt = models.DateTimeField(auto_now_add=True, null=True,blank=True)
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return str(self.createdAt)

class OrderItem(models.Model):
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    order = models.ForeignKey(Order,on_delete=models.SET_NULL,null=True)
    name = models.CharField(max_length=200,null=True,blank=True)
    qty = models.IntegerField(null=True,blank=True,default=0)
    price = models.DecimalField(max_digits=20,decimal_places=2,null=True,blank=True)
    image = models.CharField(max_length=200,null=True,blank=True)
    
    # Selected size and gender for this item
    selected_size = models.CharField(max_length=10, null=True, blank=True)
    selected_gender = models.CharField(max_length=10, null=True, blank=True)
    
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return str(self.name)

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order,on_delete=models.CASCADE,null=True,blank=True)
    address = models.CharField(max_length=200,null=True,blank=True)
    city = models.CharField(max_length=200,null=True,blank=True)
    PhoneNumber = models.CharField( max_length=15,null=True,blank=True)
    shippingPrice = models.DecimalField(max_digits=5,decimal_places=2,null=True,blank=True)
    _id = models.AutoField(primary_key=True,editable=False)

    def __str__(self):
        return str(self.address)
   