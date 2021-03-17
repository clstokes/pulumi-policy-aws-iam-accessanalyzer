import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType } from "@pulumi/policy";

import AWS = require("aws-sdk");

new PolicyPack("aws-iam-access-analyzer", {
    policies: [
        {
            name: "iam-access-analyzer-policy-validation",
            description: "Evaluate policies using AWS IAM Access Analyzer - https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html.",
            enforcementLevel: "mandatory",
            validateResource: validateResourceOfType(aws.iam.Policy, async (policy, args, reportViolation) => {
                const accessAnalyzer = new AWS.AccessAnalyzer({ region: aws.config.region });
                const params: AWS.AccessAnalyzer.Types.ValidatePolicyRequest = {
                    policyType: "IDENTITY_POLICY",
                    policyDocument: policy.policy.toString(),
                };
                const result = await accessAnalyzer.validatePolicy(params).promise();
                for (const finding of result.findings) {
                    if (finding.findingType !== "SUGGESTION") {
                        reportViolation(
                            `Type:    ${finding.findingType} \n` +
                            `Link:    ${finding.learnMoreLink}\n` +
                            `Details: ${finding.findingDetails}\n`
                        );
                    }
                }
            }),
        },
    ],
});
