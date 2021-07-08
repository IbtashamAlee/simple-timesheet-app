let express = require('express');
let router = express.Router();
let TimeSheet = require('../models/TimeSheetSchema')
let checkToken = require('../middlewares/token-checker')
const jwt = require("jsonwebtoken");


Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

router.post('/clockin', checkToken, async (req, res) => {
    let token = jwt.decode(req.token);
    let date = new Date();
    let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
    let clockIn = new Date().addHours(5);

    await TimeSheet.findOne({userId: token.id, "sheet.date": currentDate}).then(async (result) => {
        if (result === null) {
            let timeSheet = new TimeSheet();
            timeSheet.userId = token.id;
            timeSheet.sheet.push({
                date: currentDate,
                timeEntries: [{
                    clockIn: clockIn
                }]
            })
            await timeSheet.save().then(() => {
                res.sendStatus(200);
            });
        } else {
            TimeSheet.findOne({userId: token.id, "sheet.date": currentDate}).then((result)=> {
                console.log(result);
                result.sheet[result.sheet.length - 1].timeEntries.push({
                    clockIn: clockIn
                })
                result.save();
                res.sendStatus(200);
            })
        }
    }).catch(err => {
        res.sendStatus(409);
        console.log(err);
    })
})

module.exports = router;
