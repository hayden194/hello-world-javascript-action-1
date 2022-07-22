const ghCore = require('@actions/core');
const github = require('@actions/github');
const ghExec = require('@actions/exec');

//`who-to-greet` input defined in action metadata file
const nameToGreet = ghCore.getInput('who-to-greet');
ghCore.info(`Hello ${nameToGreet}!`);



//get artifactory registry user
const registry_user=ghCore.getInput('REGISTRY_USER');
//get artifactory registry password
const registry_password=ghCore.getInput('REGISTRY_PASSWORD'); 

//get artifactory registry url
const registry_url=ghCore.getInput('REGISTRY_URL');

//get artifactory registry repository
const registry_repository=ghCore.getInput('REGISTRY_REPOSITORY');

//get artifactory registry repos tag name
const registry_repos_tag_name=ghCore.getInput('REGISTRY_REPOS_TAG_NAME');

//get artifactory image path
const registry_image_path=registry_url+"/"+registry_repository+"/"+registry_repos_tag_name;

//get artifactory registy repos tag version
const registy_repos_tag_version=ghCore.getInput('REGISTRY_REPOS_TAG_VERSION'); 

//成功的返回值
let stdout = "";
//错误的返回值
let stderr = "";
//定义回调函数
const finalExecOptions = {};
finalExecOptions.listeners = {
  stdout: (chunk) => {
    stdout += chunk.toString();
  },
  stderr: (chunk) => {
    stderr += chunk.toString();
  },
};

async function run () {
  
  //Get the JSON webhook payload for the event that triggered the workflow
  const context = JSON.stringify(github.context, undefined, 2);
  ghCore.info(`The github context: ${context}`);

  //组合参数
  const ocExecArgs = ['clone', '-b', 'master','https://github.com/hayden194/build-source-code'];

  //执行登录
  const exitCode = await ghExec.exec('git', ocExecArgs, finalExecOptions);
  if (exitCode !== 0) {
    let error = `${path.basename(EXECUTABLE)} exited with code ${exitCode}`;
    if (stderr) {
      error += `\n${stderr}`;
    }
    throw new Error(error);
  }

  //打印登录成功消息
  ghCore.info('openshift login success message:' + stdout);

  //输出参数
  const time = (new Date()).toTimeString();
  ghCore.setOutput("time", time);
}

run()
  .then(() => {
    ghCore.info("Success.");
  })
  .catch(ghCore.setFailed);
