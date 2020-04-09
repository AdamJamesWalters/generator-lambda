const roleTemp = `LambdaExecutionRole:
Type: AWS::IAM::Role
Properties:
  AssumeRolePolicyDocument:
    Version: '2012-10-17'
    Statement:
    - Effect: Allow
      Principal:
        Service:
        - lambda.amazonaws.com
      Action:
      - sts:AssumeRole
  Path: "/"
  Policies:
  - PolicyName: root
    PolicyDocument:
      Version: '2012-10-17'
      Statement:
      - Effect: Allow
        Action:
        - logs:*
        Resource: arn:aws:logs:*:*:*`

module.exports = {
  executionRole: roleTemp
}
