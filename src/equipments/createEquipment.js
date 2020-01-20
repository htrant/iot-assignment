import moment from 'moment';
import dbClient from '../database/dbClient';

const EquipmentStatus = {
  run: 'running',
  stop: 'stopped',
};

const regex = /^[\w.-]*$/;

const isValidDate = dateString => moment(dateString, 'YYYY-MM-DD', true).isValid();

const validateInput = body => {
  const { equipmentNumber, address, status, startDate, endDate } = body;
  if (!equipmentNumber || !address || !startDate || !endDate || !status) {
    throw new Error('invalid input data');
  }
  if (!regex.test(equipmentNumber)) {
    throw new Error('invalid format equipment number');
  }
  if (status !== EquipmentStatus.run && status !== EquipmentStatus.stop) {
    throw new Error('invalid status value');
  }
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new Error('invalid date format YYYY-MM-DD');
  }
};

const createEquipment = async body => {
  validateInput(body);
  return dbClient.storeNewEquipment(body);
}

export default createEquipment;
