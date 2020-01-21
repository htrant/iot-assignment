## IOT-ASSIGNMENT
A serverless application with serverless framework, DynamoDB, AWS Lambda, API Gateway

### 1. Setup AWS resources
- Run CF template `cloudformation/1_dynamodb.yaml` to create DynamoDB table
- Fix DynamoDB Arn and run template `cloudformation/2_iam.yaml` to create IAM role


### 2. Setup and run local
- This application requires AWS profile named `local` to run, follow AWS guide to setup on your machine
- Fix value of role on `serverless.yml` with Arn of the IAM role created above
- Run scripts
```
  1_install.sh      cleanup and install dependencies
  2_test.sh         run all unit tests
  3_start_local.sh  start application locally
```
- Application running at http://localhost:4001


### 3. Test application locally
- Create new equipment
```
$ curl -X POST \
   http://localhost:4001/equipments \
   -H 'Content-Type: application/json' \
   -d '{
    "equipmentNumber": "abc-123",
    "address": "Test Address",
    "startDate": "2017-12-31",
    "endDate": "2025-08-05",
    "status": "running"
   }'

### Response ###
{ 
 "success": true 
}
```

- Get single equipment by its `equipmentNumber`
```
$ curl -X GET \
   http://localhost:4001/equipments/{equipmentNumber} \
   -H 'Content-Type: application/json'

### Response ###
{
 "equipmentNumber": "abc-123",
 "address": "Test Address",
 "startDate": "2017-12-31",
 "endDate": "2025-08-05",
 "status": "running"
}
```

- Search for equipment items with limit of how many to get and pagination. If response contains object `{"last": "abc-123"}` (abc-123 is sample value of `equipmentNumber`), there are more equipment items to fetch. To get more, send request with query parameter, e.g `&last=abc-123`
```
$ curl -X GET \
   'http://localhost:4001/equipments/search?limit=2&last={equipmentNumber}' \
   -H 'Content-Type: application/json'

### Response ###
[
 {
  "equipmentNumber": "abc-123",
  "address": "Test Address",
  "startDate": "2017-12-31",
  "endDate": "2025-08-05",
  "status": "running"
 },
 {
  "equipmentNumber": "123-abc",
  "address": "Address Test",
  "startDate": "2017-12-31",
  "endDate": "2025-08-05",
  "status": "stopped"
 },
 {
  "last": "123-abc"
 }
]
```

- Application info (quickly check if application is up)
```
$ curl -X GET \
   http://localhost:4001/info \
   -H 'Content-Type: application/json'

### Response ###
{
 "status": "OK"
}
```


### 4. Build and deploy
- Run script to deploy to AWS with target deployment environment 
```
$ sh scripts/4_build_and_deploy.sh $TARGET_ENVIRONMENT
```
