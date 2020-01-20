import createEquipment from './createEquipment';

describe('equipments:createEquipment', () => {
  let mockBody;

  describe('when validating request body', () => {
    describe('and missing data', () => {
      mockBody = {};

      verifyErrorMessage(mockBody, 'invalid input data');
    });

    describe('and status value is invalid', () => {
      mockBody = {
        equipmentNumber: 'mock-id',
        address: 'mock address',
        startDate: '2010-01-10',
        endDate: '2020-01-10',
        status: 'wrong'
      };

      verifyErrorMessage(mockBody, 'invalid status value');
    });

    describe('and date value is invalid', () => {
      mockBody = {
        equipmentNumber: 'mock-id',
        address: 'mock address',
        startDate: '2010-01-aa',
        endDate: '2020-01-10',
        status: 'running'
      };
      
      verifyErrorMessage(mockBody, 'invalid date format YYYY-MM-DD');
    });
  });

  describe('when validation passes', () => {
    const dbStoreNewEquipmentStub = sinon.stub();

    beforeEach(() => {
      mockBody = {
        equipmentNumber: 'mock-id',
        address: 'mock address',
        startDate: '2010-01-01',
        endDate: '2020-01-10',
        status: 'running'
      };
      createEquipment.__set__('dbClient', {
        storeNewEquipment: dbStoreNewEquipmentStub,
      });
      createEquipment(mockBody);
    });

    it('should call to store equipments with correct parameters', () => {
      expect(dbStoreNewEquipmentStub).to.be.calledWith(mockBody);
    });
  });

  function verifyErrorMessage(body, expectedErrorMessage) {
    it('returns correct error if empty input data', async () => {
      try {
        await createEquipment(body);
      } catch (err) {
        expect(err.message).to.eql(expectedErrorMessage);
      }
    });
  }
});
