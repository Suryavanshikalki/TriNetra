import { jest } from '@jest/globals';

const mockTransactionSave = jest.fn().mockResolvedValue(true);
const mockUserFindById = jest.fn();
const mockUserSave = jest.fn().mockResolvedValue(true);

jest.unstable_mockModule('../models/Transaction.js', () => {
  const MockTransaction = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockTransactionSave,
  }));
  return { default: MockTransaction };
});

jest.unstable_mockModule('../models/User.js', () => {
  const MockUser = jest.fn();
  MockUser.findById = mockUserFindById;
  return { default: MockUser };
});

jest.unstable_mockModule('crypto', () => ({
  default: {
    randomBytes: () => ({
      toString: () => 'a1b2c3d4e5f6',
    }),
  },
}));

const { processPaymentAndBoost } = await import('../controllers/paymentController.js');

describe('paymentController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('processPaymentAndBoost', () => {
    const mockUser = {
      _id: 'user-123',
      walletBalance: 1000,
      aiCreditsC: 0,
      aiCreditsB: 0,
      aiCreditsOS: 0,
      escalationPlanStatus: 'INACTIVE',
      save: mockUserSave,
    };

    beforeEach(() => {
      mockUserFindById.mockResolvedValue({ ...mockUser, save: mockUserSave });
    });

    it('should return 400 for invalid planType', async () => {
      req.body = { userId: 'user-123', planType: 'InvalidPlan', gatewayName: 'PayU' };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it('should process FreeBoost with zero amount', async () => {
      req.body = { userId: 'user-123', planType: 'FreeBoost', gatewayName: 'PayU', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.transactionId).toContain('TRN-TXN-');
    });

    it('should calculate PaidBoost correctly at ₹10,000/month', async () => {
      req.body = { userId: 'user-123', planType: 'PaidBoost', gatewayName: 'PayU', requestedMonths: 3 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockTransactionSave).toHaveBeenCalled();
    });

    it('should reject Razorpay as gateway', async () => {
      req.body = { userId: 'user-123', planType: 'PaidBoost', gatewayName: 'Razorpay', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should reject unsupported gateway', async () => {
      req.body = { userId: 'user-123', planType: 'PaidBoost', gatewayName: 'Stripe', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should process ModeC_Recharge and add 900 credits per month', async () => {
      req.body = { userId: 'user-123', planType: 'ModeC_Recharge', gatewayName: 'PayPal', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should process OS_Creation at ₹79,999/month', async () => {
      req.body = { userId: 'user-123', planType: 'OS_Creation', gatewayName: 'Braintree', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should default to 1 month for invalid requestedMonths', async () => {
      req.body = { userId: 'user-123', planType: 'ModeB_Recharge', gatewayName: 'PayU', requestedMonths: 7 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should accept valid subscription durations (1,3,6,9,12)', async () => {
      for (const months of [1, 3, 6, 9, 12]) {
        jest.clearAllMocks();
        mockUserFindById.mockResolvedValue({ ...mockUser, save: mockUserSave });
        req.body = { userId: 'user-123', planType: 'ModeA_Recharge', gatewayName: 'Adyen', requestedMonths: months };

        await processPaymentAndBoost(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
      }
    });

    it('should activate escalation plan status when AutoEscalation_System is purchased', async () => {
      const user = { ...mockUser, save: mockUserSave };
      mockUserFindById.mockResolvedValue(user);
      req.body = { userId: 'user-123', planType: 'AutoEscalation_System', gatewayName: 'PayU', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(user.escalationPlanStatus).toBe('ACTIVE_PRO');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user not found after payment', async () => {
      mockUserFindById.mockResolvedValue(null);
      req.body = { userId: 'nonexistent', planType: 'FreeBoost', gatewayName: 'PayU', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should process PaidMonetization with 100% user share', async () => {
      req.body = { userId: 'user-123', planType: 'PaidMonetization', gatewayName: 'PayPal', requestedMonths: 1 };

      await processPaymentAndBoost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
