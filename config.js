fs = require('fs');
module.exports = {
    origin: process.env.ORIGIN || "http://localhost:8081",
    db: {
        username: process.env.DB_USER || "doadmin",
        password: process.env.DB_PASSWORD || "AVNS_w6o_w8PBxYdl3Wo8SMK",
        host: process.env.DB_HOST || "db-postgresql-sgp1-42824-do-user-12916083-0.b.db.ondigitalocean.com",
        port: process.env.DB_PORT || 25060,
        database: process.env.DB_NAME || "cup2022",
        dialect: "postgres",
        ssl: {
            rejectUnauthorized: false
          }
    },

    httpPort: process.env.PORT || 8080,
    sessionSecret: process.env.SESSION_SECRET || "octocat",

    // Timezone offset used for all datetime outputs (by moment.js)
    // Defaults to CEST (Central European Summer Time)
    timezone: "Europe/Berlin",

    // Set to true if the node runs behind a proxy that sets X-Forwarded-* headers
    trustProxy: process.env.TRUST_PROXY === "1",
};

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    module.exports.facebook = {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
    };
}

if (process.env.GOOGLE_APP_ID && process.env.GOOGLE_APP_SECRET) {
    module.exports.google = {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
    };
}

module.exports.mail = process.env.MAIL_SOLUTION;
module.exports.mailFrom = process.env.MAIL_FROM;
if (process.env.MAIL_SOLUTION === "smtp") {
    module.exports.mailParams = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        // secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    };
} else if (process.env.MAIL_SOLUTION === "mailgun") {
    module.exports.mailParams = {
        domain: process.env.MAILGUN_DOMAIN,
        apiKey: process.env.MAILGUN_API_KEY,
        host: process.env.MAILGUN_HOST,
    };
} else if (process.env.MAIL_SOLUTION === "mailjet") {
    module.exports.mailParams = {
        apiKey: process.env.MAILJET_API_KEY,
        apiSecret: process.env.MAILJET_API_SECRET,
    };
}
