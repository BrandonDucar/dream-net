import psutil
import logging

class ResourceMonitor:
    def log_resources(self):
        mem = psutil.virtual_memory()
        cpu = psutil.cpu_percent()
        logging.info(f'Memory Usage: {mem.percent}%, CPU Usage: {cpu}%')

# Example usage
if __name__ == '__main__':
    monitor = ResourceMonitor()
    monitor.log_resources()