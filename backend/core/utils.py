from decouple import config
import smtplib, re

email = config("EMAIL")
password = config("PASSWORD")

CUSTOM_PROFANE_WORDS = config("CUSTOM_PROFANITY").split(",")

BAD_WORDS = [word.strip() for word in CUSTOM_PROFANE_WORDS if word.strip()]


def send_email(message):
    if  not message :
        return False
    else:
        try:
            with  smtplib.SMTP('smtp.gmail.com') as connection:
                connection.starttls()
                connection.login(user=email, password=password)
                connection.sendmail(from_addr=email,
                                    to_addrs="abhisarverma163@gmail.com",
                                    msg=f'Subject:MyTuneTale Website User Review\n\n{message}')
        except Exception as e :
            return False

        else:
            return True  

def is_clean_text(text):
    text = text.lower()

    for pattern in BAD_WORDS:
        pattern = pattern.strip().lower()

        if ' ' in pattern:
            if pattern in text:
                return False
        else:
            regex = re.compile(r'\b' + re.escape(pattern) + r'\b')
            if regex.search(text):
                return False

    return True