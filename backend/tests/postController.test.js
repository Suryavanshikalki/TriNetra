import { jest } from '@jest/globals';

const mockPostSave = jest.fn().mockResolvedValue(true);
const mockUserFindById = jest.fn();
const mockUserFindOne = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue(true);

jest.unstable_mockModule('../models/Post.js', () => {
  const MockPost = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockPostSave,
  }));
  return { default: MockPost };
});

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn();
  MockUser.findById = mockUserFindById;
  MockUser.findOne = mockUserFindOne;
  return { default: MockUser };
});

jest.unstable_mockModule('crypto', () => ({
  default: {
    randomBytes: () => ({ toString: () => 'AABBCCDDEE11' }),
  },
}));

const { createPost, updateProfile, toggleFollowUser, toggleBlockUser } = await import('../controllers/postController.js');

describe('postController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should return 404 if user not found', async () => {
      mockUserFindById.mockResolvedValue(null);
      req.body = { userId: 'nonexistent', content: 'Hello' };

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should create a text post successfully', async () => {
      mockUserFindById.mockResolvedValue({ _id: 'user-1', name: 'Test User' });
      req.body = { userId: 'user-1', content: 'My first post!' };

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockPostSave).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
    });

    it('should create a reel post', async () => {
      mockUserFindById.mockResolvedValue({ _id: 'user-1', name: 'Test User' });
      req.body = {
        userId: 'user-1',
        content: 'New reel!',
        mediaUrl: 'https://s3.aws/reel.mp4',
        mediaType: 'video',
        isReel: true,
      };

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should create a marketplace item with price', async () => {
      mockUserFindById.mockResolvedValue({ _id: 'user-1', name: 'Seller' });
      req.body = {
        userId: 'user-1',
        content: 'Selling laptop',
        isMarketplace: true,
        price: 45000,
        currency: 'INR',
        productCondition: 'Used',
      };

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle database errors gracefully', async () => {
      mockUserFindById.mockRejectedValue(new Error('DB error'));
      req.body = { userId: 'user-1', content: 'Post' };

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateProfile', () => {
    it('should return 404 if user not found', async () => {
      mockUserFindById.mockResolvedValue(null);
      req.body = { userId: 'nonexistent', bio: 'test' };

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update bio and profile picture', async () => {
      const mockUser = { bio: '', profilePic: '', avatar3dUrl: '', coverPic: '', save: mockUserSave };
      mockUserFindById.mockResolvedValue(mockUser);
      req.body = { userId: 'user-1', bio: 'Updated bio', profilePic: 'https://pic.jpg' };

      await updateProfile(req, res);

      expect(mockUser.bio).toBe('Updated bio');
      expect(mockUser.profilePic).toBe('https://pic.jpg');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update 3D avatar URL', async () => {
      const mockUser = { bio: '', profilePic: '', avatar3dUrl: '', coverPic: '', save: mockUserSave };
      mockUserFindById.mockResolvedValue(mockUser);
      req.body = { userId: 'user-1', avatar3dUrl: 'https://avatar.glb' };

      await updateProfile(req, res);

      expect(mockUser.avatar3dUrl).toBe('https://avatar.glb');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('toggleFollowUser', () => {
    it('should block self-following', async () => {
      req.body = { followerId: 'TRN-USER1', targetUserId: 'TRN-USER1' };

      await toggleFollowUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if either user not found', async () => {
      mockUserFindOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ trinetraId: 'TRN-USER2' });
      req.body = { followerId: 'TRN-GONE', targetUserId: 'TRN-USER2' };

      await toggleFollowUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should follow a user when not already following', async () => {
      const follower = { trinetraId: 'TRN-A', name: 'A', following: [], followers: [], save: mockUserSave };
      const target = { trinetraId: 'TRN-B', name: 'B', following: [], followers: [], save: mockUserSave };
      mockUserFindOne.mockResolvedValueOnce(follower).mockResolvedValueOnce(target);
      req.body = { followerId: 'TRN-A', targetUserId: 'TRN-B' };

      await toggleFollowUser(req, res);

      expect(follower.following).toContain('TRN-B');
      expect(target.followers).toContain('TRN-A');
      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.action).toBe('follow');
    });

    it('should unfollow a user when already following', async () => {
      const follower = { trinetraId: 'TRN-A', name: 'A', following: ['TRN-B'], followers: [], save: mockUserSave };
      const target = { trinetraId: 'TRN-B', name: 'B', following: [], followers: ['TRN-A'], save: mockUserSave };
      mockUserFindOne.mockResolvedValueOnce(follower).mockResolvedValueOnce(target);
      req.body = { followerId: 'TRN-A', targetUserId: 'TRN-B' };

      await toggleFollowUser(req, res);

      expect(follower.following).not.toContain('TRN-B');
      expect(target.followers).not.toContain('TRN-A');
      const response = res.json.mock.calls[0][0];
      expect(response.action).toBe('unfollow');
    });

    it('should detect mutual connection after follow', async () => {
      const follower = { trinetraId: 'TRN-A', name: 'A', following: [], followers: ['TRN-B'], save: mockUserSave };
      const target = { trinetraId: 'TRN-B', name: 'B', following: ['TRN-A'], followers: [], save: mockUserSave };
      mockUserFindOne.mockResolvedValueOnce(follower).mockResolvedValueOnce(target);
      req.body = { followerId: 'TRN-A', targetUserId: 'TRN-B' };

      await toggleFollowUser(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.isMutualConnection).toBe(true);
    });
  });

  describe('toggleBlockUser', () => {
    it('should return 404 if user not found', async () => {
      mockUserFindOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      req.body = { blockerId: 'TRN-A', targetUserId: 'TRN-B' };

      await toggleBlockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should block a user and remove mutual connections', async () => {
      const blocker = {
        trinetraId: 'TRN-A',
        blockedUsers: [],
        following: ['TRN-B'],
        followers: ['TRN-B'],
        save: mockUserSave,
      };
      const target = {
        trinetraId: 'TRN-B',
        following: ['TRN-A'],
        followers: ['TRN-A'],
        save: mockUserSave,
      };
      mockUserFindOne.mockResolvedValueOnce(blocker).mockResolvedValueOnce(target);
      req.body = { blockerId: 'TRN-A', targetUserId: 'TRN-B' };

      await toggleBlockUser(req, res);

      expect(blocker.blockedUsers).toContain('TRN-B');
      expect(blocker.following).not.toContain('TRN-B');
      expect(blocker.followers).not.toContain('TRN-B');
      expect(target.following).not.toContain('TRN-A');
      expect(target.followers).not.toContain('TRN-A');
      const response = res.json.mock.calls[0][0];
      expect(response.action).toBe('block');
    });

    it('should unblock a previously blocked user', async () => {
      const blocker = {
        trinetraId: 'TRN-A',
        blockedUsers: ['TRN-B'],
        following: [],
        followers: [],
        save: mockUserSave,
      };
      const target = {
        trinetraId: 'TRN-B',
        following: [],
        followers: [],
        save: mockUserSave,
      };
      mockUserFindOne.mockResolvedValueOnce(blocker).mockResolvedValueOnce(target);
      req.body = { blockerId: 'TRN-A', targetUserId: 'TRN-B' };

      await toggleBlockUser(req, res);

      expect(blocker.blockedUsers).not.toContain('TRN-B');
      const response = res.json.mock.calls[0][0];
      expect(response.action).toBe('unblock');
    });
  });
});
