import cdk = require('@aws-cdk/cdk');
import logs = require('@aws-cdk/aws-logs');
import iam = require('@aws-cdk/aws-iam');
import ec2 = require('@aws-cdk/aws-ec2');

export class CdkjstestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create Cloudwatch Log Group
    const logGroup = new logs.LogGroup(this, 'CdkTestLogGroup', {
        retentionDays: 7
    });

    // Create role to publish to this Log Group
    const role = new iam.Role(this, 'CdkTestLogGroupRole', {
        assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com'),
        inlinePolicies: {'LoggingPolicy': new iam.PolicyDocument()
            .addStatement( new iam.PolicyStatement()
                .addAction('logs:CreateLogStream')
                .addAction('logs:PutLogEvents')
                .addAction('logs:DescribeLogGroups')
                .addAction('logs:DescribeLogStreams')
                .addAllResources()
            )
        }
    });

    // Create VPC
    const vpc = new ec2.VpcNetwork(this, 'CdkTestVpc');

    // Send Flow Log to Cloudwatch
    new ec2.CfnFlowLog(this, 'CdkTestFlowLog', {
        resourceId: vpc.vpcId,
        resourceType: 'VPC',
        trafficType: 'ALL',
        deliverLogsPermissionArn:  role.roleArn,
        // logDestination: logGroup.logGroupArn,  // only provide logGroupName or logDestination
        logDestinationType: 'cloud-watch-logs', // 'CloudWatchLogs', // 'cloud-watch-logs'
        logGroupName: logGroup.logGroupName,
    });
  }
}
