# Agent Feedback System - Enhanced
from flask import Flask, request
import logging

app = Flask(__name__)

# Setup logging
logging.basicConfig(filename='feedback.log', level=logging.INFO)

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    message = data.get('message', 'No feedback provided')
    # Log the feedback message received
    logging.info(f'Feedback received: {message}')
    return 'Feedback received!', 200

if __name__ == '__main__':
    app.run(port=5500)
