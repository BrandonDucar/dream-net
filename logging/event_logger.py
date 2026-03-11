# Centralized Event Logger
import logging

# Configure logging
logging.basicConfig(filename='event_log.log', level=logging.INFO)

# Function to log events with structured information

def log_event(event_type, message):
    logging.info(f'{event_type}: {message}')

# Example usage
if __name__ == '__main__':
    log_event('Initialization', 'Event logging system has been initialized.')
