class FeedbackCollection:
    def __init__(self):
        self.feedback_store = []

    def collect_feedback(self, feedback):
        self.feedback_store.append(feedback)
        # Store or log feedback for future processing
        print('Feedback collected!')

feedback_collector = FeedbackCollection()