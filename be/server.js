//LOADS ENV VARIABLES FROM .env FILE FOR DATABASE CONNECTION AND JWT SECRET
// Makes them available in process.env
require('dotenv').config();
// app.js → builds the server; server.js → starts the server
//IMPORT THE APP (EXPRESS APPLICATION) FROM APP.JS
const app = require('./app')
//DEFINE THE PORT TO LISTEN ON, DEFAULT TO 3000 IF NOT SPECIFIED IN ENV
const PORT = process.env.PORT || 3000;
//START THE SERVER AND LOG THE URL TO THE CONSOLE
const logger = require('./utils/logger');
app.listen(PORT, () => {
    logger.logger.info(`Server running at http://localhost:${PORT}`);
})
