import * as aws from "@pulumi/aws";

// https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-security-warning-pass-role-with-star-in-resource
const overlyPermissivePolicy = new aws.iam.Policy("overly-permissive-policy", {
    policy: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["iam:GetRole", "iam:PassRole"],
                "Resource": "*",
            }
        ]
    }
});

// https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-general-warning-invalid-date-value
const invalidDatePolicy = new aws.iam.Policy("invalid-date-policy", {
    policy: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:*",
                "Resource": "*",
                "Condition": {
                    "DateGreaterThan": { "aws:CurrentTime": "2021" },
                    "DateLessThan": { "aws:CurrentTime": "2022-12-31" }
                }
            }
        ]
    }
});


// https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-error-invalid-service-in-action
const invalidActionPolicy = new aws.iam.Policy("invalid-action-policy", {
    policy: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "DOES_NOT_EXIST:*",
                "Resource": "*"
            }
        ]
    }
});

// https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-reference-policy-checks.html#access-analyzer-reference-policy-checks-suggestion-empty-array-action
// But is a "SUGGESTION" so will not report a violation.
const emptyArrayPolicy = new aws.iam.Policy("empty-array-action-policy", {
    policy: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [],
                "Resource": "*"
            }
        ]
    }
});
