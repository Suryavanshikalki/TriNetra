import { jest } from '@jest/globals';

const mockAxiosPost = jest.fn();

jest.unstable_mockModule('axios', () => ({
  default: { post: mockAxiosPost },
}));

const { translateText } = await import('../controllers/translateController.js');

describe('translateController', () => {
  let req, res;
  const originalEnv = process.env;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'test-api-key-123' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 400 if text is missing', async () => {
    req.body = { targetLanguage: 'hi' };

    await translateText(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('should return 400 if targetLanguage is missing', async () => {
    req.body = { text: 'Hello world' };

    await translateText(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 500 if GROQ_API_KEY is not set', async () => {
    delete process.env.GROQ_API_KEY;
    req.body = { text: 'Hello', targetLanguage: 'hi' };

    await translateText(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('should translate text successfully', async () => {
    mockAxiosPost.mockResolvedValue({
      data: {
        choices: [{ message: { content: 'नमस्ते दुनिया' } }],
      },
    });
    req.body = { text: 'Hello world', targetLanguage: 'hi' };

    await translateText(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.success).toBe(true);
    expect(response.translatedText).toBe('नमस्ते दुनिया');
    expect(response.engineUsed).toBe('Meta LLaMA 3');
  });

  it('should call Groq API with correct parameters', async () => {
    mockAxiosPost.mockResolvedValue({
      data: { choices: [{ message: { content: 'Bonjour' } }] },
    });
    req.body = { text: 'Hello', targetLanguage: 'fr' };

    await translateText(req, res);

    expect(mockAxiosPost).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({
        model: 'llama3-70b-8192',
        temperature: 0.2,
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key-123',
        }),
      })
    );
  });

  it('should return 500 with fallback text on API error', async () => {
    mockAxiosPost.mockRejectedValue(new Error('API timeout'));
    req.body = { text: 'Hello', targetLanguage: 'hi' };

    await translateText(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    const response = res.json.mock.calls[0][0];
    expect(response.success).toBe(false);
    expect(response.fallbackText).toBe('Hello');
  });

  it('should handle API response error with response data', async () => {
    const apiError = new Error('Rate limited');
    apiError.response = { data: { error: 'Too many requests' } };
    mockAxiosPost.mockRejectedValue(apiError);
    req.body = { text: 'Test', targetLanguage: 'bn' };

    await translateText(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ fallbackText: 'Test' })
    );
  });
});
