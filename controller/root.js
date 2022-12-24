const { google } = require('googleapis');
const axios = require('axios');
const { req } = require('pino-std-serializers');

let privatekey = {
    "type": process.env.CREDS_type,
    "project_id": process.env.CREDS_project_id,
    "private_key_id": process.env.CREDS_private_key_id,
    "private_key": process.env.CREDS_private_key,
    "client_email": process.env.CREDS_client_email,
    "client_id": process.env.CREDS_client_id,
    "auth_uri": process.env.CREDS_auth_uri,
    "token_uri": process.env.CREDS_token_uri,
    "auth_provider_x509_cert_url": process.env.CREDS_auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.CREDS_client_x509_cert_url
}

async function getJWT() {
    let jwt = new google.auth.JWT(
        privatekey.client_email,
        null,
        privatekey.private_key, ['https://www.googleapis.com/auth/drive']
    );
    jwt.authorize(function(err, tokens) {
        if (err) {
            console.log(`Failed to auth: ${err}`)
            return;
        }
    })
    return jwt
}

const getRaffleList = async (req, reply) => {
    let jwtClient = await getJWT()
    let drive = google.drive('v3');
    return new Promise((resolve, reject) => {
        const filesA = drive.files.list({
            auth: jwtClient,
            q: "mimeType = 'application/vnd.google-apps.spreadsheet' and (name contains 'Raffle' or name contains 'raffle')"
        }, (err, res) => {
            if (err) {
                console.log(`Failed to get drive: ${err}`);
                reject(`Error getting files: ${err}`)
                return;
            }
            console.log(res.data.files)
            resolve(res.data.files)
        })
    })
}

const getRaffleById = async (req, reply) => {
    let jwtClient = await getJWT()
    var data;
    let sheet = google.sheets('v4')
    return new Promise((resolve, reject) => {
        let title = ''
        const titleA = sheet.spreadsheets.get({
            auth: jwtClient,
            spreadsheetId: req.params.id
        }, (err, res) => {
            if (err) {
                console.log(`Failed to get sheet title: ${err}`)
                reject(`Failed to get sheet title: ${err}`)
                return;
            }
            title = res.data.properties.title
            const dataA = sheet.spreadsheets.values.get({
                auth: jwtClient,
                spreadsheetId: req.params.id,
                range: 'A:Q'
            }, (err, res) => {
                if (err) {
                    console.log(`Failed to get sheet values: ${err}`)
                    reject(`Error getting sheet values: ${err}`)
                    return;
                }

                data = { 'title': title, 'data': res.data.values }
                data = resolve(data)

            })
        })
    })
}

const getRandomNumber = async (req, reply) => {
    // random.org requires a min/max so just return 1 and exit
    let n = 1
    if (req.params.num && req.params.num > 0) {
        n = req.params.num
    }

    if (req.params.max < 1) {
        return {
            status: "failure",
            error: "Can't pick below 1" 
        }
    }
    if (req.params.max == 1) {
        return {
            status: "success",
            random: Math.round(Math.random() * 100),
            message: [1]
        }
    }

    const options = {
        port: 443,
        host: "api.random.org",
        path: "json-rpc/2/invoke",
        strict: true
    }

    const data = JSON.stringify({
        "jsonrpc": "2.0",
        "method": "generateIntegers",
        "params": {
            "apiKey": process.env.RANDOM_ORG_API,
            "n": n,
            "min": 1,
            "max": req.params.max,
            "replacement": true
        },
        "id": 1
    })
    const config = {
        method: "POST",
        url: `https://${options.host}/${options.path}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }
    let res = await axios(config)
    if (res.status === 200) {
        console.log(res)
        return {
            status: "success",
            nonRandom: Math.round(Math.random() * 100),
            message: res.data.result.random.data
        }
    } else {
        return {
            status: "failure",
            message: []
        }
    }
}

const getRaffleUser = async (req, reply) => {

}

const createRaffle = async (req, reply) => {

}
const createUser = async (req, reply) => {

}
const saveRaffleWinners = async (req, reply) => {

}
module.exports = {
    getRaffleList,
    getRaffleById,
    getRandomNumber,
    getRaffleUser,
    createRaffle,
    createUser,
    saveRaffleWinners
}