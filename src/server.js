// server.js is the main entry point for the application.
// It sets up the Express server, connects to the database, and defines routes.
require('dotenv').config();
const app = require('./app');
const Database = require('./data-source.js');

const port = process.env.PORT || 8080;
// const port = 8080;
(async () => {
    try {
        await Database.connect();
        console.log('DB Connected Successfully');
        const server = app.listen(port, () => {
            console.log(`App is started on port: ${port}`);
        });

        const shutdown = async () => {
            console.log('Shutting down the server');
            try {
                await Database.disconnect();
                server.close(() => {
                    console.log('Server closed');
                    process.exit(0);
                });
            } catch (err) {
                console.error('Error during server shutdown:', err);
                process.exit(1);
            }
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    }
})();

