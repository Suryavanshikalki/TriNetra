import { jest } from '@jest/globals';

const mockUserFindById = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue(true);
const mockAxiosPost = jest.fn();

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn();
  MockUser.findById = mockUserFindById;
  return { default: MockUser };
});

jest.unstable_mockModule('axios', () => ({
  default: { post: mockAxiosPost },
}));

const { processAIPrompt, translateContent } = await import('../controllers/aiController.js');

describe('aiController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { id: 'user-123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('translateContent', () => {
    it('should return original text if targetLanguage is en', async () => {
      const result = await translateContent('Hello', 'en');
      expect(result).toBe('Hello');
    });

    it('should return original text if text is empty', async () => {
      const result = await translateContent('', 'hi');
      expect(result).toBe('');
    });

    it('should return original text if targetLanguage is empty', async () => {
      const result = await translateContent('Hello', '');
      expect(result).toBe('Hello');
    });

    it('should call Groq API for translation', async () => {
      mockAxiosPost.mockResolvedValue({
        data: { choices: [{ message: { content: 'नमस्ते' } }] },
      });

      const result = await translateContent('Hello', 'hi');

      expect(result).toBe('नमस्ते');
      expect(mockAxiosPost).toHaveBeenCalledWith(
        'https://api.groq.com/openai/v1/chat/completions',
        expect.any(Object),
        expect.any(Object)
      );
    });

    it('should return original text on API failure', async () => {
      mockAxiosPost.mockRejectedValue(new Error('Network error'));

      const result = await translateContent('Hello', 'hi');

      expect(result).toBe('Hello');
    });
  });

  describe('processAIPrompt', () => {
    it('should return 404 if user not found', async () => {
      mockUserFindById.mockResolvedValue(null);
      req.body = { prompt: 'hello', aiMode: 'Mode_A_FreePremium' };

      await processAIPrompt(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 when Mode A free credits exhausted', async () => {
      mockUserFindById.mockResolvedValue({
        aiCreditsA_Free: 0,
        save: mockUserSave,
      });
      req.body = { prompt: 'test', aiMode: 'Mode_A_FreePremium' };

      await processAIPrompt(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('8 free') })
      );
    });

    it('should return 403 when Mode B credits exhausted', async () => {
      mockUserFindById.mockResolvedValue({
        aiCreditsB_Paid: 0,
        save: mockUserSave,
      });
      req.body = { prompt: 'code this', aiMode: 'Mode_B_Paid' };

      await processAIPrompt(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('300') })
      );
    });

    it('should return 403 when Mode C credits exhausted', async () => {
      mockUserFindById.mockResolvedValue({
        aiCreditsC: 0,
        save: mockUserSave,
      });
      req.body = { prompt: 'invent something', aiMode: 'Mode_C' };

      await processAIPrompt(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('₹9999') })
      );
    });

    it('should return 403 when OS Creation credits exhausted', async () => {
      mockUserFindById.mockResolvedValue({
        aiCreditsOS: 0,
        save: mockUserSave,
      });
      req.body = { prompt: 'create OS', aiMode: 'OS_Creation' };

      await processAIPrompt(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('₹79999') })
      );
    });

    it('should deduct Mode A credit and return AI response', async () => {
      const user = { aiCreditsA_Free: 5, save: mockUserSave };
      mockUserFindById.mockResolvedValue(user);
      mockAxiosPost.mockResolvedValue({
        data: { ai_response: 'Hello, how can I help?', engine_used: 'Meta' },
      });
      req.body = { prompt: 'hi', aiMode: 'Mode_A_FreePremium' };

      await processAIPrompt(req, res);

      expect(user.aiCreditsA_Free).toBe(4);
      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.brainUsed).toBe('Meta');
      expect(response.response).toBe('Hello, how can I help?');
    });

    it('should deduct Mode B credit and use Manus brain', async () => {
      const user = { aiCreditsB_Paid: 100, save: mockUserSave };
      mockUserFindById.mockResolvedValue(user);
      mockAxiosPost.mockResolvedValue({
        data: { ai_response: 'Code generated', engine_used: 'Manus' },
      });
      req.body = { prompt: 'write code', aiMode: 'Mode_B_Paid' };

      await processAIPrompt(req, res);

      expect(user.aiCreditsB_Paid).toBe(99);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle Python microservice failure gracefully', async () => {
      const user = { aiCreditsA_Free: 3, save: mockUserSave };
      mockUserFindById.mockResolvedValue(user);
      mockAxiosPost.mockRejectedValue(new Error('Python server down'));
      req.body = { prompt: 'hello', aiMode: 'Mode_A_FreePremium' };

      await processAIPrompt(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.response).toContain('syncing');
    });

    it('should return wallet status in response', async () => {
      const user = {
        aiCreditsA_Free: 6,
        aiCreditsC: 100,
        aiCreditsB_Paid: 200,
        aiCreditsOS: 50,
        save: mockUserSave,
      };
      mockUserFindById.mockResolvedValue(user);
      mockAxiosPost.mockResolvedValue({
        data: { ai_response: 'response', engine_used: 'Meta' },
      });
      req.body = { prompt: 'test', aiMode: 'Mode_A_FreePremium' };

      await processAIPrompt(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.walletStatus).toEqual({
        modeA_Free: 5,
        modeC_Credits: 100,
        modeB_Credits: 200,
        os_Credits: 50,
      });
    });
  });
});
