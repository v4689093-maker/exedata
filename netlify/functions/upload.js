const fetch = require("node-fetch");

exports.handler = async (event) => {

  const GITHUB_TOKEN = "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";
  const REPO = "v4689093-maker/exeleaks-data";

  const newData = JSON.parse(event.body);

  // get old data
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/scripts.json`);
  const file = await res.json();

  const content = JSON.parse(Buffer.from(file.content, "base64").toString());

  // add new script
  content.push(newData);

  const updated = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

  // update file
  await fetch(`https://api.github.com/repos/${REPO}/contents/scripts.json`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "New Script Added",
      content: updated,
      sha: file.sha
    })
  });

  return {
    statusCode: 200,
    body: "Uploaded"
  };
};