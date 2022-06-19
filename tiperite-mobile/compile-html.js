const { writeFile, readFile } = require('fs').promises;

(async () => {
  const html = await readFile('./index.html', 'utf8');
  const js = await readFile('../tiperite/web-build/app.js', 'utf8');

  const jsHTML = [
    'export const html = `',
    html.replace('%DIST%', Buffer.from(js).toString('base64')),
    '`;',
  ].join('');

  await writeFile('./html.js', jsHTML);

  process.exit(0);
})();
