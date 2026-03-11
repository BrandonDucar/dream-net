# Feedback Logging System
import logging

# Configure logging for feedback
logging.basicConfig(filename='feedback.log', level=logging.INFO)

class FeedbackManager:
    def log_feedback(self, message):
        logging.info(f'Feedback logged: {message}')  # Log user feedback

# Example of logging feedback
if __name__ == '__main__':
    feedback_manager = FeedbackManager()
    feedback_manager.log_feedback('This is a test feedback message.')
