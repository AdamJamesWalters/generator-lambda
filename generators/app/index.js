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
      lambdaLogGroup: this.answers.lambdaLogGroup,
      logRetention: this.answers.logRetention,
      apiGateway: this.answers.apiGateway === 'yes' ? apiGatewaySkeleton : null,
      alarms: alarmsSkeleton.join('\n  ')
    }

    console.log('Params: ',templateParams)

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
    this.log('Generation Finished!')
  }
}