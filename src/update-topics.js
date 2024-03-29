
// TODO: move readJSON to exportable module


const fs = require('fs');
const core = require('@actions/core');
const { context } = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const jsonPath = core.getInput('input-file');
const token = core.getInput('repo-token');

const github = new Octokit({ auth: token });
const { owner, repo } = context.repo;
console.log(`owner: ${owner}, repo: ${repo}`)


async function getRepoTopics(owner, repo) {
  console.log(`Getting topics for Repo: ${repo}`);
  const response = await github.request("GET /repos/{owner}/{repo}/topics", {
    owner,
    repo
  });
  const repoTopics = response.data.names;
  return repoTopics;
}
async function updateRepoTopics(owner, repo, names) {
  console.log(`Replacing topic.names with ${names}`);
  try {
    const response = await github.request("PUT /repos/{owner}/{repo}/topics", {
      owner,
      repo,
      names
    });
    const repoTopics = response.data.names;

  } catch (e) {
    console.log(e.message)
  }
}

function topicFromType(type) {
  console.log(`Determining topic from type: ${type}`)
  switch (type) {
    case 'orchestrator':
      topic = 'keyfactor-universal-orchestrator'
      break;
    case 'windows-orchestrator':
      topic = 'keyfactor-orchestrator'
      break;
    case 'ca-gateway':
      topic = 'keyfactor-cagateway'
      break;
    case 'anyca-plugin':
      topic = 'keyfactor-anyca-plugin'
      break;
    case 'pam':
      topic = 'keyfactor-pam'
      break;
    case 'api-client':
      topic = 'keyfactor-api-client'
      break;
    default:
      console.log(`Unknwon type: ` + repoJSONProps.integration_type);
      topic = 'unknown'
  }
  console.log(`topic: ${topic}`)
  return topic;
}
async function checkAndUpdateTopic(owner, repo, path) {
  console.log(`Attempting to update topic for ${repo}`)
  try {
    console.log(`Attempting to read: ${jsonPath}`)
    const repoJSONProps = JSON.parse(fs.readFileSync(jsonPath));
    console.log(`repoJSONProps: ${repoJSONProps}`)
    console.log(`Calling out to topicFromType function with ${repoJSONProps.integration_type}`)
    const t = topicFromType(repoJSONProps.integration_type)
    console.log('integration_type:' + repoJSONProps.integration_type)
    console.log('Topic: ' + t)
    var repoTopics = await getRepoTopics(owner, repo)
    console.log(repoTopics);
    if (!repoTopics.includes(t)) {
      repoTopics.push(t);
      await updateRepoTopics(owner, repo, repoTopics)
    }
  } catch (e) {
    console.log(e.message)
    }
  }


checkAndUpdateTopic(owner, repo, jsonPath)
