import searchEquipment from './searchEquipment';

describe('equipments:searchEquipment', () => {
  const defaultLimit = 3;

  let last;
  let limit;
  let dbSearchEquipmentStub;

  beforeEach(() => {
    dbSearchEquipmentStub = sinon.stub();
    searchEquipment.__set__('dbClient', { searchEquipment: dbSearchEquipmentStub });
  });

  describe('when request parameters are invalid format', () => {
    beforeEach(() => {
      last = '<invalid';
      limit = 'a';
      searchEquipment({ limit, last });
    });

    it('should call database with default parameters', () => {
      expect(dbSearchEquipmentStub).to.be.calledWith(defaultLimit, null);
    });
  });

  describe('when request parameters are valid format', () => {
    beforeEach(() => {
      last = 'abc-123';
      limit = 2;
      searchEquipment({ limit, last });
    });

    it('should call database with correct parameters', () => {
      expect(dbSearchEquipmentStub).to.be.calledWith(limit, last);
    });
  });
});
