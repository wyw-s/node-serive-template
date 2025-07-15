const Router = require('@koa/router');
const dict = require('../controller/dict')

const { ADMIN_ROUTE_PREFIX } = process.env;
const dictRouter = new Router({ prefix: `/${ADMIN_ROUTE_PREFIX}/dict` });

exports.dict = dictRouter
  .post('/selectDictPage', dict.list)
  .post('/list', dict.getDictByDictKey)
  .post('/add', dict.create)
  .post('/update', dict.updateDict)
  .post('/selectItemPage', dict.dictItemlist)
  .post('/addDictItem', dict.createDictItem)
  .post('/modifyDictItem', dict.updateDictItem);
