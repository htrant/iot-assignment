import _ from 'lodash';
import dynamoDb from './dynamoDb';

const TABLE_NAME = 'equipments';

const storeNewEquipment = async data => {
  try {
    await dynamoDb.putItem({
      TableName: TABLE_NAME,
      Item: {
        equipmentNumber: {
          S: data.equipmentNumber,
        },
        address: {
          S: data.address,
        },
        startDate: {
          S: data.startDate,
        },
        endDate: {
          S: data.endDate,
        },
        status: {
          S: data.status,
        },
      },
      ConditionExpression: 'attribute_not_exists(equipmentNumber)'
    }).promise();
    return { success: true };
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException') {
      throw new Error('equipment exists');
    }
    throw new Error('internal error');
  }
};

const getEquipment = async equipmentNumber => {
  try {
    const result = await dynamoDb.getItem({
      TableName: TABLE_NAME,
      Key: {
        equipmentNumber: {
          S: equipmentNumber,
        },
      },
    }).promise();
    if (!result.Item) {
      throw new Error(`equipment ${equipmentNumber} not found`);
    }
    return buildEquipmentObject(result.Item);
  } catch (err) {
    throw err;
  }
};

const searchEquipment = async (limit, last) => {
  const scanParams = {
    TableName: TABLE_NAME,
    Limit: limit,
  };
  if (last) {
    scanParams.ExclusiveStartKey = { equipmentNumber: { S: last }};
  }
  try {
    const result = await dynamoDb.scan(scanParams).promise();
    if (!result.Items) {
      return {};
    }
    const response = result.Items.map(item => buildEquipmentObject(item));
    if (result.LastEvaluatedKey) {
      return response.concat({
        last: _.get(result, 'LastEvaluatedKey.equipmentNumber.S'),
      });
    }
    return response;
  } catch (err) {
    throw err;
  }
}

const buildEquipmentObject = item => ({
  equipmentNumber: _.get(item, 'equipmentNumber.S'),
  address: _.get(item, 'address.S'),
  startDate: _.get(item, 'startDate.S'),
  endDate: _.get(item, 'endDate.S'),
  status: _.get(item, 'status.S'),
});

export default {
  storeNewEquipment,
  getEquipment,
  searchEquipment,
};
