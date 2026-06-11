import { jest } from '@jest/globals';

const mockUserFindById = jest.fn();
const mockPostFindById = jest.fn();
const mockPostSave = jest.fn().mockResolvedValue(true);
const mockSnsPublish = jest.fn().mockReturnValue({ promise: jest.fn().mockResolvedValue(true) });

jest.unstable_mockModule('../models/Post.js', () => {
  const MockPost = jest.fn();
  MockPost.findById = mockPostFindById;
  return { default: MockPost };
});

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn();
  MockUser.findById = mockUserFindById;
  return { default: MockUser };
});

jest.unstable_mockModule('aws-sdk', () => ({
  default: {
    SNS: jest.fn().mockImplementation(() => ({
      publish: mockSnsPublish,
    })),
  },
}));

jest.unstable_mockModule('axios', () => ({
  default: {
    post: jest.fn().mockResolvedValue({ data: { summary: 'AI generated summary' } }),
  },
}));

const { triggerEscalation } = await import('../controllers/escalationController.js');

describe('escalationController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('triggerEscalation', () => {
    it('should return 404 if user not found', async () => {
      mockUserFindById.mockResolvedValue(null);
      req.body = { postId: 'post-1', userId: 'nonexistent' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user does not have ACTIVE_PRO escalation plan', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'INACTIVE' });
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: expect.stringContaining('₹30,000') })
      );
    });

    it('should return 404 if post not found', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      mockPostFindById.mockResolvedValue(null);
      req.body = { postId: 'nonexistent-post', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should escalate to Local Authority on first escalation', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      const post = {
        content: 'Complaint text',
        isEscalated: false,
        escalationLevel: 'None',
        escalationHistory: [],
        commentsCount: 5,
        save: mockPostSave,
      };
      mockPostFindById.mockResolvedValue(post);
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.level).toBe('Local Authority');
      expect(post.isEscalated).toBe(true);
    });

    it('should auto-escalate to next level in chain', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      const post = {
        content: 'Unresolved complaint',
        isEscalated: true,
        escalationLevel: 'Local Authority',
        escalationHistory: [{ level: 'Local Authority', status: 'Pending' }],
        commentsCount: 3,
        save: mockPostSave,
      };
      mockPostFindById.mockResolvedValue(post);
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.level).toBe('MLA');
    });

    it('should escalate from MLA to CM', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      const post = {
        content: 'Serious issue',
        isEscalated: true,
        escalationLevel: 'MLA',
        escalationHistory: [
          { level: 'Local Authority', status: 'Escalated_Unresolved' },
          { level: 'MLA', status: 'Pending' },
        ],
        commentsCount: 2,
        save: mockPostSave,
      };
      mockPostFindById.mockResolvedValue(post);
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.level).toBe('CM');
    });

    it('should stop escalation at International Level', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      const post = {
        content: 'Maximum escalated issue',
        isEscalated: true,
        escalationLevel: 'International Level',
        escalationHistory: [],
        commentsCount: 2,
        save: mockPostSave,
      };
      mockPostFindById.mockResolvedValue(post);
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.message).toContain('Maximum Escalation');
    });

    it('should mark previous level as Escalated_Unresolved when escalating', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      const post = {
        content: 'Issue',
        isEscalated: true,
        escalationLevel: 'CM',
        escalationHistory: [
          { level: 'Local Authority', status: 'Escalated_Unresolved' },
          { level: 'MLA', status: 'Escalated_Unresolved' },
          { level: 'CM', status: 'Pending' },
        ],
        commentsCount: 1,
        save: mockPostSave,
      };
      mockPostFindById.mockResolvedValue(post);
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      expect(post.escalationHistory[2].status).toBe('Escalated_Unresolved');
      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.level).toBe('PM');
    });

    it('should handle SNS publish failure gracefully', async () => {
      mockUserFindById.mockResolvedValue({ escalationPlanStatus: 'ACTIVE_PRO' });
      const post = {
        content: 'Complaint',
        isEscalated: false,
        escalationLevel: 'None',
        escalationHistory: [],
        commentsCount: 1,
        save: mockPostSave,
      };
      mockPostFindById.mockResolvedValue(post);
      mockSnsPublish.mockReturnValue({ promise: jest.fn().mockRejectedValue(new Error('SNS failed')) });
      req.body = { postId: 'post-1', userId: 'user-1' };

      await triggerEscalation(req, res);

      // Should still save and return 200 even if SNS fails
      expect(mockPostSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
