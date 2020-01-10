const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const token = core.getInput('github-token', {required: true})
  const labels = core.getInput('previews').split(',')
  const opts = {}
  const client = new GitHub(token, opts)
  const issues = client.issues.list({ labels })
  console.log('issues count', issues.count)
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  core.setOutput("count", issues.count);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}