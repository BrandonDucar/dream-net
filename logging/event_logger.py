# Centralized Event Logger
import logging

# Configure logging
logging.basicConfig(filename='event_log.log', level=logging.INFO)

def log_event(event_info):
    logging.info(f'Event logged: {event_info}')

# Example usage
if __name__ == '__main__':
    log_event('Test event initiated')
