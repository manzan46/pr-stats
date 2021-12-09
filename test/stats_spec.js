const chai = require('chai');
const should = chai.should();
const fs = require('fs');
const path = require('path');

const { getStatsFromEventsTimeline } = require('../src/stats');

describe('getStatsFromEventsTimeline', function () {
  const pr = {
    created_at: '2021-12-07T15:46:30Z',
    merged_at: '2021-12-08T17:40:53Z',
    user: {
      id: 1071963,
    },
  };

  let PrEventsTimeline;

  this.beforeEach(async () => {
    const data = await fs.promises.readFile(
      path.join(__dirname, 'examples/pr_events_timeline.json'),
      'utf-8'
    );

    PrEventsTimeline = JSON.parse(data);
  });

  it('computes the stats', () => {
    res = getStatsFromEventsTimeline(pr, PrEventsTimeline);

    res.should.eql({
      readyForReview: { fromPrCreation: 139000, fromPreviousStep: 139000 },
      firstReview: { fromPrCreation: 108000, fromPreviousStep: 31000 },
      firstApprovedReview: {
        fromPrCreation: 93255000,
        fromPreviousStep: 93147000,
      },
      merged: { fromPrCreation: 93263000, fromPreviousStep: 8000 },
    });
  });
});
