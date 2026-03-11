# Agent Feedback System
from flask import Flask, request

app = Flask(__name__)

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    # Process the feedback from agents
    print(f'Feedback received: {data}')
    return 'Feedback received!', 200

if __name__ == '__main__':
    app.run(port=5500)
