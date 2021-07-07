var mongoose = require('mongoose');

const Entries = mongoose.Schema({
    clockIn: Date,
    clockOut: Date,
})

module.exports = TimeEntries = mongoose.model('timeEntriesSchema', Entries);
