const mysql2 = require('mysql2');
const util = require('util');

const pool = mysql2.createPool({
    connectionLimit: process.env.DB_CON_LIMIT,  // Max number of connections in the pool
    queueLimit: process.env.DB_Q_LIMIT,         // Max waiting connection requests (0 = unlimited)
    host: process.env.DB_HOST,                  // Database host
    port: process.env.DB_PORT,                  // Database port (default for MySQL)
    user: process.env.DB_USER,                  // Database username
    password: process.env.DB_PASSWORD,          // Database password
    database: process.env.DB_NAME,              // Database name
    multipleStatements: true,                   // Allow multiple queries in a single request
    connectTimeout: 10000,                      // Timeout before throwing a connection error (ms)
    waitForConnections: true,                   // Wait for available connection if the pool is full
    // acquireTimeout: 20000,       // Timeout before an error occurs in connection acquisition (ms)
    debug: false,                               // Debugging mode (set `true` to log connection info)
    // idleCheckInterval: 30000,    // Interval to check for idle connections (ms)
    // maxConnectionTimeout: 60000, // Max time a connection stays open before forced closure (ms)
    // idealPoolTimeout: 120000,    // Ideal timeout for pool connections (ms)
    // errorLimit: 5,               // Max connection retries before failing
    // preInitDelay: 500,           // Delay before initializing a connection (ms)
    // sessionTimeout: 1800000      // Time before an idle session disconnects (ms)
});

// Monitor pool events
// pool.on('connection', () => console.log('🔗 New connection established'));
// pool.on('acquire', () => console.log('✅ Connection acquired from pool'));
// pool.on('enqueue', () => console.log('⌛ Connection request enqueued (waiting)'));
// pool.on('release', () => console.log('🔄 Connection released back to pool'));

pool.getConnection((err, connection) => {
    if(err) {
        console.log('error while getting connection', err);
        throw err;
    } else {
        console.log('DB Pool Connected');
        connection.release();
        console.log('DB Pool Release');
    }
})

// Promisify for async/await support
// const promisePool = pool.promise();
// pool.query = util.promisify(pool.query).bind(pool);

module.exports = pool;