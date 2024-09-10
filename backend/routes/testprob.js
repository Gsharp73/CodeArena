const express = require('express');
const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();
const router = express.Router();
const { auth } = require('../utils/authenticate');

router.post('/', auth, async (req, res) => {
  const submission = req.body;
  const problem = await db.collection('problems').findOne({ title: submission.title });

  if (!problem) {
    return res.status(400).json({ result: 'PROBLEM NOT FOUND', log: 'The specified problem does not exist.' });
  }

  try {
    const result = await runTestcase(problem, submission);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during code execution:", error);
    res.status(500).json({ result: 'SERVER ERROR', log: 'Internal Server Error' });
  }
});

async function runTestcase(problem, submission) {
  const submissionDir = path.join(__dirname, '..', 'submissions', submission.username);

  if (!fs.existsSync(submissionDir)) {
    fs.mkdirSync(submissionDir, { recursive: true });
  }

  const codeFilePath = path.join(submissionDir, `main.${submission.language}`);
  const inputFilePath = path.join(submissionDir, 'input.txt');
  const outputFilePath = path.join(submissionDir, 'output.txt');
  const errorFilePath = path.join(submissionDir, 'error.txt');

  fs.writeFileSync(codeFilePath, submission.code);

  for (let i = 0; i < problem.testcase.length; i++) {
    const testcase = problem.testcase[i];
    fs.writeFileSync(inputFilePath, testcase.input);

    const result = await executeInDocker(submission.language, {
      codeFilePath,
      inputFilePath,
      outputFilePath,
      errorFilePath
    });

    const output = fs.readFileSync(outputFilePath, 'utf-8');
    const error = fs.readFileSync(errorFilePath, 'utf-8');

    if (error) {
      return {
        result: 'COMPILATION ERROR',
        log: `Compilation error occurred at testcase ${i + 1}`,
        error,
      };
    }
    console.log('output', output.trim());
    console.log('output testcase', testcase.output.trim());
    if (output.trim() !== testcase.output.trim()) {
      return {
        result: 'WRONG ANSWER',
        log: `Wrong answer at testcase ${i + 1}`,
        expectedOutput: testcase.output,
        actualOutput: output.trim(),
      };
    }
  }

  return { result: 'ACCEPTED', log: 'All test cases passed successfully' };
}

async function executeInDocker(language, filePaths) {
  const { codeFilePath, inputFilePath, outputFilePath, errorFilePath } = filePaths;
  let imageName;
  let entryPoint;

  switch (language) {
    case 'cpp':
      imageName = 'cpp_image';
      entryPoint = 'g++ main.cpp -o main && ./main';
      break;
    case 'python':
      imageName = 'python_image';
      entryPoint = 'python3 main.py';
      break;
    case 'javascript':
      imageName = 'node-docker-image';
      entryPoint = 'node main.js';
      break;
    default:
      throw new Error('Unsupported language');
  }

  const container = await docker.createContainer({
    Image: imageName,
    Cmd: ['sh', '-c', `${entryPoint} < input.txt > output.txt 2> error.txt`],
    Tty: false,
    HostConfig: {
      Binds: [`${path.dirname(codeFilePath)}:/usr/src/app`], // volume binding
    },
    WorkingDir: '/usr/src/app',
  });

  try {
    await container.start();
    const result = await container.wait();

    if (result.StatusCode !== 0) {
      const error = fs.readFileSync(errorFilePath, 'utf-8');
      return {
        result: 'RUNTIME ERROR',
        log: `Runtime error occurred`,
        error,
      };
    }
  } finally {
    await container.remove();
  }
}

module.exports = router;
