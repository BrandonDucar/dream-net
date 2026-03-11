class InterAgentComm:
    def send_message(self, agent, message):
        # Logic to send messages to other agents
        print(f'Message sent to {agent}: {message}')

# Example usage
if __name__ == '__main__':
    comm = InterAgentComm()
    comm.send_message('Clawedette', 'Hello from DreamNet!')