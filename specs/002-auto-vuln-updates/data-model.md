# Data Model: Automated Dependency Vulnerability Updates

**Feature**: Automated Dependency Vulnerability Updates
**Status**: Draft
**Source**: Derived from [spec.md](spec.md)

## Conceptual Entities

Since this feature integrates an external service (GitHub Dependabot) rather than building a custom data store, the following entities are conceptual and managed by GitHub:

### 1. Verification Alert (GitHub Native)
- **Source**: GitHub Advisory Database / Dependency Graph
- **Attributes**:
    - `Package Name`: (e.g., `lodash`)
    - `Affected Version Range`: (e.g., `< 4.17.21`)
    - `Severity`: Critical / High / Medium / Low
    - `Fixed Version`: (e.g., `4.17.21`)
    - `CVE ID`: Common Vulnerabilities and Exposures identifier

### 2. Security Update Pull Request (GitHub Native)
- **Source**: Dependabot
- **Attributes**:
    - `Title`: "Bump [package] from [version] to [version]"
    - `Description`: Release notes, changelog, commit history, severity assessment
    - `State`: Open / Merged / Closed
    - `Labels`: `dependencies`, `security`
    - **Relationship**: Linked to one or more `Verification Alert` entities.

## Data Flow

1. **Detection**: GitHub scans `package-lock.json` -> Identifies `Verification Alert`.
2. **Action**: Dependabot checks for fix -> Creates `Security Update Pull Request`.
3. **Review**: Maintainer reviews PR -> Merges manually (No auto-merge).
4. **Resolution**: PR Merged -> `Verification Alert` marked as resolved.
