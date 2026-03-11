# Agent Notifications System - Enhanced
import requests

class NotificationSystem:
    def send_notification(self, agent_id, message):
        # Logic to send notifications to agents
        try:
            response = requests.post(f'http://agents/{agent_id}/notify', data={'message': message})
            if response.ok:
                log_event('Notification', f'Notification sent to {agent_id}')
            else:
                log_event('NotificationError', f'Failed to send notification to {agent_id}')
        except Exception as e:
            log_event('NotificationException', str(e))

# Example of sending a notification
if __name__ == '__main__':
    notification_system = NotificationSystem()
    notification_system.send_notification('agent_123', 'Your task has been completed successfully!')
