import { jest } from '@jest/globals';

const mockChatSave = jest.fn().mockResolvedValue(true);
const mockChatFind = jest.fn();
const mockUserFindOne = jest.fn();

jest.unstable_mockModule('../models/Chat.js', () => {
  const MockChat = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockChatSave,
  }));
  MockChat.find = mockChatFind;
  return { default: MockChat };
});

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn();
  MockUser.findOne = mockUserFindOne;
  MockUser.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
  return { default: MockUser };
});

jest.unstable_mockModule('crypto', () => ({
  default: {
    randomBytes: () => ({
      toString: () => 'AABB1122',
    }),
  },
}));

const { sendMessage, getChatHistory, getMutualFriends, createGroupChat } = await import('../controllers/chatController.js');

describe('chatController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should block AI from sending messages', async () => {
      req.body = { senderId: 'AI', receiverId: 'user-1', roomId: 'AI_user-1', text: 'hello' };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: expect.stringContaining('AI') })
      );
    });

    it('should block AI as receiver', async () => {
      req.body = { senderId: 'user-1', receiverId: 'AI', roomId: 'user-1_AI', text: 'hello' };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should block non-mutual connections in personal chat', async () => {
      const sender = { trinetraId: 'user-1', following: ['user-2'] };
      const receiver = { trinetraId: 'user-2', following: [] }; // not following back
      mockUserFindOne
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      req.body = { senderId: 'user-1', receiverId: 'user-2', roomId: 'user-1_user-2', text: 'hello' };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('Mutual') })
      );
    });

    it('should allow message between mutual connections', async () => {
      const sender = { trinetraId: 'user-1', following: ['user-2'] };
      const receiver = { trinetraId: 'user-2', following: ['user-1'] };
      mockUserFindOne
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      req.body = { senderId: 'user-1', receiverId: 'user-2', roomId: 'user-1_user-2', text: 'hello' };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should bypass mutual check for group chats', async () => {
      // Group chat roomId does not contain underscore
      req.body = { senderId: 'user-1', receiverId: 'user-2', roomId: 'GROUP12345', text: 'group msg' };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockUserFindOne).not.toHaveBeenCalled();
    });

    it('should save message with media', async () => {
      req.body = {
        senderId: 'user-1',
        receiverId: 'user-2',
        roomId: 'GROUPCHAT',
        text: '',
        mediaUrl: 'https://s3.amazonaws.com/photo.jpg',
        mediaType: 'image',
      };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockChatSave).toHaveBeenCalled();
    });
  });

  describe('getChatHistory', () => {
    it('should fetch messages for a room sorted by timestamp', async () => {
      const mockMessages = [{ text: 'hi' }, { text: 'hello' }];
      mockChatFind.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockMessages) });

      req.body = { user1: 'alice', user2: 'bob' };

      await getChatHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, messages: mockMessages })
      );
    });

    it('should generate consistent roomId regardless of user order', async () => {
      const mockMessages = [];
      mockChatFind.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockMessages) });

      req.body = { user1: 'bob', user2: 'alice' };
      await getChatHistory(req, res);

      // roomId should be sorted: alice_bob
      expect(mockChatFind).toHaveBeenCalledWith({ roomId: 'alice_bob' });
    });
  });

  describe('getMutualFriends', () => {
    it('should return 404 if user not found', async () => {
      mockUserFindOne.mockResolvedValue(null);
      req.query = { userId: 'nonexistent' };

      await getMutualFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return mutual friends list', async () => {
      const currentUser = { trinetraId: 'user-1', following: ['user-2', 'user-3'] };
      mockUserFindOne.mockResolvedValue(currentUser);

      const { default: User } = await import('../models/User.js');
      const mockMutuals = [{ trinetraId: 'user-2', name: 'User 2' }];
      User.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(mockMutuals) });

      req.query = { userId: 'user-1' };

      await getMutualFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, friends: mockMutuals })
      );
    });
  });

  describe('createGroupChat', () => {
    it('should return 400 if group name is missing', async () => {
      req.body = { name: '', members: ['user-1'], admin: 'user-1' };

      await createGroupChat(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if members array is empty', async () => {
      req.body = { name: 'Test Group', members: [], admin: 'user-1' };

      await createGroupChat(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create group chat successfully', async () => {
      req.body = { name: 'Dev Group', members: ['user-1', 'user-2'], admin: 'user-1' };

      await createGroupChat(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.groupId).toContain('GROUP-');
    });
  });
});
