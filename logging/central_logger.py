import logging

# Configure central logging
logging.basicConfig(filename='central_logging.log', level=logging.INFO)

def log_event(event_type, message):
    logging.info(f'{event_type}: {message}')

# Example usage
if __name__ == '__main__':
    log_event('Initialization', 'Central logging system is running.')