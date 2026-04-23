from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared limiter instance – attach to app.state.limiter in main.py
limiter = Limiter(key_func=get_remote_address)
