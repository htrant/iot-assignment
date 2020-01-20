import { buildResponse } from '../utils/response';

describe('utils:response', () => {
  let mockOperation;
  let mockStatusCode;

  beforeEach(() => {
    mockOperation = sinon.stub();
  });

  describe('when operation fails', () => {
    beforeEach(() => {
      mockStatusCode = 400;
      mockOperation.returns({ promise: () => Promise.reject(new Error()) });
    });

    it('should build correct response', async () => {
      const result = await buildResponse(mockStatusCode, mockOperation);
      expect(result.statusCode).to.eql(mockStatusCode);
    });
  });

  describe('when operation succeeds', () => {
    beforeEach(() => {
      mockStatusCode = 201;
      mockOperation.returns({ promise: () => Promise.resolve() });
    });

    it('should build correct response', async () => {
      const result = await buildResponse(mockStatusCode, mockOperation);
      expect(result.statusCode).to.eql(mockStatusCode);
    });
  });
});
