import * as cdk from 'aws-cdk-lib';
import { RestApiProps, MethodLoggingLevel, LogGroupLogDestination, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Policy, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Runtime, Code, Tracing, RuntimeManagementMode, LayerVersion, Function } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeployTalentFitStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const ENV = 'prod';
    const apiGatewayName = `${ENV}-api-gateway`;
    console.log(apiGatewayName);

    // Load environment variables from .env file
    const loadEnvVariables = (): Record<string, string> => {
      const envPath = path.join(__dirname, '..', '..', '..', '.env');
      
      if (!fs.existsSync(envPath)) {
        console.warn(`Warning: .env file not found at ${envPath}`);
        return {};
      }

      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      
      // Filter out sensitive variables that should be handled via AWS Secrets Manager
      const sensitiveKeys = [''];
      const filteredEnv: Record<string, string> = {};
      
      Object.entries(envConfig).forEach(([key, value]) => {
        if (!sensitiveKeys.includes(key)) {
          filteredEnv[key] = value;
        } else {
          console.log(`Skipping sensitive variable: ${key} (should be handled via AWS Secrets Manager)`);
        }
      });

      // Override ENV for production
      filteredEnv.ENV = ENV;
      
      return filteredEnv;
    };

    const environmentVariables = loadEnvVariables();
    // Create a CloudWatch Log Group
    const logGroup = new LogGroup(this, `${ENV}-sso-logs`, {
      retention: RetentionDays.INFINITE,
      logGroupName: `/aws/apigateway/${ENV}-api-logs`,
    });


    // Create the Lambda function
    const apiHandler = new Function(this, "api-sls", {
      runtime: Runtime.PROVIDED_AL2,
      code: Code.fromAsset(path.join(__dirname, "..", "..", "bin")),
      environment: {
        ENV: ENV!,
        ...environmentVariables,
      },
      tracing: Tracing.ACTIVE,
      memorySize: 512,
      functionName: `${ENV}-api`,
      timeout: cdk.Duration.seconds(30),
      handler: "bootstrap", // TODO name does not matter when the runtime is PROVIDED_AL2
      runtimeManagementMode: RuntimeManagementMode.AUTO,
    });

   
    // Configure API Gateway properties
    const apiGatewayProps: RestApiProps = {
      description: `${ENV} API Gateway For TalentFit`,
      deploy: true,
      deployOptions: {
        tracingEnabled: true,
        stageName: ENV,
        loggingLevel: MethodLoggingLevel.INFO,
        accessLogDestination: new LogGroupLogDestination(logGroup),
      },
      cloudWatchRole: true,
      restApiName: apiGatewayName,
      // Remove CORS here - let Go server handle it
      defaultIntegration: new LambdaIntegration(apiHandler, {
        proxy: true,
      }),
    };

    // Create a new instance of RestApi
    const apiGateway = new RestApi(this, apiGatewayName, apiGatewayProps);

    apiGateway.root.addProxy({
      defaultIntegration: new LambdaIntegration(apiHandler, {
        proxy: true,
      }),
      anyMethod: true, // "true" is the default
    });

    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: apiGateway.url,
      description: 'The base URL of the API Gateway',
      exportName: `${ENV}-api-gateway-url`,
    });
  }
}
