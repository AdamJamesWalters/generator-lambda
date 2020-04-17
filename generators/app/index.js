const Generator = require('yeoman-generator')

const generateAlarmSkeleton = require('../../helpers/generateAlarmSkeleton')

class MyBase extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  helper () {
    this.log('methods on the parent generator won\'t be called automatically')
  }
}

module.exports = class extends MyBase {
  constructor(args, opts) {
    super(args, opts)
  }

  intializing () {
    this.log('This is a spike for generating lmabda cloudformation')
  }

  async prompting () {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'githubRepo',
        message: "Your github repo. (Repo owner is hardwired as 'bbc', so should be omitted):",
        default: this.appname, // Default to current folder name on first run, but then whatever was stored
        store: true
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'The name to refer to this project by (only used in Descriptions):',
        default: this.appname,
        store: true
      },
      {
        type: 'input',
        name: 'lambdaName',
        message: 'The name of the lambda you are generating',
        store: true
      },
      {
        type: 'list',
        name: 'runtime',
        message: 'What language would you like the lambda to use?',
        choices: [
          { name: 'dotnetcore1.0', value: 'dotnetcore1.0' },
          { name: 'dotnetcore2.0', value: 'dotnetcore2.0' },
          { name: 'dotnetcore2.1', value: 'dotnetcore2.1' },
          { name: 'go1.x', value: 'go1.x' },
          { name: 'java8', value: 'java8' },
          { name: 'java11', value: 'java11' },
          { name: 'nodejs', value: 'nodejs' },
          { name: 'nodejs4.3-edge', value: 'nodejs4.3-edge' },
          { name: 'nodejs4.3', value: 'nodejs4.3' },
          { name: 'nodejs6.10', value: 'nodejs6.10' },
          { name: 'nodejs8.10', value: 'nodejs8.10' },
          { name: 'nodejs10.x', value: 'nodejs10.x' },
          { name: 'nodejs12.x', value: 'nodejs12.x' },
          { name: 'provided', value: 'provided' },
          { name: 'python2.7', value: 'python2.7' },
          { name: 'python3.6', value: 'python3.6' },
          { name: 'python3.7', value: 'python3.7' },
          { name: 'python3.8', value: 'python3.8' },
          { name: 'ruby2.5', value: 'ruby2.5' },
          { name: 'ruby2.7', value: 'ruby2.7' }
        ],
        store: true
      },
      {
        type: 'input',
        name: 'memory',
        message: 'How much memory would you like the lambda to have? (This must be between 128 and 3008, and in multiples of 64)',
        store: true
      },
      {
        type: 'input',
        name: 'timeout',
        message: 'The timeout for this lambda',
        store: true
      },
      {
        type: 'input',
        name: 'BBCproject',
        message: 'The BBC project this lambda is a part of',
        store: true
      },
      {
        type: 'input',
        name: 'owner',
        message: 'The owner of this repo',
        store: true
      },
      {
        type: 'input',
        name: 'env',
        message: 'The environment this lambda will run on (test, live etc.)',
        store: true
      },
      {
        type: 'input',
        name: 'accountNumber',
        message: 'The account you would like the lambda to operate from',
        store: true
      },
      {
        type: 'input',
        name: 'lambdaLogGroup',
        message: 'The name of the lambda log group',
        store: true
      },
      {
        type: 'input',
        name: 'logRetention',
        message: 'The retention period of logs',
        store: true
      },
      {
        type: 'input',
        name: 'apiGateway',
        message: 'Would you like to set up a simple API Gateway?',
        store: true
      },
      {
        type: 'checkbox',
        name: 'alarms',
        message: 'What simple alarm templates would you like to set up?',
        choices: [
          {
            name: 'High Invocations',
            value: 'HighLaunchAlarm'
          },
          {
            name: 'Low Invocations',
            value: 'ZeroLaunchAlarm'
          },
          {
            name: 'Error Rate',
            value: 'ErrorRateAlarm'
          },
          {
            name: 'Success Rate',
            value: 'SuccessRateAlarm'
          }
        ],
        store: true
      },
      {
        type: 'input',
        name: 'namespace',
        message: 'What namespace would you like these alarms to be under?',
        store: true
      },
    ])
  }

  writing () {
    const apiGatewaySkeleton = `HttpApi:
    Type: AWS::ApiGatewayV2::Api
    Properties:
      Name: Lambda Proxy
      Description: Lambda Proxy using Quick Create
      ProtocolType: HTTP
      Target: arn:aws:lambda:us-west-1:${this.answers.accountNumber}:function:Echo`

    const alarmsSkeleton = generateAlarmSkeleton(this.answers.alarms, this.answers.namespace)

    const templateParams = {
      githubRepo: this.answers.githubRepo,
      projectName: this.answers.projectName,
      lambdaName: this.answers.lambdaName,
      runtime: this.answers.runtime,
      memory: this.answers.memory,
      timeout: this.answers.timeout,
      BBCproject: this.answers.BBCproject,
      owner: this.answers.owner,
      env: this.answers.env,
      lambdaLogGroup: this.answers.lambdaLogGroup,
      logRetention: this.answers.logRetention,
      apiGateway: this.answers.apiGateway === 'yes' ? apiGatewaySkeleton : null,
      alarms: alarmsSkeleton.join('\n  ')
    }

    this.fs.copyTpl(
      this.templatePath('main.yml'),
      this.destinationPath('deploy/stacks/main.yml'),
      templateParams
    )
  }

  conflicts() {
    this.log('This is the stage where you can examine any changes prior them being writen to disk... ')
    this.log('If relevant, use the default \'H\' to describe options.')
  }

  end() {
    this.log('Generation Finished! Your lambda template is stored in "deploy/stacks/main.yml"')
  }
}