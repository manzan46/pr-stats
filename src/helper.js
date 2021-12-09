const core = require('@actions/core');
const humanizeDuration = require('humanize-duration');

module.exports = {
  objectLogger: (prefix, object) => {
    core.startGroup(`${prefix}`);
    const jsonObject = JSON.stringify(object, undefined, 2);

    core.info(`${jsonObject}`);
    core.endGroup();
  },

  averageTimeDiff: (a, b) => {
    if (!a && !b) {
      return null;
    }

    if (!a) {
      return b;
    }

    if (!b) {
      return a;
    }

    return (a + b) / 2;
  },

  averageValues(listOfValues) {
    let _sum = 0;
    for (const val of listOfValues) {
      _sum += val;
    }
    return _sum / listOfValues.length;
  },

  timeDiff: (start, end) => {
    if (!start || !end) {
      return null;
    }

    return Math.abs(new Date(start) - new Date(end));
  },

  humanize: duration => {
    return humanizeDuration(duration, { largest: 2, round: true });
  },
};
