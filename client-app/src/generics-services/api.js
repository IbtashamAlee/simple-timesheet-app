import axios from "axios";
import qs from "qs";


class Api {
    execute(url,method, dataobject={}) {
        return new Promise(function (resolve, reject) {
            const authAxios = axios.create({
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            authAxios({
                method: method,
                url: url,
                data: qs.stringify(dataobject),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).then((res) =>{
                resolve(res);
            }).catch((err) =>{
                reject(err);
            })
        })
    }

    get(url) {
        return new Promise((resolve, reject )=> {
            axios.get(url).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        })
    }
}

export default new Api();
