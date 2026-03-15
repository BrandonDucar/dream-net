import smtplib
from email.mime.text import MIMEText

class PerformanceAlerts:
    def send_alert(self, message):
        # Logic to send an email alert
        msg = MIMEText(message)
        msg['Subject'] = 'Performance Alert'
        # Set up your email details
        smtp = smtplib.SMTP('localhost')
        smtp.send_message(msg)
        smtp.quit()

# Example usage
if __name__ == '__main__':
    alert = PerformanceAlerts()
    alert.send_alert('High latency detected!')