# Improved error handling
if response and response.get('status') is not None:
    # proceed with processing
else:
    log_event('API Integration Error', 'Received undefined status from response')
