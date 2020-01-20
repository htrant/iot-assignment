import getEquipment from './getEquipment';

describe('equipments:getEquipment', () => {
  let mockEquipmentNumber;
  let dbGetEquipmentStub;

  describe('when invalid equipment number', () => {
    beforeEach(() => {
      mockEquipmentNumber = '<invalid';
    });

    it('should return error invalid format equipment number', async () => {
      try {
        await getEquipment(mockEquipmentNumber);
      } catch (err) {
        expect(err.message).to.eql('invalid format equipment number');
      }
    });
  });

  describe('when valid equipment number', () => {
    beforeEach(() => {
      mockEquipmentNumber = 'valid-123';
      dbGetEquipmentStub = sinon.stub();
      getEquipment.__set__('dbClient', {
        getEquipment: dbGetEquipmentStub,
      });
      dbGetEquipmentStub(mockEquipmentNumber);
    });

    it('should call db client with correct parameter', () => {
      expect(dbGetEquipmentStub).to.be.calledWith(mockEquipmentNumber);
    });
  });
});
