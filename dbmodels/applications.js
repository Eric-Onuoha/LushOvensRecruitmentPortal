const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    phone: String,
    email: String,
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q5: String,
    q6: String,
    q7: String,
    q8: String
});

ApplicationsDB = mongoose.model("applications", newsletterSchema);

module.exports = ApplicationsDB;