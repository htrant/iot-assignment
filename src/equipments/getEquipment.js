import dbClient from '../database/dbClient';

const regex = /^[\w.-]*$/;

const getEquipment = async equipmentNumber => {
  if (!regex.test(equipmentNumber)) {
    throw new Error('invalid format equipment number');
  }
  return dbClient.getEquipment(equipmentNumber);
};

export default getEquipment;

