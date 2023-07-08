import React, {useState, useEffect} from "react";
import { Button } from "reactstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import VolcanoMap from "./pageAdditions/map"
import BarChart from "./pageAdditions/barChart";

// displaying volcano page
export default function Volcano({token}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [volcanoInfo, setVolcanoInfo] = useState([]);
    //give initial position of map (0,0)
    //neccessary to do otherwise whilst API data is loading, the parameters are NaN
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [chartData, setChartData] = useState({
        labels: ["5km", "10km", "30km", "100km"],
        datasets: [{
            label: "Population Density",
            data: [0,0,0,0],
            backgroundColor: ['orange']

        }]
    });
    const [error, setError] = useState(null);
    

    let headers = {
        accept: "application/json", 
        "Content-Type": "application/json"
    };
    let showChart = false;

   if (token !== null && token !== 'undefined'){
    headers = {
        accept: "application/json", 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}`
    };
    showChart = true;
    }

    const url = `http://sefdb02.qut.edu.au:3001/volcano/${id}`;  

    useEffect(() => {
      fetch(url, {headers})
      .then(res => res.json())
      .then(volcano =>(
        setError(volcano.message),  
        {
            name:           volcano.name,
            country:        volcano.country,
            region:         volcano.region,
            subregion:      volcano.subregion,
            last_eruption:  volcano.last_eruption,
            summit:         volcano.summit,
            elevation:      volcano.elevation,
            latitude:       volcano.latitude,
            longitude:      volcano.longitude,
            population_5km: volcano.population_5km,
            population_10km: volcano.population_10km,
            population_30km: volcano.population_30km,
            population_100km: volcano.population_100km
        }))
        .then((info) => {
            setVolcanoInfo(info);
            setLat(info.latitude);
            setLong(info.longitude);
            setChartData({
                labels: ["5km", "10km", "30km", "100km"],
                datasets: [{
                    label: "Population Density",
                    data: [info.population_5km, info.population_10km, info.population_30km, info.population_100km],
                    backgroundColor: ['orange']
                }]
            })
        })
    }, [url]);
    return(
        
        <div className="volcano_page">
            {(error) ? <p>{error}</p> : null}
            <h1>{volcanoInfo.name}</h1>
            <p>Country: {volcanoInfo.country} </p>
            <p>Region: {volcanoInfo.region} </p>
            <p>Subregion: {volcanoInfo.subregion} </p>
            <p>Last Eruption: {volcanoInfo.last_eruption} </p>
            <p>Summit: {volcanoInfo.summit} </p>
            <p>Elevation: {volcanoInfo.elevation} </p>
            {VolcanoMap(Number(lat),Number(long))}
            <div className="volcano-button">
            <Button
                color="warning"
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/list?country=${volcanoInfo.country}`)}
            >
                Back
            </Button>
            </div>
            <div
            className="population-chart" 
            style = {{width: 700}}>
                <h3>Population Density</h3>
                { showChart ? <BarChart chartData={chartData} /> 
                : <p>Login to view population density chart</p>}
            </div>
        </div>
    );
}