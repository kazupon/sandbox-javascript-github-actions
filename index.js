const core = require('@actions/core')
const { context, GitHub } = require('@actions/github')

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main () {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet')
  console.log(`Hello ${nameToGreet}!`)
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`)
  console.log('context.owner', context.owner)
  console.log('context.repo', context.repo)
  const token = core.getInput('github-token', {required: true})
  const labels = core.getInput('labels').split(',')
  const opts = {}
  const client = new GitHub(token, opts)
  const { owner, repo } = context.repo
  const issues = await client.issues.listForRepo({
    labels,
    owner,
    repo
  })
  console.log('issues count', issues.length, issues)
  const time = (new Date()).toTimeString()
  core.setOutput("time", time)
  core.setOutput("count", issues.length)
}

function handleError(err) {
  console.error(err)
  if (err && err.message) {
    core.setFailed(err.message)
  } else {
    core.setFailed(`Unhandled error: ${err}`)
  }
}
