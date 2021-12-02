const express = require('express');
const next = require('next');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const db = require('./DB');
const { generateDocx, parseXLS, generateFieldNameMap } = require('./utils');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyparser.json());
  server.use(bodyparser.urlencoded({ extended: true }));

  server.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));

  server.post('/api/alias', (req, res) => {
    db.data.aliases = req.body;
    db.write();
    res.sendStatus(200);
  });

  server.post('/api/indexes', (req, res) => {
    db.data.indexes = req.body;
    db.write();
    res.sendStatus(200);
  });

  server.get('/api/alias', (req, res) => {
    db.read();
    res.send(db.data.aliases);
  });

  server.get('/api/indexes', (req, res) => {
    db.read();
    res.send(db.data.indexes);
  });

  server.post('/api/upload-template', (req, res) => {
    if (req.files && req.files.template) {
      const templateFile = req.files.template;
      const templatePath = path.join(__dirname, 'appdata', 'template.docx');
      db.data.template = {
        name: templateFile.name,
        mimetype: templateFile.mimetype,
        path: templatePath,
      };
      db.write();
      // eslint-disable-next-line consistent-return
      templateFile.mv(templatePath, (err) => {
        if (err) return res.status(500).send(err);

        return res.send({
          name: templateFile.name,
          mimetype: templateFile.mimetype,
        });
      });
    } else {
      res.sendStatus(200);
    }
  });

  server.delete('/api/template', (req, res) => {
    db.data.template = null;
    db.write();
    if (fs.existsSync(path.join(__dirname, 'appdata', 'template.docx'))) {
      fs.unlinkSync(path.join(__dirname, 'appdata', 'template.docx'));
    }
    res.sendStatus(200);
  });

  server.get('/api/template', (req, res) => {
    db.read();
    const { template } = db.data;
    if (!template) {
      return res.sendStatus(200);
    }
    res.download(path.join(__dirname, 'appdata', 'template.docx'), template.name);
  });

  server.get('/api/template-data', (req, res) => {
    db.read();
    const { template } = db.data;
    res.send(template);
  });

  server.post('/api/upload-datasheet', (req, res) => {
    if (req.files && req.files.datasheet) {
      const datasheetFile = req.files.datasheet;
      const datasheetPath = path.join(__dirname, 'appdata', 'datasheet.xlsx');
      db.data.datasheet = {
        name: datasheetFile.name,
        mimetype: datasheetFile.mimetype,
        path: datasheetPath,
      };
      db.write();
      // eslint-disable-next-line consistent-return
      datasheetFile.mv(datasheetPath, (err) => {
        if (err) return res.status(500).send(err);

        return res.send({
          name: datasheetFile.name,
          mimetype: datasheetFile.mimetype,
        });
      });
    } else {
      res.sendStatus(200);
    }
  });

  server.delete('/api/datasheet', (req, res) => {
    db.data.datasheet = null;
    db.write();
    if (fs.existsSync(path.join(__dirname, 'appdata', 'datasheet.xlsx'))) {
      fs.unlinkSync(path.join(__dirname, 'appdata', 'datasheet.xlsx'));
    }
    res.sendStatus(200);
  });

  server.get('/api/datasheet', (req, res) => {
    db.read();
    const { datasheet } = db.data;
    if (!datasheet) {
      return res.sendStatus(200);
    }
    res.download(path.join(__dirname, 'appdata', 'datasheet.xlsx'), datasheet.name);
  });

  server.get('/api/datasheet-data', (req, res) => {
    db.read();
    const { datasheet } = db.data;
    res.send(datasheet);
  });

  server.get('/api/generate', (req, res) => {
    db.read();
    const {
      datasheet, template, aliases, indexes,
    } = db.data;
    if (!datasheet || !template) {
      return res.sendStatus(500);
    }

    const fieldNameMap = generateFieldNameMap(datasheet.path, aliases);

    const debtAlias = aliases.find((alias) => alias.isDebt === true);

    const data = parseXLS(datasheet.path, +indexes.first - 1, +indexes.last - 1, +indexes.header - 1, fieldNameMap, debtAlias);

    const docx = generateDocx(template.path, { debts: data });

    const readStream = new stream.PassThrough();
    readStream.end(docx);

    res.set('Content-disposition', 'attachment; filename=debts.docx');
    res.set('Content-Type', 'text/plain');

    readStream.pipe(res);
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
