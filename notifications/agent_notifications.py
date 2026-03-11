# Agent Notifications System
import requests

class NotificationSystem:
    def send_notification(self, agent_id, message):
        # Logic to send notifications to agents
        requests.post(f'http://agents/{agent_id}/notify', data={'message': message})

# Example of sending a notification
if __name__ == '__main__':
    notification_system = NotificationSystem()
    notification_system.send_notification('agent_123', 'Your task has been completed successfully!')
