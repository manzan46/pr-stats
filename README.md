# 🌟 pr-stats 🌟

📈 `pr-stats` GitHub Actions allows to gather stats around merged Pull Requests and
understand where is time spend between Pull request creation and merged.

It will calculate stats for the merged PR but also give an average on the previously merged Pull Requests in the same repo.

🗯️ It can be used out of the box and write a comment in the Pull Request once merged. Or output can be used in a separate GitHub Actions (e.g Slack message) in order to show these stats.

⚠️ Not ready to use yet, still plenty to do:

- [] Add test

💡 Inspired by https://github.com/marketplace/actions/pull-request-stats

## Usage

Add a `.github/workflows/pr_stats.yaml` file with the following content in your repository.

```yaml
name: Pull Request Stats

on:
  pull_request:
    types: [closed]

jobs:
  stats:
    runs-on: ubuntu-latest
    steps:
      - name: Run pull request stats
        uses: wooclap/pr-stats@v0.2.0
        with:
          comment: true
```

## Input

| Input   | type    | default               |                                                                    |
| ------- | ------- | --------------------- | ------------------------------------------------------------------ |
| token   | string  | `${{ github.token }}` | To use specific Github authentication token                        |
| comment | boolean | false                 | if `true` the GitHub Action will add the stats as on the merged PR |

## Output

The output of this GitHub Actions will be `pr_stats` & `avg_pr_stats` as following object:

```js
{
  readyForReview: {
    fromPrCreation: int,
    fromPreviousStep: int,
  },
  firstReview: {
    fromPrCreation: int,
    fromPreviousStep: int,
  },
  firstApprovedReview: {
    fromPrCreation: int,
    fromPreviousStep: int,
  },
  merged: {
    fromPrCreation: int,
    fromPreviousStep: int,
  },
}
```

Few Note:

- All stats are in microseconds
- All stats have:
  - the time difference for between the stats since PR creation
  - The time difference since previous steps.

| stats               | explanation                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| readyForReview      | Time between PR creation and when the PR is made ready for review (0s if not created as Draft) |
| firstReview         | Time between PR creation and first review posted                                               |
| firstApprovedReview | Time between PR creation and first review approval                                             |
| merged              | Time between PR creation and merged                                                            |

## Logic

🔀 For now the logic is quite simple and assumed that steps are done in order:

- PR created (as draft or not)
- PR is reviewed (approved or not)
- PR is merged

⚠️ So there might be some weird behavior with using `Convert to draft feature`

## Comment on merged pull request

📸 Example of comment posted by the actions in the merged PR:

![image](https://user-images.githubusercontent.com/1071962/142687994-ca7896bc-fe0b-44a1-ae05-3c268b21a2ad.png)

## Build

`ncc build src/index.js --license LICENSE`
