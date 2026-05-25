# Security Policy

We take security seriously. If you believe you've found a vulnerability in NexExam, please report it to us privately so we can address it before it's disclosed publicly.

## Reporting a vulnerability

**Do not file a public GitHub issue.** Public issues are visible to everyone the moment they're created and would expose users before we have a chance to fix the problem.

Instead, please email **security@nexexam.com** with:

- A clear description of the issue
- Steps to reproduce (a minimal proof-of-concept is ideal)
- The affected URL, endpoint, or component
- Your assessment of the impact
- (Optional) Suggested mitigation

If you'd like to encrypt your report, request our PGP key in your initial email.

## What to expect

- **Acknowledgement** within 3 business days of your initial report
- **Triage and initial response** within 7 business days, including a severity assessment and rough timeline
- **Fix and disclosure** coordinated with you — we aim for 90 days from acknowledgement, sooner for critical issues

We will keep you informed throughout the process. Once the issue is fixed and verified, we're happy to credit you publicly (with your permission).

## Scope

In scope:

- The NexExam web application (frontend + backend)
- The NexExam mobile app
- Public API endpoints under `/api/*`
- Authentication, authorization, and account-management flows
- Payment and billing flows
- AI tutor and study-AI features
- Anything touching student / creator data

Out of scope:

- Third-party services we depend on (Stripe, Neon, AWS, Anthropic, etc.) — report those to the vendor directly
- Automated scanner output without a working proof-of-concept
- Issues that require physical access to a user's device
- Social engineering attacks against staff or users
- Denial-of-service via traffic volume

## Safe-harbor

We will not pursue civil or criminal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service interruption while researching
- Report the issue privately to the address above before disclosing publicly
- Give us a reasonable amount of time to investigate and fix before disclosure
- Only access the minimum amount of data necessary to demonstrate the issue

## Disclosure preferences

We prefer **coordinated disclosure**. Please give us a reasonable window (typically 90 days) to ship a fix before any public write-up. If we can't ship a fix within that window, we'll explain why and propose a revised timeline.

## Thank you

We appreciate the responsible-disclosure community. Every report helps make NexExam safer for our students and creators.
