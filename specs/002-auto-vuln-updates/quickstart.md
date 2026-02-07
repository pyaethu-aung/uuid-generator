# Quickstart: Automated Dependency Vulnerability Updates

**Feature**: Automated Dependency Vulnerability Updates
**Status**: Draft

## Prerequisites

1. **Repository Permissions**: Admin access to repository settings.
2. **Package Manager**: `npm` project with `package.json` and `package-lock.json`.

## Configuration Steps

1. **Enable Dependency Graph**:
   - Go to Repository Settings > Security & analysis.
   - Enable "Dependency graph".

2. **Enable Dependabot Alerts**:
   - Go to Repository Settings > Security & analysis.
   - Enable "Dependabot alerts".

3. **Enable Dependabot Security Updates**:
   - Go to Repository Settings > Security & analysis.
   - Enable "Dependabot security updates".

4. **Verify `dependabot.yml`**:
   - Ensure `.github/dependabot.yml` exists in the default branch.
   - Verify contents match:
     ```yaml
     version: 2
     updates:
       - package-ecosystem: "npm"
         directory: "/"
         schedule:
           interval: "daily"
         open-pull-requests-limit: 10
     ```

## Verification

### How to trigger a test alert (controlled environment only)

*Warning: Do not do this in production if it disrupts workflows.*

1. Create a simplified test branch.
2. Add an old, known vulnerable dependency to `package.json` (e.g., `lodash@4.17.15`).
3. Run `npm install` and commit `package-lock.json`.
4. Push the branch to GitHub.
5. Wait for ~5-15 minutes.
6. Check "Security" tab > "Dependabot alerts".
7. Verify a PR is created to update `lodash` to a safe version.

## Troubleshooting

- **No Alerts?**: Check if "Dependency graph" is enabled.
- **No PRs?**: Check if "Dependabot security updates" is enabled or if `open-pull-requests-limit` is reached.
- **PRs not created for devDependencies?**: Check `dependabot.yml` for `allow` / `ignore` rules.
