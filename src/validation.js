const core = require('@actions/core');
const github = require('@actions/github');

const VALID_EVENT_NAME = 'pull_request';
const CLOSED_TYPE_NAME = 'closed';

module.exports = {
  validateActionCtx: () => {
    const {
      eventName,
      payload: { action },
    } = github.context;

    core.info(`Github action context: on "${eventName}" ["${action}"]`);

    if (eventName === VALID_EVENT_NAME && action === CLOSED_TYPE_NAME) return;

    throw new Error(
      `This action runs only in the "${VALID_EVENT_NAME}" event with "${CLOSED_TYPE_NAME}" type.`
    );
  },

  isPrMerged: pr => {
    if (pr.merged == false) {
      core.info('PR closed but not merged, skipping ...');

      return false;
    }

    return true;
  },
};
