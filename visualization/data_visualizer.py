import matplotlib.pyplot as plt

class DataVisualizer:
    def plot_data(self, data):
        plt.plot(data)
        plt.title('Performance Metrics')
        plt.show()

# Example usage
if __name__ == '__main__':
    visualizer = DataVisualizer()