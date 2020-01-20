import dbClient from '../database/dbClient';

const regexLast = /^[\w.-]*$/;
const regexLimit = /^[0-9]*$/;
const DEFAULT_LIMIT = 3;

const searchEquipment = async queryParams => {
  let { last, limit } = queryParams;
  if (!regexLast.test(last)) {
    last = null;
  }
  if (!regexLimit.test(limit)) {
    limit = DEFAULT_LIMIT;
  }
  return dbClient.searchEquipment(limit, last);
}

export default searchEquipment;
