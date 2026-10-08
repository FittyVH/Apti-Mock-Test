const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config(); 
const app = require('./src/app');
const connectToDB = require('./src/db/db');
const { connectToRedis } = require('./src/db/redis')

const PORT = 3000;

(async () => {
    await connectToDB();
    await connectToRedis();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();