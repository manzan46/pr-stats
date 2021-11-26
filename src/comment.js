const { humanize } = require("./helper");

module.exports = {
  buildComment: ({ prStats, averagePrStats }) => {
    const comment = `## 🌟 Merged Pull Request statistics 🌟
|| Ready for review  | Time to first review  | Time to approved review  | Time to merged |
|---|---|---|---|---|
| This PR | ${humanize(prStats.readyForReview.fromPrCreation)} |${humanize(
      prStats.firstReview.fromPrCreation
    )}  (${humanize(prStats.firstReview.fromPreviousStep)})|${humanize(
      prStats.firstApprovedReview.fromPrCreation
    )}  (${humanize(prStats.firstApprovedReview.fromPreviousStep)})|${humanize(
      prStats.merged.fromPrCreation
    )}  (${humanize(prStats.merged.fromPreviousStep)})|
| Avg Previous PRs | ${humanize(
      averagePrStats.readyForReview.fromPrCreation
    )}|${humanize(averagePrStats.firstReview.fromPrCreation)}  (${humanize(
      averagePrStats.firstReview.fromPreviousStep
    )})|${humanize(
      averagePrStats.firstApprovedReview.fromPrCreation
    )}  (${humanize(
      averagePrStats.firstApprovedReview.fromPreviousStep
    )})|${humanize(averagePrStats.merged.fromPrCreation)}  (${humanize(
      averagePrStats.merged.fromPreviousStep
    )})|

❓ All main stats are time difference from PR creation date and between round bracket the time difference for previous step.
For more information link for [the repo](https://github.com/woocalp/pr-stats).`;

    return comment;
  },
};
