var _ = require('lodash');

const {
  getPullRequestEventsTimeline,
  getPreviousPullRequests,
} = require('./api');
const { averageValues, timeDiff } = require('./helper');

const READY_FOR_REVIEW_EVENT = 'ready_for_review';
const REVIEWED_EVENT = 'reviewed';
const APPROVED_STATUS = 'approved';

const findFirstInTimeline = ({ timeline, fn }) => {
  return _.find(timeline, el => fn(el));
};

module.exports = {
  getStatsFromEventsTimeline: (pr, timeline) => {
    const prCreationDate = pr.created_at;
    const prMergedDate = pr.merged_at;

    const firstReadyForReviewEvent = findFirstInTimeline({
      timeline,
      fn: el => el.event == READY_FOR_REVIEW_EVENT,
    });
    const readyForReviewDate = firstReadyForReviewEvent
      ? firstReadyForReviewEvent.created_at
      : prCreationDate;

    const firstReviewEvent = findFirstInTimeline({
      timeline,
      fn: el => el.event == REVIEWED_EVENT && el.user.id !== pr.user.id,
    });
    const firstReviewDate = firstReviewEvent
      ? firstReviewEvent.submitted_at
      : null;

    const firstApprovedReviewEvent = findFirstInTimeline({
      timeline,
      fn: el => el.event == REVIEWED_EVENT && el.state === APPROVED_STATUS,
    });
    const firstApprovedReviewDate = firstApprovedReviewEvent
      ? firstApprovedReviewEvent.submitted_at
      : null;

    return {
      readyForReview: {
        fromPrCreation: timeDiff(prCreationDate, readyForReviewDate),
        fromPreviousStep: timeDiff(prCreationDate, readyForReviewDate),
      },
      firstReview: {
        fromPrCreation: timeDiff(prCreationDate, firstReviewDate),
        fromPreviousStep: timeDiff(readyForReviewDate, firstReviewDate),
      },
      firstApprovedReview: {
        fromPrCreation: timeDiff(prCreationDate, firstApprovedReviewDate),
        fromPreviousStep: timeDiff(firstReviewDate, firstApprovedReviewDate),
      },
      merged: {
        fromPrCreation: timeDiff(prCreationDate, prMergedDate),
        fromPreviousStep: timeDiff(firstApprovedReviewDate, prMergedDate),
      },
    };
  },

  getAveragePullRequestStats: async () => {
    let previousPRs = await getPreviousPullRequests();

    const statsResult = await Promise.all(
      previousPRs
        .filter(pr => pr.merged_at !== null)
        .map(async pr => {
          const stats = await module.exports.getPullRequestStats(pr);
          return stats;
        })
    );

    const result = {};
    ['readyForReview', 'firstReview', 'firstApprovedReview', 'merged'].forEach(
      column =>
        (result[column] = {
          fromPrCreation: averageValues(
            statsResult.map(sr => sr[column].fromPrCreation)
          ),
          fromPreviousStep: averageValues(
            statsResult.map(sr => sr[column].fromPreviousStep)
          ),
        })
    );

    return result;
  },

  getPullRequestStats: async pr => {
    const prNumber = pr.number;

    const timeline = await getPullRequestEventsTimeline(prNumber);

    return module.exports.getStatsFromEventsTimeline(pr, timeline);
  },
};
