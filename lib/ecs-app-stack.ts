import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancing';

export class EcsAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const vpc = new ec2.Vpc(this, 'VPC');
    // Create an ECS cluster
    // const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    
    // // Add capacity to it
    // cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
    //   instanceType: new ec2.InstanceType("t2.xlarge"),
    //   desiredCapacity: 3,
    // });
    
    // const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
    
    // taskDefinition.addContainer('DefaultContainer', {
    //   image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    //   memoryLimitMiB: 512,
    // });
    
    // // specificContainer.addPortMappings({
    // //   containerPort: 80,
    // //   protocol: ecs.Protocol.TCP,
    // // });
    
    // // Instantiate an Amazon ECS Service
    // const ecsService = new ecs.Ec2Service(this, 'Service', {
    //   cluster,
    //   taskDefinition,
    // });
    
    // const lb = new elb.LoadBalancer(this, 'LB', { vpc });
    // lb.addListener({ externalPort: 80 });
    // lb.addTarget(ecsService.loadBalancerTarget({
    //   containerName: 'AppContainer1',
    //   containerPort: 80,
    // }));
    
    const cluster = new ecs.Cluster(this, 'FargateCPCluster', {
      vpc,
      enableFargateCapacityProviders: true,
    });
    
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    
    new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 2,
        },
        {
          capacityProvider: 'FARGATE',
          weight: 1,
        },
      ],
    });
    
  }
}
