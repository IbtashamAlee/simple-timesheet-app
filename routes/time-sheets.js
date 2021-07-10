let express = require('express');
let router = express.Router();
let TimeSheet = require('../models/TimeSheetSchema')
let checkToken = require('../middlewares/token-checker')
const jwt = require("jsonwebtoken");


router.post('/clockin', checkToken, async (req, res) => {
    let token = jwt.decode(req.token);
    let date = new Date();
    let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let clockIn = new Date();

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

router.post('/clockout', checkToken, async (req, res) => {
    let token = jwt.decode(req.token);
    let date = new Date();
    let currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    TimeSheet.findOne({userId: token.id, "sheet.date": currentDate}).then((result) => {
        console.log(result);
        let lastSheet = result.sheet.pop();
        console.log(lastSheet)
        lastSheet.timeEntries[lastSheet.timeEntries.length - 1].clockOut = new Date();
        result.sheet.push(lastSheet);
        result.save().then(() => {
            res.sendStatus(200)
        }).catch(()=> {
            res.sendStatus(409);
        });
    })
})

router.get('/', checkToken, async (req, res) => {
    let token = jwt.decode(req.token);
    TimeSheet.find({userId: token.id}).then((result) => {
        let sheets = [];

        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].sheet.length; j++){
                sheets.push(result[i].sheet[j]);
            }
        }
        res.send(sheets);
    }).catch(() => {
        res.sendStatus(409);
    })
})

module.exports = router;
