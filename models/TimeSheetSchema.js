var mongoose = require('mongoose');

const TimeSheetSchema = mongoose.Schema({
    timeSheet: [
        {
            date: Date,
            entries: []
        }
    ]
})

module.exports = TimeSheet = mongoose.model('TimeSheetSchema', TimeSheetSchema);
