# Generated migration for adding sizes, gender, and images support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_shippingaddress_country_shippingaddress_postalcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='gender',
            field=models.CharField(
                blank=True,
                choices=[('male', 'Male'), ('female', 'Female'), ('both', 'Both/Unisex')],
                default='both',
                max_length=10,
                null=True
            ),
        ),
        migrations.AddField(
            model_name='product',
            name='available_sizes',
            field=models.TextField(
                blank=True,
                help_text='Comma-separated sizes e.g., XS,S,M,L,XL or 3,4,5,6,7',
                null=True
            ),
        ),
        migrations.AddField(
            model_name='product',
            name='additional_images',
            field=models.TextField(
                blank=True,
                help_text='JSON array of image URLs',
                null=True
            ),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='selected_size',
            field=models.CharField(
                blank=True,
                max_length=10,
                null=True
            ),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='selected_gender',
            field=models.CharField(
                blank=True,
                max_length=10,
                null=True
            ),
        ),
    ]
