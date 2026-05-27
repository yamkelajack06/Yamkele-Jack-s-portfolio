# Email sending logic using Gmail SMTP

import smtplib
import os
from email.message import EmailMessage
from typing import Optional

def send_contact_email(name: str, from_email: str, message: str) -> tuple[bool, Optional[str]]:
    """
    Sends an email from your portfolio contact form.
    Returns (success, error_message).
    """
    # Load SMTP configuration from environment
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    username = os.getenv("SMTP_USERNAME")      # Gmail address
    password = os.getenv("SMTP_PASSWORD")      # Gmail App Password
    to_email = os.getenv("TO_EMAIL", "yamkelajack06@gmail.com")

    # Guard against missing credentials
    if not username or not password:
        return False, "SMTP credentials not configured (SMTP_USERNAME or SMTP_PASSWORD missing)"

    # Build the email
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio Contact from {name}"
    msg["From"] = username
    msg["To"] = to_email
    msg["Reply-To"] = from_email

    body = f"Name: {name}\nEmail: {from_email}\n\nMessage:\n{message}"
    msg.set_content(body)

    # Send the email
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(msg)
        return True, None
    except Exception as e:
        return False, str(e)