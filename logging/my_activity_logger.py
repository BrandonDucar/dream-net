import logging

# Configure logging
logging.basicConfig(filename='activity.log', level=logging.INFO)

def log_activity(action):
    logging.info(f'Action performed: {action}')

# Example usage
if __name__ == '__main__':
    log_activity('Initialized logging module')