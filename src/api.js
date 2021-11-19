const core = require("@actions/core");
const github = require("@actions/github");

const octokit = new github.getOctokit(core.getInput("token"));

module.exports = {
  getPreviousPullRequests: async () => {
    const { data } = await octokit.rest.pulls.list({
      ...github.context.repo,
      state: "closed",
      per_page: 50,
    });

    return data;
  },

  getPullRequestEventsTimeline: async (pr_number) => {
    const { data } = await octokit.rest.issues.listEventsForTimeline({
      ...github.context.repo,
      issue_number: pr_number,
      per_page: 100, // TODO: fetch all.
    });

    return data;
  },

  writeComment: async ({ pr_number, comment }) => {
    await octokit.rest.issues.createComment({
      ...github.context.repo,
      issue_number: pr_number,
      body: comment,
    });
  },
};
