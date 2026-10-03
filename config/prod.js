module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    cookieKey: process.env.COOKIE_KEY,
    emailUsername: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    sendGrid: process.env.SENDGRID_API_KEY,
    alerts: {
        fromEmail: process.env.ALERT_FROM_EMAIL,
        defaultNumber: process.env.SMS_DEFAULT,
        easternNumber: process.env.SMS_EASTERN,
        suppliesNumber: process.env.SMS_SUPPLIES,
        lashfixNumber: process.env.SMS_LASHFIX
    }
}
