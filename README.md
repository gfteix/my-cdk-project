# AWS CDK Application

Provisioning of a DynamoDB table and some lambdas for the CRUD operations.

Allow deployment of resources to different environments by creating one Stack for each environment based on the CURRENT_ENV variable.

TODO: 
- [x] Github actions to deploy application to AWS
- [x] Github actions to run unit tests and lint for every commit pushed
- [x] Improve deploy pipeline:
    - Merge on Dev Branch -> Deploy on Dev env
    - Merge on Main Branch -> Deploy on prod env
    - Requires Approval to deploy to prod
- [ ] API Gateway
- [ ] Samples to run locally
- [ ] Unit Tests
- [ ] Update Deploy action to use OIDC instead of plain secrets
