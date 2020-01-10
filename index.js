const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main () {
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`)
  const token = core.getInput('github-token', { required: true })
  const labels = core.getInput('labels').split(',')
  const opts = {}
  const client = new GitHub(token, opts)
  const { owner, repo } = context.repo
  const issues = await client.issues.listForRepo({
    labels,
    owner,
    repo,
    state: 'all'
  })
  console.log('issues count', issues.data.length, issues)
  core.setOutput("count", issues.data.length)
}

function handleError(err) {
  console.error(err)
  if (err && err.message) {
    core.setFailed(err.message)
  } else {
    core.setFailed(`Unhandled error: ${err}`)
  }
}
