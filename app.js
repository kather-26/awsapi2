const { Pool } = require('pg');

const express = require('express');

const app = express();


const pool = new Pool({
  user: 'awstest',
  password: 'sara12345',
  host: 'awsdb.ctc20sbzit4u.us-east-1.rds.amazonaws.com', //mydatabase-instance.cxtwajouzpmw.ap-northeast-1.rds.amazonaws.com
  database: 'Test',
  port: 5432 // default PostgreSQL port
 
});

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/api/users/:username/password/:password', async (req, res) => {
    const { username, password } = req.params;
    try {
      const query = `
        SELECT username, password 
        FROM users 
        WHERE username = $1 AND password = $2;
      `;
      const result = await pool.query(query, [username, password]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { username: foundUsername, password: foundPassword } = result.rows[0];
      return res.json({ username: foundUsername, password: foundPassword });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  

  

app.listen(4000, () => {
  console.log('Server listening on port 4000');
});
