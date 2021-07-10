import React from "react";
import {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Api from '../generics-services/api.js'

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
            console.log(res)
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
            getTimeSheet();
            clearInterval(timeInterval);
        }
    }, [clockIn]);

    return (
        <div>
            <div className="flex justify-between max-w-4xl mx-auto">
                <div>
                    <label ref={hoursRef}>00</label>
                    <label>:</label>
                    <label ref={minutesRef}>00</label>
                    <label>:</label>
                    <label value="0" ref={secondsRef}>00</label>
                </div>
                {
                    !clockIn ? <Button onClick={() => {setClockIn(true); clockTime('clockin');}}>Clock In</Button>: <Button onClick={() => {setClockIn(false); clockTime('clockout')}}>Clock Out</Button>
                }
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
                                        <tr key={timesheet._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{timesheet.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timeEntry.clockIn}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timeEntry.clockOut}</td>
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
    )
}
