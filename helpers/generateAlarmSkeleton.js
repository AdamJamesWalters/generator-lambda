const generateAlarmSkeleton = (alarms, namespace) => {
  const skeletons = alarms.map(alarm => {
    const vals = getAlarmDesc(alarm)
    return `${alarm}:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: ${vals.name}
      ComparisonOperator: ${vals.comparisonOperator}
      EvaluationPeriods: 1
      MetricName: Launches
      Namespace: ${namespace}
      Period: 60   # Multiples of 60 seconds
      Threshold: ${vals.threshold}
      TreatMissingData: notBreaching
      Unit: Count
      Statistic: Sum`
  })

  return skeletons
}

const getAlarmDesc = (alarmName) => {
  let name
  let threshold
  let comparisonOperator

  switch(alarmName) {
    case 'HighLaunchAlarm':
      name = 'Alarm if launches greater than ...'
      threshold = 10
      comparisonOperator = 'GreaterThanThreshold'
      break;
    case 'ZeroLaunchAlarm':
      name = 'Alarm if no launches in ...'
      threshold = 0
      comparisonOperator = 'LessThanOrEqualToThreshold'
      break;
    case 'ErrorRateAlarm':
      name = 'Alarm if errors pass a certain threshold'
      threshold = 3
      comparisonOperator = 'GreaterThanThreshold'
      break;
    case 'SuccessRateAlarm':
      name = 'Alarm when successful launches drops below threshold'
      threshold = 5
      comparisonOperator = 'LessThanOrEqualToThreshold'
      break;
  }

  return {
    name,
    threshold,
    comparisonOperator
  }
}

module.exports = generateAlarmSkeleton