/* This example requires Tailwind CSS v2.0+ */
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import Api from '../generics-services/api';
import Button from "@material-ui/core/Button";

export default function Home() {
    const [matches, setMatches] = useState([]);

    function getMatches() {
        Api.get('/matches', 'get').then(res => {
            setMatches(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        setTimeout(() => {
            getMatches();
        },1500)
    },[])

    return (
        <div className="max-w-4xl mx-auto">
            <div className="my-8 mx-5 flex justify-between">
                <div>
                    <h1 className="font-bold text-gray-900 text-2xl">All Matches</h1>
                </div>
                <div>
                    {
                        localStorage.getItem('access_token') ?
                        <Button variant="contained"
                                color="primary"
                            type="button"
                        >
                            <Link to='/add-match'>Add Match</Link>
                        </Button> :
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                            >
                                <Link to='/signin'>Sign in</Link>
                            </Button>
                    }
                </div>
            </div>
            <div className="flex flex-col">
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
                                        Team A
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Team B
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        City
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Date
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {matches && matches.map((match) => (
                                    <tr key={match._id} >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{match.teamA}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{match.teamB}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.city}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.date}</td>
                                    </tr>
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
