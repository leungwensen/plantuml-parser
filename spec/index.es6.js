'use strict';
/**
 * index.es6 module
 * @module index.es6
 * @see module:index
 */
import './index.less';
import fixtures from './fixtures.json';
import $ from 'jquery';
const plantUMLParser = window.plantUMLParser;
console.log(fixtures);

const $results = $('#results');

function renderOne() {
  if (fixtures.length) {
    const fixture = fixtures.pop();
    $.get(`./fixtures/${fixture}`, (data) => {
      try {
        const result = plantUMLParser.parse(data);
        $results.append(`<div class="result success">
  <p class="name">${fixture}</p>
  <pre><code>${JSON.stringify(result, null, 2)}</code></pre>
</div>`);
      } catch(e) {
        $results.append(`<div class="result error">
  <p class="name">${fixture}</p>
  <pre><code>${e}</code></pre>
</div>`);
      }
      renderOne();
    });
  }
}
renderOne();

$results.on('click', '.result', (e) => {
  alert($(e.currentTarget).find('code').html());
});
