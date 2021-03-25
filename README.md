# AWS IAM Access Analyzer Policy Validation with Pulumi Policy as Code ("CrossGuard")

This project demonstrates how you can use [Pulumi CrossGuard](https://www.pulumi.com/crossguard/) to evaluate AWS IAM policies before deployment and prevent policies from being created that do not pass [IAM Access Analyzer Policy Validation](https://aws.amazon.com/blogs/aws/iam-access-analyzer-update-policy-validation/).


## Policy Code

See the [policy pack code](./policy-as-code/index.ts) for the policy implementation. The policy uses the [AWS SDK for JavaScript](https://github.com/aws/aws-sdk-js) to run the `ValidatePolicy` operation via the AWS API. _**The policy code itself is only 14 lines of code!!!**_

## Prerequisites

This particular project uses TypeScript, but this same policy could be implemented in any of the other languages that Pulumi CrossGuard supports. As such, you will need [Node.js](https://nodejs.org/en/download/) installed.

## Usage

When running with the policy pack enabled, `pulumi` will run the `iam-access-analyzer-policy-validation` policy for each `aws.iam.Policy` resource defined in the base Pulumi project. The policy will query the `ValidatePolicy` API call and print each `ERROR`, `SECURITY_WARNING`, or `WARNING` finding for each policy resource (excluding `SUGGESTION`).

1. [Download and Install Pulumi](https://www.pulumi.com/docs/get-started/install/)
1. Open a terminal `git clone` this repo and `cd` to the directory.
1. [Configure Pulumi to access your AWS account](https://www.pulumi.com/docs/get-started/aws/begin/#configure-pulumi-to-access-your-aws-account)
1. Install dependencies for the base Pulumi project with `npm i`.
1. Change directories to the policy pack with `cd policy-as-code`.
1. Install dependencies for the policy pack with `npm i`.
1. Return to the base Pulumi project directory with `cd ..`.
1. Initialize a Pulumi stack with `pulumi stack init dev`.
1. Set the AWS region to use (any region will do) with `pulumi config set aws:region us-east-1`.
1. Run the Pulumi project with the policy pack enabled with `pulumi pre --policy-pack policy-as-code`.

## Example Output

```
% pulumi pre --policy-pack policy-as-code
Previewing update (dev)

View Live: https://app.pulumi.com/clstokes/p-aws-aws-iamaccessanalyzer-validate-policy/dev/previews/b7b2d094-8324-49f8-a2e8-6ac1e5ba8292

     Type                 Name                                             Plan       Info
 +   pulumi:pulumi:Stack  p-aws-aws-iamaccessanalyzer-validate-policy-dev  create     1 error
 +   ├─ aws:iam:Policy    invalid-action-policy                            create     
 +   ├─ aws:iam:Policy    overly-permissive-policy                         create     
 +   ├─ aws:iam:Policy    invalid-date-policy                              create     
 +   └─ aws:iam:Policy    empty-array-action-policy                        create     
 
Diagnostics:
  pulumi:pulumi:Stack (p-aws-aws-iamaccessanalyzer-validate-policy-dev):
    error: preview failed
 
Policy Violations:
    [mandatory]  aws-iam-access-analyzer v0.0.1  iam-access-analyzer-policy-validation (aws:iam/policy:Policy: invalid-action-policy)
    Evaluate policies using AWS IAM Access Analyzer - https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html.
    Type:    ERROR 
    Link:    https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-error-invalid-service-in-action
    Details: The service DOES_NOT_EXIST:* specified in the action does not exist.
    
    
    [mandatory]  aws-iam-access-analyzer v0.0.1  iam-access-analyzer-policy-validation (aws:iam/policy:Policy: invalid-date-policy)
    Evaluate policies using AWS IAM Access Analyzer - https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html.
    Type:    WARNING 
    Link:    https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-general-warning-invalid-date-value
    Details: The date 2021 might not resolve as expected. We recommend that you use the YYYY-MM-DD format.
    
    
    [mandatory]  aws-iam-access-analyzer v0.0.1  iam-access-analyzer-policy-validation (aws:iam/policy:Policy: overly-permissive-policy)
    Evaluate policies using AWS IAM Access Analyzer - https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html.
    Type:    SECURITY_WARNING 
    Link:    https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-security-warning-pass-role-with-star-in-resource
    Details: Using the iam:PassRole action with wildcards (*) in the resource can be overly permissive because it allows iam:PassRole permissions on multiple resources. We recommend that you specify resource ARNs or add the iam:PassedToService condition key to your statement.

```

## Additional Resources

- [Get Started with Pulumi Policy as Code](https://www.pulumi.com/docs/get-started/crossguard/)
- [Pulumi Policy as Code User Guide](https://www.pulumi.com/docs/guides/crossguard/)
