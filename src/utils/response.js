export const buildResponse = async (statusCode, operation) => {
  try {
    const response = await operation;
    return {
      statusCode,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: err.message
      }),
    };
  }
};
