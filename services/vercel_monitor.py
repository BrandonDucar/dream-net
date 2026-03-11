import requests
import logging

class VercelMonitor:
    def __init__(self, deployment_id):
        self.deployment_id = deployment_id

    def check_deployment(self):
        # Logic to fetch deployment status
        response = requests.get(f'https://api.vercel.com/v1/deployments/{self.deployment_id}')
        if response.ok:
            # Process successful response
            logging.info('Deployment is healthy')
        else:
            logging.error(f'Deployment check failed: {response.text}')

# Example usage
if __name__ == '__main__':
    monitor = VercelMonitor('<YOUR_DEPLOYMENT_ID>')
    monitor.check_deployment()