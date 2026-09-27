import hashlib
import os

def hash_password(password: str) -> str:
    """
    Hashes a password using PBKDF2-HMAC-SHA256 with a secure salt.
    Format: salt$hex_hash
    """
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return f"{salt}${key}"

def verify_password(password: str, password_hash: str) -> bool:
    """
    Verifies a password against a stored PBKDF2-HMAC-SHA256 hash.
    """
    if not password_hash or "$" not in password_hash:
        return False
    try:
        salt, stored_key = password_hash.split("$", 1)
        key = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()
        return key == stored_key
    except Exception:
        return False
