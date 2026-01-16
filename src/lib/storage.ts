import { User, ConnectionRequest, Connection, Message, Conversation, Notification, PREDEFINED_SKILLS } from '@/types';

const STORAGE_KEYS = {
  USERS: 'skillswap_users',
  CURRENT_USER: 'skillswap_current_user',
  CONNECTION_REQUESTS: 'skillswap_connection_requests',
  CONNECTIONS: 'skillswap_connections',
  MESSAGES: 'skillswap_messages',
  CONVERSATIONS: 'skillswap_conversations',
  NOTIFICATIONS: 'skillswap_notifications',
};

// Helper to generate unique IDs
export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'skillsKnown' | 'skillsWanted'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    skillsKnown: [],
    skillsWanted: [],
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
};

// Current User Session
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Connection Requests
export const getConnectionRequests = (): ConnectionRequest[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
  return data ? JSON.parse(data) : [];
};

export const saveConnectionRequests = (requests: ConnectionRequest[]) => {
  localStorage.setItem(STORAGE_KEYS.CONNECTION_REQUESTS, JSON.stringify(requests));
};

export const createConnectionRequest = (request: Omit<ConnectionRequest, 'id' | 'createdAt' | 'status'>): ConnectionRequest => {
  const requests = getConnectionRequests();
  const newRequest: ConnectionRequest = {
    ...request,
    id: generateId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  saveConnectionRequests(requests);
  return newRequest;
};

export const updateConnectionRequest = (requestId: string, status: 'accepted' | 'declined'): ConnectionRequest | null => {
  const requests = getConnectionRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index === -1) return null;
  
  requests[index].status = status;
  saveConnectionRequests(requests);
  return requests[index];
};

// Connections
export const getConnections = (): Connection[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveConnections = (connections: Connection[]) => {
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
};

export const createConnection = (user1Id: string, user2Id: string, skillId: string): Connection => {
  const connections = getConnections();
  const newConnection: Connection = {
    id: generateId(),
    user1Id,
    user2Id,
    skillId,
    createdAt: new Date().toISOString(),
  };
  connections.push(newConnection);
  saveConnections(connections);
  return newConnection;
};

export const getUserConnections = (userId: string): Connection[] => {
  return getConnections().filter(c => c.user1Id === userId || c.user2Id === userId);
};

// Conversations
export const getConversations = (): Conversation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  return data ? JSON.parse(data) : [];
};

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
};

export const getOrCreateConversation = (participantIds: string[]): Conversation => {
  const conversations = getConversations();
  const sortedIds = [...participantIds].sort();
  
  let conversation = conversations.find(c => {
    const cIds = [...c.participantIds].sort();
    return cIds.length === sortedIds.length && cIds.every((id, i) => id === sortedIds[i]);
  });
  
  if (!conversation) {
    conversation = {
      id: generateId(),
      participantIds: sortedIds,
      updatedAt: new Date().toISOString(),
    };
    conversations.push(conversation);
    saveConversations(conversations);
  }
  
  return conversation;
};

export const getUserConversations = (userId: string): Conversation[] => {
  return getConversations()
    .filter(c => c.participantIds.includes(userId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

// Messages
export const getMessages = (): Message[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return data ? JSON.parse(data) : [];
};

export const saveMessages = (messages: Message[]) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
};

export const getConversationMessages = (conversationId: string): Message[] => {
  return getMessages()
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const sendMessage = (conversationId: string, senderId: string, content: string): Message => {
  const messages = getMessages();
  const newMessage: Message = {
    id: generateId(),
    conversationId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(newMessage);
  saveMessages(messages);
  
  // Update conversation's last message
  const conversations = getConversations();
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = newMessage;
    conversations[convIndex].updatedAt = newMessage.createdAt;
    saveConversations(conversations);
  }
  
  return newMessage;
};

export const markMessagesAsRead = (conversationId: string, userId: string) => {
  const messages = getMessages();
  let updated = false;
  
  messages.forEach(m => {
    if (m.conversationId === conversationId && m.senderId !== userId && !m.read) {
      m.read = true;
      updated = true;
    }
  });
  
  if (updated) {
    saveMessages(messages);
  }
};

// Notifications
export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
};

export const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const getUserNotifications = (userId: string): Notification[] => {
  return getNotifications()
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: generateId(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(newNotification);
  saveNotifications(notifications);
  return newNotification;
};

export const markNotificationAsRead = (notificationId: string) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
};

export const markAllNotificationsAsRead = (userId: string) => {
  const notifications = getNotifications();
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  saveNotifications(notifications);
};

export const getUnreadNotificationCount = (userId: string): number => {
  return getNotifications().filter(n => n.userId === userId && !n.read).length;
};

// Initialize demo data
export const initializeDemoData = () => {
  const users = getUsers();
  if (users.length > 0) return; // Already initialized
  
  // Create demo users
  const demoUsers: User[] = [
    {
      id: 'demo-1',
      email: 'alice@example.com',
      name: 'Alice Johnson',
      bio: 'Passionate developer who loves teaching React and learning new languages!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      createdAt: new Date().toISOString(),
      skillsKnown: [
        { id: 'us-1', skillId: 'skill-3', skill: PREDEFINED_SKILLS[2], proficiency: 'expert', type: 'knows' },
        { id: 'us-2', skillId: 'skill-1', skill: PREDEFINED_SKILLS[0], proficiency: 'expert', type: 'knows' },
      ],
      skillsWanted: [
        { id: 'us-3', skillId: 'skill-12', skill: PREDEFINED_SKILLS[11], type: 'wants' },
        { id: 'us-4', skillId: 'skill-7', skill: PREDEFINED_SKILLS[6], type: 'wants' },
      ],
    },
    {
      id: 'demo-2',
      email: 'bob@example.com',
      name: 'Bob Smith',
      bio: 'Music lover and Spanish tutor. Always looking to exchange skills!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      createdAt: new Date().toISOString(),
      skillsKnown: [
        { id: 'us-5', skillId: 'skill-7', skill: PREDEFINED_SKILLS[6], proficiency: 'intermediate', type: 'knows' },
        { id: 'us-6', skillId: 'skill-12', skill: PREDEFINED_SKILLS[11], proficiency: 'expert', type: 'knows' },
      ],
      skillsWanted: [
        { id: 'us-7', skillId: 'skill-3', skill: PREDEFINED_SKILLS[2], type: 'wants' },
        { id: 'us-8', skillId: 'skill-25', skill: PREDEFINED_SKILLS[24], type: 'wants' },
      ],
    },
    {
      id: 'demo-3',
      email: 'carol@example.com',
      name: 'Carol Williams',
      bio: 'Yoga instructor and aspiring photographer. Love to share knowledge!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
      createdAt: new Date().toISOString(),
      skillsKnown: [
        { id: 'us-9', skillId: 'skill-25', skill: PREDEFINED_SKILLS[24], proficiency: 'expert', type: 'knows' },
        { id: 'us-10', skillId: 'skill-17', skill: PREDEFINED_SKILLS[16], proficiency: 'intermediate', type: 'knows' },
      ],
      skillsWanted: [
        { id: 'us-11', skillId: 'skill-23', skill: PREDEFINED_SKILLS[22], type: 'wants' },
        { id: 'us-12', skillId: 'skill-2', skill: PREDEFINED_SKILLS[1], type: 'wants' },
      ],
    },
  ];
  
  saveUsers(demoUsers);
};
