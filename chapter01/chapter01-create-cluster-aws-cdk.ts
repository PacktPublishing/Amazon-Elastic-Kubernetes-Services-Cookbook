import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class MyEksCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyEksVpc', {
      maxAzs: 3 // default is all AZs in the region
    });

    // Create an EKS Cluster
    const cluster = new eks.Cluster(this, 'my-eks-cookbook-cluster', {
      vpc: vpc,
      defaultCapacity: 2, // Number of worker nodes
      version: eks.KubernetesVersion.V1_30,
      defaultCapacityInstance: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM
      ),
    });

    // Create IAM Role for EKS Admin
    const adminRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // Grant the adminRole access to the EKS cluster
    cluster.awsAuth.addMastersRole(adminRole);
  }
}
