interface DecisionTreeNode {
  question: string;
  response: string;
  children?: DecisionTreeNode[];
}

export const decisionTree: DecisionTreeNode = {
  question: "How can I assist you today?",
  response: "Here are some ways I can help you:",
  children: [
    {
      question: "How do I edit my profile?",
      response:
        "To edit your profile, log in, go to the dashboard, and click 'Profile' in the sidebar. Then click 'Edit Profile' and make your changes.",
    },
    {
      question: "How do I create an event?",
      response:
        "To create an event, log in, go to the dashboard, and click 'Create Event'. Fill out the event details, then save the event. It will appear under 'My Events'.",
    },
    {
      question: "How do I chat with coworkers?",
      response:
        "To chat with coworkers, go to the dashboard and select 'Co-Workers' in the sidebar. Choose an individual coworker or create a group to start chatting.",
      children: [
        {
          question: "Chat with an individual coworker.",
          response:
            "To chat with an individual coworker, choose their chat from the list and start messaging. If they are not in the list, add them as a coworker.",
        },
        {
          question: "Chat with a group.",
          response:
            "To chat with a group, select an existing group from the list or create a new group by clicking 'New Group'.",
        },
      ],
    },
    {
      question: "How do I save a chat transcript?",
      response:
        "At the end of your conversation, click 'Save Transcript'. A file will be downloaded to your device with the chat details.",
    },
    {
      question: "Can I rate the conversation?",
      response:
        "Yes, at the end of the chat, you’ll have the option to rate the conversation using a star system.",
    },
    {
      question: "How do I log out?",
      response:
        "To log out, click the 'Logout' button in the sidebar or at the bottom of the dashboard. This will sign you out of your account.",
    },
  ],
};
