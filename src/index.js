const core = require('@actions/core');
const github = require('@actions/github');

const { writeComment } = require('./api');
const { buildComment } = require('./comment');
const { objectLogger } = require('./helper');
const { getPullRequestStats, getAveragePullRequestStats } = require('./stats');
const { isPrMerged, validateActionCtx } = require('./validation');

const run = async () => {
  try {
    validateActionCtx();

    const currentPR = github.context.payload.pull_request;
    if (!isPrMerged(currentPR)) {
      return;
    }

    const prStats = await getPullRequestStats(currentPR);
    const averagePrStats = await getAveragePullRequestStats();

    if (core.getBooleanInput('comment')) {
      const comment = buildComment({ prStats, averagePrStats });
      await writeComment({
        pr_number: currentPR.number,
        comment,
      });
    }

    objectLogger('pr_stats', prStats);
    objectLogger('avg_pr_stats', averagePrStats);

    core.setOutput('pr_stats', prStats);
    core.setOutput('avg_pr_stats', averagePrStats);

    core.info('Action successfully executed');
  } catch (error) {
    core.debug(`Execution failed with error: ${error.message}`);
    core.debug(error.stack);
    core.setFailed(error.message);
  }
};

run();
