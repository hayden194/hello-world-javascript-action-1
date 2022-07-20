const ghCore = require('@actions/core');
const github = require('@actions/github');
const ghExec = require('@actions/exec');

async function run () {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = ghCore.getInput('who-to-greet');
  ghCore.info(`Hello ${nameToGreet}!`);


  //Get the JSON webhook payload for the event that triggered the workflow
  const context = JSON.stringify(github.context, undefined, 2);
  ghCore.info(`The github context: ${context}`);

  //OpenShift 登录
  //定义回调函数
  //成功的返回值
  let stdout = "";
  //错误的返回值
  let stderr = "";
  const finalExecOptions = {};
  finalExecOptions.listeners = {
    stdout: (chunk) => {
      stdout += chunk.toString();
    },
    stderr: (chunk) => {
      stderr += chunk.toString();
    },
  };

  //得到输入参数
//   const openshiftServerUrl = ghCore.getInput('openshift_server_url');
//   const openshiftToken = '--token=' + ghCore.getInput('openshift_token');

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
