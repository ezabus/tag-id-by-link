const express = require('express');
const jsdom = require('jsdom');
const axios = require('axios');

const {
  JSDOM
} = jsdom;

async function startService(port) {
  const app = express();

  app.get('/byLink', async (req, res) => {
    const { link } = req.query;
    const playerTagId = await tagId(link);
    res.send(playerTagId);
  });

  app.listen(port, () => {
    console.log(`TagId service is started on port ${port}`);
  });
}
const linkMap = {};

async function tagId(url) {
  let id = fromLink(url);
  if (id) {
    return id;
  }
  id = fromMap(url);
  if (id) {
    return id;
  }
  id = await fromPlayerProfile(url);
  return id;
}

function fromLink(url) {
  let id = null;
  if (url.indexOf('tags') !== -1) {
    id = url.substring(url.indexOf('tags') + 5, url.lastIndexOf('/'));
  }
  return id;
}

function fromMap(url) {
  let id = null;
  if (linkMap[url]) {
    id = linkMap[url];
  }
  return id;
}

async function fromPlayerProfile(url) {
  const pageDocument = await getPageDocument(url);
  const element = pageDocument.querySelector('.b-user-rating');
  const id = element.getAttribute('data-tag-id');
  linkMap[url] = id;
  return id;
}

async function getPageDocument(url) {
  const pageContent = await axios.get(url);
  const dom = new JSDOM(pageContent.data);
  return dom.window.document;
}


startService(4002);
