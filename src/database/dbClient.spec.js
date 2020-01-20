import _ from 'lodash';
import dbClient from './dbClient';

describe('database:dbClient', () => {
  const equipmentNumber = 'mock-id';
  const mockData = {
    equipmentNumber: 'mock-id',
    address: 'mock address',
    startDate: '2010-01-01',
    endDate: '2020-01-01',
    status: 'stopped'
  };
  const expectedStoreData = {
    equipmentNumber: {
      S: mockData.equipmentNumber,
    },
    address: {
      S: mockData.address,
    },
    startDate: {
      S: mockData.startDate,
    },
    endDate: {
      S: mockData.endDate,
    },
    status: {
      S: mockData.status,
    },
  };
  const mockDbResultItem = {
    equipmentNumber: { S: equipmentNumber },
    address: { S: 'mock address' },
    startDate: { S: '2010-01-01' },
    endDate: { S: '2020-01-01' },
    status: { S: 'stopped' },
  };
  const putItemStub = sinon.stub();
  const getItemStub = sinon.stub();
  const scanStub = sinon.stub();

  beforeEach(() => {
    dbClient.__set__('dynamoDb', {
      putItem: putItemStub,
      getItem: getItemStub,
      scan: scanStub,
    });
  });

  describe('storeNewEquipment', () => {
    beforeEach(() => {
      putItemStub.returns({ promise: () => Promise.resolve() });
    });

    it('call putItem with correct parameters', () => {
      dbClient.storeNewEquipment(mockData);
      expect(putItemStub).to.be.calledWith({
        TableName: 'equipments',
        Item: expectedStoreData,
        ConditionExpression: 'attribute_not_exists(equipmentNumber)'
      });
    });

    it('should return response', async () => {
      expect(await dbClient.storeNewEquipment(mockData)).to.eql({ success: true });
    });

    describe('when store fails', () => {
      let mockError;

      describe('and equipment exists', () => {
        beforeEach(() => {
          mockError = { code: 'ConditionalCheckFailedException' };
          putItemStub.returns({ promise: () => Promise.reject(mockError)});
        });

        verifyError(mockData, 'equipment exists');
      });

      describe('and other failure errors', () => {
        beforeEach(() => {
          mockError = { code: 'other' };
          putItemStub.returns({ promise: () => Promise.reject(mockError)});
        });

        verifyError(mockData, 'internal error');
      });
    });
  });

  describe('getEquipment', () => {
    const expectedResponse = {
      equipmentNumber,
      address: 'mock address',
      startDate: '2010-01-01',
      endDate: '2020-01-01',
      status: 'stopped',
    };

    beforeEach(() => {
      const mockDbResult = {
        Item: mockDbResultItem,
      };
      getItemStub.returns({ promise: () => Promise.resolve(mockDbResult) });
    });

    it('should call getItem with correct parameters', () => {
      dbClient.getEquipment(equipmentNumber);
      expect(getItemStub).to.be.calledWith({
        TableName: 'equipments',
        Key: {
          equipmentNumber: {
            S: equipmentNumber,
          },
        },
      });
    });

    it('should return equipment', async () => {
      expect(await dbClient.getEquipment(equipmentNumber)).to.eql(expectedResponse);
    });

    describe('database returns no item', () => {
      const expectedErrorMessage = `equipment ${equipmentNumber} not found`;
      beforeEach(() => {
        getItemStub.returns({ promise: () => Promise.resolve({}) });
      });

      it('should return error', async () => {
        try {
          await dbClient.getEquipment(equipmentNumber);
        } catch (err) {
          expect(err.message).to.eql(expectedErrorMessage);
        }
      });
    });
  });

  describe('searchEquipment', () => {
    const mockLimit = 1;
    const mockLast = 'abc-123';
    const mockDbResult = {
      Items: [ mockDbResultItem ],
      LastEvaluatedKey: { equipmentNumber: { S: equipmentNumber } },
    };
    const expectedResponse = [mockData, { last: equipmentNumber }];

    describe('when database has result more than search limit', () => {
      beforeEach(() => {
        scanStub.returns({ promise: () => Promise.resolve(mockDbResult) });
      });
  
      it('should call getItem with correct parameters', () => {
        dbClient.searchEquipment(mockLimit, mockLast);
        expect(scanStub).to.be.calledWith({
          TableName: 'equipments',
          Limit: mockLimit,
          ExclusiveStartKey: { equipmentNumber: { S: mockLast }},
        });
      });
  
      it('should return array of equipments with last evaluated item', async () => {
        expect(await dbClient.searchEquipment(mockLimit, mockLast)).to.eql(expectedResponse);
      });
    });

    describe('when database has result within search limit', () => {
      beforeEach(() => {
        delete mockDbResult.LastEvaluatedKey;
        scanStub.returns({ promise: () => Promise.resolve(mockDbResult) });
      });
  
      it('should call getItem with correct parameters', () => {
        dbClient.searchEquipment(mockLimit);
        expect(scanStub).to.be.calledWith({
          TableName: 'equipments',
          Limit: mockLimit,
        });
      });
  
      it('should return array of equipments', async () => {
        expect(await dbClient.searchEquipment(mockLimit)).to.eql([mockData]);
      });
    });
   
    describe('when database returns no result', () => {
      beforeEach(() => {
        scanStub.returns({ promise: () => Promise.resolve({}) });
      });

      it('should return empty', async () => {
        expect(await dbClient.searchEquipment(mockLimit)).to.eql({});
      });
    });
  });


  function verifyError(requestData, expectedErrorMessage) {
    it('should return correct error', async () => {
      try {
        await dbClient.storeNewEquipment(requestData);
      } catch (err) {
        expect(err.message).to.eql(expectedErrorMessage);
      }
    });
  }
});
