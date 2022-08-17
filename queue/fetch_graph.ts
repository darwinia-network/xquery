const axios = require('axios');
const { curry } = require('ramda');

const fetchGraph = async (url: string, queryStr: string, prop: string) => {
    try {
        const resp = await axios.post(url, { "query": queryStr })
        return resp.data.data.query[prop]
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}

export const fetch = curry(fetchGraph);
