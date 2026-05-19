from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import secrets
import string


def gen_password(length=14):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


class Command(BaseCommand):
    help = 'Create or update a superuser and a vendor user. Prints passwords created.'

    def add_arguments(self, parser):
        parser.add_argument('--superuser', type=str, default='admin')
        parser.add_argument('--superemail', type=str, default='admin@example.com')
        parser.add_argument('--superpass', type=str, default='')

        parser.add_argument('--vendor', type=str, default='vendor1')
        parser.add_argument('--vendoremail', type=str, default='vendor@example.com')
        parser.add_argument('--vendorpass', type=str, default='')

    def handle(self, *args, **options):
        User = get_user_model()

        su_username = options['superuser']
        su_email = options['superemail']
        su_pass = options['superpass'] or gen_password()

        v_username = options['vendor']
        v_email = options['vendoremail']
        v_pass = options['vendorpass'] or gen_password()

        # Superuser
        try:
            su = User.objects.filter(username=su_username).first()
            if su:
                su.email = su_email
                su.is_staff = True
                su.is_superuser = True
                su.set_password(su_pass)
                su.save()
                self.stdout.write(self.style.SUCCESS(f'Updated superuser: {su_username}'))
            else:
                User.objects.create_superuser(username=su_username, email=su_email, password=su_pass)
                self.stdout.write(self.style.SUCCESS(f'Created superuser: {su_username}'))
        except Exception as e:
            self.stderr.write(f'Error creating/updating superuser: {e}')

        # Vendor (regular user)
        try:
            vu = User.objects.filter(username=v_username).first()
            if vu:
                vu.email = v_email
                vu.set_password(v_pass)
                vu.save()
                self.stdout.write(self.style.SUCCESS(f'Updated vendor user: {v_username}'))
            else:
                u = User.objects.create_user(username=v_username, email=v_email, password=v_pass)
                # mark as not staff by default; adapt if your project uses a Vendor model
                u.is_staff = False
                u.save()
                self.stdout.write(self.style.SUCCESS(f'Created vendor user: {v_username}'))
        except Exception as e:
            self.stderr.write(f'Error creating/updating vendor user: {e}')

        self.stdout.write('\nCredentials:')
        self.stdout.write(f'Superuser: {su_username} | {su_email} | {su_pass}')
        self.stdout.write(f'Vendor: {v_username} | {v_email} | {v_pass}')
