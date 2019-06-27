"use strict";

const visit = require('unist-util-visit');

const slugs = require('github-slugger')();

const toString = require('mdast-util-to-string');

module.exports = ({
  markdownAST
}, pluginOptions = {}) => {
  slugs.reset();
  visit(markdownAST, 'heading', node => {
    const headingTag = `h${node.depth}`;
    const headingText = toString(node);
    let headingWrapperStart = '';
    let headingWrapperEnd = '';
    if(node.children[0].type !== 'text' && node.children[0].url){
      headingWrapperStart = `<a href="${node.children[0].url}" ${node.children[0].url.startsWith('http')?'class="external"':''} rel="noopener noreferrer">`;
      headingWrapperEnd = '</a>';
    }
    const headingSlug = slugs.slug(headingText);
    node.type = 'html';
    node.value = `<${headingTag} id="${headingSlug}">${headingWrapperStart}${headingText}${headingWrapperEnd}</${headingTag}>`;
  });
  return markdownAST;
};