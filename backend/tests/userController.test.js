import { jest } from '@jest/globals';

const mockUserFindOne = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue(true);

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn();
  MockUser.findOne = mockUserFindOne;
  return { default: MockUser };
});

const { updateSettings, handleFollow } = await import('../controllers/userController.js');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('updateSettings', () => {
    it('should return 404 if user not found by trinetraId', async () => {
      mockUserFindOne.mockResolvedValue(null);
      req.body = { trinetraId: 'TRN-NOTEXIST', bio: 'test' };

      await updateSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should update profile fields (bio, profilePic)', async () => {
      const mockUser = {
        trinetraId: 'TRN-ABC123',
        bio: '',
        profilePic: '',
        coverPic: '',
        settings: {},
        markModified: jest.fn(),
        save: mockUserSave,
      };
      mockUserFindOne.mockResolvedValue(mockUser);

      req.body = { trinetraId: 'TRN-ABC123', bio: 'New bio', profilePic: 'https://s3.aws/pic.jpg' };

      await updateSettings(req, res);

      expect(mockUser.bio).toBe('New bio');
      expect(mockUser.profilePic).toBe('https://s3.aws/pic.jpg');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update deep settings (preferences)', async () => {
      const mockUser = {
        trinetraId: 'TRN-ABC123',
        settings: { preferences: { darkMode: true } },
        markModified: jest.fn(),
        save: mockUserSave,
      };
      mockUserFindOne.mockResolvedValue(mockUser);

      req.body = { trinetraId: 'TRN-ABC123', preferences: { darkMode: false, language: 'hi' } };

      await updateSettings(req, res);

      expect(mockUser.settings.preferences).toEqual(
        expect.objectContaining({ darkMode: false, language: 'hi' })
      );
      expect(mockUser.markModified).toHaveBeenCalledWith('settings');
    });

    it('should update 3D avatar URL', async () => {
      const mockUser = {
        trinetraId: 'TRN-ABC123',
        avatar3dUrl: '',
        settings: {},
        markModified: jest.fn(),
        save: mockUserSave,
      };
      mockUserFindOne.mockResolvedValue(mockUser);

      req.body = { trinetraId: 'TRN-ABC123', avatar3dUrl: 'https://s3.aws/avatar.glb' };

      await updateSettings(req, res);

      expect(mockUser.avatar3dUrl).toBe('https://s3.aws/avatar.glb');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should initialize settings object if it does not exist', async () => {
      const mockUser = {
        trinetraId: 'TRN-ABC123',
        settings: null,
        markModified: jest.fn(),
        save: mockUserSave,
      };
      mockUserFindOne.mockResolvedValue(mockUser);

      req.body = { trinetraId: 'TRN-ABC123', preferences: { darkMode: true } };

      await updateSettings(req, res);

      expect(mockUser.settings).toBeDefined();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('handleFollow', () => {
    it('should block self-following', async () => {
      req.body = { myId: 'TRN-USER1', targetId: 'TRN-USER1', action: 'follow' };

      await handleFollow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('cannot follow yourself') })
      );
    });

    it('should return 404 if either user not found', async () => {
      mockUserFindOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ trinetraId: 'TRN-USER2' });

      req.body = { myId: 'TRN-NONEXIST', targetId: 'TRN-USER2', action: 'follow' };

      await handleFollow(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should follow a user successfully', async () => {
      const me = { trinetraId: 'TRN-USER1', following: [], followers: [], save: mockUserSave };
      const them = { trinetraId: 'TRN-USER2', following: [], followers: [], save: mockUserSave };
      mockUserFindOne
        .mockResolvedValueOnce(me)
        .mockResolvedValueOnce(them);

      req.body = { myId: 'TRN-USER1', targetId: 'TRN-USER2', action: 'follow' };

      await handleFollow(req, res);

      expect(me.following).toContain('TRN-USER2');
      expect(them.followers).toContain('TRN-USER1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should unfollow a user successfully', async () => {
      const me = { trinetraId: 'TRN-USER1', following: ['TRN-USER2'], followers: [], save: mockUserSave };
      const them = { trinetraId: 'TRN-USER2', following: [], followers: ['TRN-USER1'], save: mockUserSave };
      mockUserFindOne
        .mockResolvedValueOnce(me)
        .mockResolvedValueOnce(them);

      req.body = { myId: 'TRN-USER1', targetId: 'TRN-USER2', action: 'unfollow' };

      await handleFollow(req, res);

      expect(me.following).not.toContain('TRN-USER2');
      expect(them.followers).not.toContain('TRN-USER1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should detect mutual connection status', async () => {
      const me = { trinetraId: 'TRN-USER1', following: ['TRN-USER2'], followers: ['TRN-USER2'], save: mockUserSave };
      const them = { trinetraId: 'TRN-USER2', following: ['TRN-USER1'], followers: ['TRN-USER1'], save: mockUserSave };
      mockUserFindOne
        .mockResolvedValueOnce(me)
        .mockResolvedValueOnce(them);

      req.body = { myId: 'TRN-USER1', targetId: 'TRN-USER2', action: 'follow' };

      await handleFollow(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.isMutualConnection).toBe(true);
      expect(response.messengerStatus).toBe('UNLOCKED');
    });

    it('should return LOCKED messenger status for non-mutual', async () => {
      const me = { trinetraId: 'TRN-USER1', following: [], followers: [], save: mockUserSave };
      const them = { trinetraId: 'TRN-USER2', following: [], followers: [], save: mockUserSave };
      mockUserFindOne
        .mockResolvedValueOnce(me)
        .mockResolvedValueOnce(them);

      req.body = { myId: 'TRN-USER1', targetId: 'TRN-USER2', action: 'follow' };

      await handleFollow(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.isMutualConnection).toBe(false);
      expect(response.messengerStatus).toBe('LOCKED');
    });

    it('should return 400 for invalid action', async () => {
      const me = { trinetraId: 'TRN-USER1', following: [], followers: [], save: mockUserSave };
      const them = { trinetraId: 'TRN-USER2', following: [], followers: [], save: mockUserSave };
      mockUserFindOne
        .mockResolvedValueOnce(me)
        .mockResolvedValueOnce(them);

      req.body = { myId: 'TRN-USER1', targetId: 'TRN-USER2', action: 'block' };

      await handleFollow(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
