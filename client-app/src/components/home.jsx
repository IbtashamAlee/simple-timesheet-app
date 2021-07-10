import React from "react";
import {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Api from '../generics-services/api.js'
import Header from "./header";

export default function Home() {
    const [clockIn, setClockIn] = useState(false);
    const [timeInterval, setTimeInterval] = useState();
    const [timeSheets, setTimeSheets] = useState([]);

    const secondsRef = React.useRef();
    const minutesRef = React.useRef();
    let hoursRef = React.useRef();
    var totalSeconds = 0;

    function setTime()
    {
        totalSeconds = parseInt(secondsRef.current.getAttribute('value'));
        ++totalSeconds;

        localStorage.setItem('seconds', totalSeconds.toString());
        secondsRef.current.setAttribute("value", pad(totalSeconds));

        secondsRef.current.innerHTML = pad(totalSeconds%60);
        minutesRef.current.innerHTML = pad(parseInt((totalSeconds/60)%60));
        hoursRef.current.innerHTML = pad(parseInt((totalSeconds/60)/60))
    }


    function pad(val)
    {
        var valString = val + "";
        if(valString.length < 2)
        {
            return "0" + valString;
        }
        else
        {
            return valString;
        }
    }

    function getTimeSheet() {
        Api.execute('/timesheet', 'get').then(res => {
            setTimeSheets(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    function clockTime(clock) {
        Api.execute('/timesheet/' + clock, 'post').then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    function getTime(clockTime) {
        let date = new Date(clockTime);
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    function getDate(clockDate) {
        let date = new Date(clockDate);
        return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
    }

    useEffect(() => {
        if (localStorage.getItem('seconds')) {
            totalSeconds = localStorage.getItem('seconds');
            secondsRef.current.setAttribute("value", pad(totalSeconds));
            secondsRef.current.innerHTML = pad(totalSeconds%60);
            minutesRef.current.innerHTML = pad(parseInt((totalSeconds/60)%60));
            hoursRef.current.innerHTML = pad(parseInt((totalSeconds/60)/60))
        }
        if(clockIn) {
            setTimeInterval(setInterval(setTime, 1000));
        } if (!clockIn) {
            setTimeout(getTimeSheet, 2000);
            clearInterval(timeInterval);
        }
    }, [clockIn]);

    return (
        <div>
            <Header/>
            <div className="max-w-5xl min-w-5xl mx-auto">
                <div className="flex justify-between max-w-3xl min-w-3xl mx-auto mt-5">
                    <div className="text-gray-500">
                        Timer
                        <div className="text-gray-900 font-medium text-3xl">
                            <label ref={hoursRef}>00</label>
                            <label>:</label>
                            <label ref={minutesRef}>00</label>
                            <label>:</label>
                            <label value="0" ref={secondsRef}>00</label>
                        </div>
                    </div>
                    <div className="my-2">
                        {
                            !clockIn ?
                                <Button disabled={!!!localStorage.getItem("access_token")} color="primary" variant="contained" onClick={() => {setClockIn(true); clockTime('clockin');}}>Clock In</Button>
                                : <Button color="primary" variant="contained" disabled={!!!localStorage.getItem("access_token")} onClick={() => {setClockIn(false); clockTime('clockout')}}>Clock Out</Button>
                        }
                    </div>
                </div>
                <div className="flex flex-col mt-6 mx-10">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Clock In
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Clock Out
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {timeSheets.map((timesheet) => (
                                        timesheet.timeEntries.map((timeEntry) => (
                                            <tr key={timeEntry._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getDate(timesheet.date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTime(timeEntry.clockIn)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTime(timeEntry.clockOut)}</td>
                                            </tr>
                                        ))
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
