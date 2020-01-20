import { buildResponse } from '../utils/response';
import * as equipments from '../equipments';

export const getEquipment = async req => 
  buildResponse(200, equipments.getEquipment(req.pathParameters.equipmentNumber));

export const createEquipment = async req => 
  buildResponse(201, equipments.createEquipment(JSON.parse(req.body)));

export const searchEquipment = async req => 
  buildResponse(200, equipments.searchEquipment(req.queryStringParameters));
