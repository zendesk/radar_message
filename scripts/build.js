var Glue = require('gluejs'),
    fs = require('fs'),
    base = process.cwd(),
    out = fs.createWriteStream('./dist/radar_message.js');

if (!fs.existsSync(base + '/dist')) {
  fs.mkdirSync(base + '/dist');
}

new Glue()
  .set('verbose', true)
  .basepath('./lib')
  .include('.')
  .main('index.js')
  .replace({ minilog: 'Minilog' })
  .export('RadarMessage')
  .render(out);
