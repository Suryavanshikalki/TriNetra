import { jest } from '@jest/globals';

// Mock dependencies before importing the module
const mockUserFindOne = jest.fn();
const mockUserSave = jest.fn();
const mockJwtSign = jest.fn();

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'mock-id-123',
    save: mockUserSave,
  }));
  MockUser.findOne = mockUserFindOne;
  return { default: MockUser };
});

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: mockJwtSign },
}));

const { registerOrLogin, updateDeepSettings } = await import('../controllers/authController.js');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    mockJwtSign.mockReturnValue('mock-token-xyz');
    mockUserSave.mockResolvedValue(true);
  });

  describe('registerOrLogin', () => {
    it('should return 400 if neither phone nor email is provided', async () => {
      req.body = { method: 'email' };

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should register a new user with phone', async () => {
      req.body = { phone: '+91999999999', method: 'phone' };
      mockUserFindOne.mockResolvedValue(null);

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.isNewUser).toBe(true);
      expect(response.token).toBe('mock-token-xyz');
    });

    it('should login existing user with email', async () => {
      const existingUser = {
        _id: 'existing-id',
        trinetraId: 'TRN-ABCD1234',
        email: 'test@test.com',
        appAccessLevel: 'FULL_ACCESS',
      };
      req.body = { email: 'test@test.com', method: 'email' };
      mockUserFindOne.mockResolvedValue(existingUser);

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.isNewUser).toBe(false);
      expect(response.user).toEqual(existingUser);
    });

    it('should restrict GitHub login to AI_ONLY access', async () => {
      req.body = { email: 'dev@github.com', method: 'GitHub' };
      mockUserFindOne.mockResolvedValue(null);

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.accessLevel).toBe('AI_ONLY');
      expect(response.message).toContain('GitHub');
    });

    it('should grant FULL_ACCESS for non-GitHub methods', async () => {
      req.body = { phone: '+91888888888', method: 'google' };
      mockUserFindOne.mockResolvedValue(null);

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.accessLevel).not.toBe('AI_ONLY');
    });

    it('should return AI_ONLY session access when existing user logs in via GitHub', async () => {
      const existingUser = {
        _id: 'existing-id',
        trinetraId: 'TRN-EXISTING',
        email: 'dev@github.com',
        appAccessLevel: 'FULL_ACCESS',
      };
      req.body = { email: 'dev@github.com', method: 'GitHub' };
      mockUserFindOne.mockResolvedValue(existingUser);

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.accessLevel).toBe('AI_ONLY');
    });

    it('should return 500 on database error', async () => {
      req.body = { phone: '+91777777777', method: 'phone' };
      mockUserFindOne.mockRejectedValue(new Error('DB connection failed'));

      await registerOrLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe('updateDeepSettings', () => {
    const mockUser = {
      _id: 'user-id-123',
      settings: {},
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 403 for invalid settings category', async () => {
      req.body = { userId: 'user-id-123', category: 'hackerCategory', data: {} };

      await updateDeepSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should accept valid settings category "preferences"', async () => {
      const { default: User } = await import('../models/User.js');
      User.findById = jest.fn().mockResolvedValue(mockUser);

      req.body = { userId: 'user-id-123', category: 'preferences', data: { darkMode: false } };

      await updateDeepSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should accept valid settings category "audienceVisibility"', async () => {
      const { default: User } = await import('../models/User.js');
      User.findById = jest.fn().mockResolvedValue(mockUser);

      req.body = { userId: 'user-id-123', category: 'audienceVisibility', data: { profile: 'private' } };

      await updateDeepSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
    });

    it('should return 404 if user not found', async () => {
      const { default: User } = await import('../models/User.js');
      User.findById = jest.fn().mockResolvedValue(null);

      req.body = { userId: 'nonexistent', category: 'preferences', data: {} };

      await updateDeepSettings(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should reject all invalid categories', async () => {
      const invalidCategories = ['wallet', 'admin', 'password', '', null];
      for (const cat of invalidCategories) {
        req.body = { userId: 'user-id-123', category: cat, data: {} };
        res.status.mockClear();
        res.json.mockClear();

        await updateDeepSettings(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
      }
    });
  });
});
