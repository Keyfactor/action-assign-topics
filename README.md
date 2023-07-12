# action-assign-topics
Assign topics based on integration_type 
```
name: Update Repo Settings
on: [workflow_dispatch]

jobs:
  read_type:
    runs-on: ubuntu-latest
    name: A test job to read the integration_type from integration-manifest.json
    steps:
      # To use this repository's private action,
      # you must check out the repository
      # Temporarily public, testing in personal Org
      - name: Checkout
        uses: actions/checkout@v3
        with:
          repo-token: ${{ secrets.GH_REPO_CONFIG}}
      - name: Update topic from integration_type
        id: update
        uses: keyfactor/action-assign-topics@main
        with:
          input-file: integration-manifest.json
          repo-token: ${{ secrets.GH_REPO_CONFIG}}

