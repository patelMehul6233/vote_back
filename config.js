const config = {
    production: {
        database: process.env.PRODUCTION_DB_URL,
        sessionSecret: process.env.PRODUCTION_SESSION_SECRET,
        port: process.env.PORT
    },
    development: {
        database: process.env.DEVELOPMENT_DB_URL,
        sessionSecret: process.env.DEVELOPMENT_SESSION_SECRET,
        port: process.env.PORT
    },
}
const users = require('./modules/user/route');
const admins = require('./modules/admin/route')
const routes = [
    users,
    admins
];
module.exports = {
    get: env => config.production[env] || config.development,
    routes
}