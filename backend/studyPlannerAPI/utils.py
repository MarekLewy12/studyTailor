from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(timestamp) + str(user.is_active)
        )

account_activation_token = AccountActivationTokenGenerator()

def generate_activation_link(user, domain):
    """Link aktywacyjny do konta"""
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    return f"http://{domain}/activate/{uid}/{token}/"