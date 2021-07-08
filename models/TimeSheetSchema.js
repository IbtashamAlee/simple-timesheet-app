var mongoose = require('mongoose');

const TimeSheetSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    sheet: [
        {
            date: {
                type: Date,
                required: true
            },
            timeEntries: [
                {
                    clockIn: Date,
                    clockOut: Date
                }
            ]
        }
    ]
})

module.exports = TimeSheet = mongoose.model('TimeSheetSchema', TimeSheetSchema);
