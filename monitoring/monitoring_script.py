# Monitoring Script
import time
import requests

class MonitoringSystem:
    def check_email_status(self):
        # Logic to check the status of sent emails
        response = requests.get('/email/status_endpoint')  # Example endpoint
        return response.json()

    def check_sms_status(self):
        # Logic to check status of sent SMS
        response = requests.get('/sms/status_endpoint')  # Example endpoint
        return response.json()

    def log_event(self, event_info):
        # Log or process the event information from the webhook
        print(f'Event logged: {event_info}')

monitoring_system = MonitoringSystem()
while True:
    email_status = monitoring_system.check_email_status()
    sms_status = monitoring_system.check_sms_status()
    monitoring_system.log_event({'email_status': email_status, 'sms_status': sms_status})
    time.sleep(60)  # Check every minute
