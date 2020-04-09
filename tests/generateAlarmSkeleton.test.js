const generateAlarmSkeleton = require('../helpers/generateAlarmSkeleton')

test('Returns correct skeleton for HighLaunchAlarm', () => {
  const actual = generateAlarmSkeleton(['HighLaunchAlarm'], 'lambda')
  const expected = [
    `HighLaunchAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: Alarm if launches greater than ...
      ComparisonOperator: GreaterThanThreshold
      EvaluationPeriods: 1
      MetricName: Launches
      Namespace: lambda
      Period: 60   # Multiples of 60 seconds
      Threshold: 10
      TreatMissingData: notBreaching
      Unit: Count
      Statistic: Sum`]

    expect(actual).toEqual(expected)
})

test('Returns correct skeleton for ZeroLaunchAlarm', () => {
  const actual = generateAlarmSkeleton(['ZeroLaunchAlarm'], 'lambda')
  const expected = [
    `ZeroLaunchAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: Alarm if no launches in ...
      ComparisonOperator: LessThanOrEqualToThreshold
      EvaluationPeriods: 1
      MetricName: Launches
      Namespace: lambda
      Period: 60   # Multiples of 60 seconds
      Threshold: 0
      TreatMissingData: notBreaching
      Unit: Count
      Statistic: Sum`]

    expect(actual).toEqual(expected)
})

test('Returns array of skeletons that join together to becoome one formatted string', () => {
  const actual = generateAlarmSkeleton(['HighLaunchAlarm', 'ZeroLaunchAlarm'], 'lambda')
  const expected = `HighLaunchAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: Alarm if launches greater than ...
      ComparisonOperator: GreaterThanThreshold
      EvaluationPeriods: 1
      MetricName: Launches
      Namespace: lambda
      Period: 60   # Multiples of 60 seconds
      Threshold: 10
      TreatMissingData: notBreaching
      Unit: Count
      Statistic: Sum
  ZeroLaunchAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: Alarm if no launches in ...
      ComparisonOperator: LessThanOrEqualToThreshold
      EvaluationPeriods: 1
      MetricName: Launches
      Namespace: lambda
      Period: 60   # Multiples of 60 seconds
      Threshold: 0
      TreatMissingData: notBreaching
      Unit: Count
      Statistic: Sum`

  expect(actual.join('\n  ')).toEqual(expected)
})