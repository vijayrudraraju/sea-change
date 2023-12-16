// Data -> Music
// Time of Day
// Air Temperature
// Water Temperature
// Water Level
// Wind Speed/Direction

// DATA:
// 1.0
// https://tidesandcurrents.noaa.gov/map/index.shtml
// ** https://tidesandcurrents.noaa.gov/map/index.shtml?id=9416841 (Arena Cove)
// https://tidesandcurrents.noaa.gov/map/index.shtml?id=9410170 (San Diego Bay)
// https://api.tidesandcurrents.noaa.gov/api/prod/
// 2.0
// https://www.ncei.noaa.gov/support/access-search-service-api-user-documentation
// https://www.ncdc.noaa.gov/data-access
// https://www.ncdc.noaa.gov/cdo-web/datatools/findstation
// https://www.ncdc.noaa.gov/cdo-web/token
// https://www.ncdc.noaa.gov/cdo-web/webservices/v2#gettingStarted

// EXAMPLES:
// https://api.tidesandcurrents.noaa.gov/api/prod/

// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9414763&date=today&units=english&datum=MLLW&product=predictions&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=hilo

// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9416841&date=today&units=english&datum=MLLW&product=predictions&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=hilo
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9416841&date=latest&units=english&datum=MLLW&product=air_temperature&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9416841&date=latest&units=english&datum=MLLW&product=water_temperature&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9416841&date=latest&units=english&datum=MLLW&product=air_pressure&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9416841&date=latest&units=english&datum=MLLW&product=wind&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&station=9416841&date=latest&units=english&datum=MLLW&product=water_level&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=

// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&begin_date=20200813&end_date=20200814&datum=MLLW&station=9416841&time_zone=LST_LDT&units=english&format=json&application=NOS.COOPS.TAC.COOPSMAP
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&product=air_pressure&begin_date=20200813&end_date=20200814&station=9416841&units=english&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&product=water_temperature&begin_date=20200813&end_date=20200814&station=9416841&units=english&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&product=wind&begin_date=20200813&end_date=20200814&station=9416841&units=english&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?&product=air_temperature&begin_date=20200813&end_date=20200814&station=9416841&units=english&time_zone=LST_LDT&format=json&application=NOS.COOPS.TAC.COOPSMAP&interval=
// https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&begin_date=20200813&end_date=20200814&datum=MLLW&station=9416841&time_zone=LST_LDT&units=english&format=json&application=NOS.COOPS.TAC.COOPSMAP

/*
export let latitude
export let longitude

const noaaToken = 'wwFVuTwpINlRXRAnUWMeqYWBfhRusCme'

function getPosition(options) {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

const customFetch = async (url, params) => {
    const opts = {
        headers: {
            token: noaaToken
        }
    }

    return await fetch(
        url + new URLSearchParams(params),
        opts
    ).then(response => response.json())
}
*/

export const getGeoPosition = async (location = null) => {
    try {
        const options = {}
        // const { coords: { latitude, longitude } } = await getPosition(options)
        // const SW = [latitude - 0.1, longitude - 0.1]
        // const NE = [latitude + 0.1, longitude + 0.1]

        const limit = '1000'

        /*
        const stationsUrl = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?',
            dataTypesUrl = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes?',
            datasetsUrl = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets?'

        const stationsParams = { limit, locationid: 'ZIP:94606' },
            //stationsParams = { limit, extent: SW.concat(NE).toString() },
            //dataTypesParams = { locationID: 'COOP:043652', limit, datasetid: 'GHCND' },
            dataTypesParams = { locationid: 'ZIP:94606', limit, datasetid: 'GHCND' },
            datasetsParams = { limit }

        const stations = await customFetch(stationsUrl, stationsParams)
        const dataTypes = await customFetch(dataTypesUrl, dataTypesParams)
        const datasets = await customFetch(datasetsUrl, datasetsParams)
       */

        /*
        const dataUrl = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?'
        const dataParams = {
            datasetid: 'GHCND',
            locationid: 'ZIP:94606',
            startdate: '2019-05-01',
            enddate: '2019-05-01'
        }
        const data = await customFetch(dataUrl, dataParams)
        */

        const ARENA_COVE_CA = '9416841'
        const SAN_DIEGO_BAY_CA = '9410170'
        const NEAH_BAY_WA = '9443090'
        const KING_COVE_AK = '9459881'

        let station = ARENA_COVE_CA
        switch (location) {
            case 'arena-ca':
                station = ARENA_COVE_CA
                break
            case 'diego-ca':
                station = SAN_DIEGO_BAY_CA
                break
            case 'neah':
                station = NEAH_BAY_WA
                break
            case 'king':
                station = KING_COVE_AK
                break
            default:
                station = ARENA_COVE_CA
        }

        const predictionsUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?'
        const predictionsParams = {
            station,
            date: 'today',
            units: 'english',
            datum: 'MLLW',
            product: 'predictions',
            time_zone: 'LST_LDT',
            format: 'json',
            application: 'vijatsu',
            interval: 'hilo'
        }

        //const predictions = await fetch(predictionsUrl + new URLSearchParams(predictionsParams)).then(response => response.json())

        /*
        predictionsParams.product = 'air_pressure'
        const airPressure = await fetch(predictionsUrl + new URLSearchParams(predictionsParams)).then(response => response.json())

        predictionsParams.product = 'air_temperature'
        const airTemperature = await fetch(predictionsUrl + new URLSearchParams(predictionsParams)).then(response => response.json())
        */

        predictionsParams.product = 'water_level'
        const waterLevel = await fetch(predictionsUrl + new URLSearchParams(predictionsParams)).then(response => response.json())

        predictionsParams.product = 'water_temperature'
        const waterTemperature = await fetch(predictionsUrl + new URLSearchParams(predictionsParams)).then(response => response.json())

        predictionsParams.product = 'wind'
        const wind = await fetch(predictionsUrl + new URLSearchParams(predictionsParams)).then(response => response.json())

        const finalResult = {
            waterLevel,
            waterTemperature,
            wind
        }

        const result = {
            waterLevel: waterLevel.data,
            waterTemperature: waterTemperature.data,
            wind: wind.data
        }

        Object.keys(finalResult).map(key => {
            if (!!finalResult[key].data) {
                finalResult[key] = finalResult[key].data[finalResult[key].data.length - 1].v ?
                    finalResult[key].data[finalResult[key].data.length - 1].v :
                    {
                        direction: finalResult[key].data[finalResult[key].data.length - 1].dr,
                        degrees: finalResult[key].data[finalResult[key].data.length - 1].d,
                        knots: finalResult[key].data[finalResult[key].data.length - 1].s
                    }
            } else {
                // DEFAULTS
                switch (key) {
                    case 'waterLevel':
                        finalResult[key] = 5.0
                        break
                    case 'waterTemperature':
                        finalResult[key] = 55.0
                        break
                    case 'wind':
                        finalResult[key] = {
                            degrees: "180.0",
                            direction: "S",
                            knots: "5.0"
                        }
                        break
                }
            }
        })

        console.log('getGeoPosition()', result, finalResult)

        return finalResult
    } catch (err) {
        console.error(err.message)
    }
}
