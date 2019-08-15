var express = require('express');
var router = express.Router();
var mariadb  = require('mariadb/callback');

const SERVER_HOST = 'localhost'; 
const MYSQL_PORT = 3306; // DB SERVER PORT

const FETCH_CNT_PER_ONETIME = 15; // 15개씩 Fetch 하겠다.

var configuration = {
  host: SERVER_HOST,
  user: 'root',
  password: 'shsbsy70',
  port: MYSQL_PORT,
  database: 'butter'
};

class DB {
  constructor(config) {
      this.connection = mariadb.createConnection(config);
  }

  query(sql, args) {
      return new Promise((resolve, reject) => {
          this.connection.query(sql, args, (err, rows) => {
              if (err)
                  return reject(err);
              resolve(rows);
          });
      });
  }

  getQuery() {
      return this.connection;
  }

  close() {
      return new Promise((resolve, reject) => {
          this.connection.end(err => {
              if (err)
                  return reject(err);
              resolve();
          });
      });
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/contentList', function(req, res, next) {
  console.log(" Get all contents List");
  let database = new DB(configuration);
  let bottomCnt = req.query.bottomCnt;
  let start = bottomCnt * FETCH_CNT_PER_ONETIME;  // ex) 0 * 15, 1 * 15 
  let getContentQuery = "select * from topic LIMIT "+start+", "+ FETCH_CNT_PER_ONETIME;  // select * from topic LIMIT 0, 15;  select * from topic LIMIT 15, 15 
  
  database.query(getContentQuery).then(result => {
    console.log(" result => ", result);
    res.send(200, result);

  }).catch(reject => {
    console.log(" reject => ", reject);
  });

});

module.exports = router;
