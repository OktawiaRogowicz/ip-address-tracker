import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import BackgroundImage from "./ip-address-tracker-master/images/pattern-bg.png";
import SearchButtonImage from "./ip-address-tracker-master/images/icon-arrow.svg";
import axios from 'axios'
import {useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import markerIcon from './ip-address-tracker-master/images/icon-location.svg'

export const Container = styled.div`
  display: flex;
  //flex-direction: column;
  //align-items: center;
  text-align: center;
  justify-content: center;
  
  width: 100vw;
  min-height: 250px;
  height: 30vh;

  background-image: url(${BackgroundImage});
  background-color: var(--blue);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  position: relative;

  h1 {
    color: white;
    margin-top: 10vh;
  }

  @media (max-width: 768px) {
    height: 350px;
  }
`

export const IPContainer = styled.div`
  margin-top: 5vh;
  width: 100%;
  
  h1 {
    margin: 0 0 16px 0;
  }
`

export const SubmitContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 50px;
  width: 35%;
  min-width: 350px;
  margin-top: 1vh;
  margin-bottom: 1vh;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    width: 80%;
  }
`

export const IPSearchInput = styled.input`
  height: 100%;
  width: 100%;
  border: none;
  display: block;
  border-radius: 15px 0 0 15px;
  padding-left: 16px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
`

export const IPSearchButton = styled.button`
  height: 100%;
  width: 50px;
  border: none;
  background-color: var(--very_dark_gray);
  border-radius: 0 15px 15px 0;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);
`

export const ResultContainer = styled.div `
  box-sizing: border-box;
  display: flex;
  position: absolute;
  background-color: white;
  border-radius: 15px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.15);
  padding: 30px;
  width: 80%;
  min-width: 350px;
  height: 20vh;
  min-height: 80px;
  bottom: min(-10vh, -70px);
  justify-content: space-between;
  z-index: 999;

  @media (max-width: 768px) {
    display: inline-block;
    height: 300px;
    bottom: -150px;
  }
`

export const ResultSection= styled.div `
  display: block;
  
  width: 25%;
  text-align: left;
  
  h2 {
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0;
    color: var(--dark_gray);
  }
  
  p {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 10px 0 0 0;
    color: var(--very_dark_gray);
  }

  @media (max-width: 768px) {
    display: inline-block;
    width: 100%;
    text-align: center;
    
    h2 {
      margin: 0 0 5px 0;
    }
    
    p {
      margin: 0 0 15px 0;
    }
  }
`

export const VerticalLine = styled.div`
  float: left;
  height: 100%;
  width: 1px;
  margin-left: 2.5%;
  margin-right: 2.5%;
  background-color: var(--dark_gray);
  opacity: 0.5;

  @media (max-width: 768px) {
    display: none;
  }
`

function App() {

    const [input, setInput] = useState('');
    const [result, setResult] = useState({
        ip: 'IP',
        isp: 'ISP',
        location: 'Location',
        country: 'Country',
        region: 'region',
        timezone: 'Timezone'
    })

    async function getIPGeolocation() {
        const ip = input;
        const api_key = process.env.REACT_APP_GEO_API_KEY;
        const api_url = process.env.REACT_APP_GEO_API_URL;
        const url = api_url + 'apiKey=' + api_key + '&ipAddress=' + ip;

        console.log(ip, api_url, api_key);

        try {
            const res = await axios.get(url);
            const data = await res;
            if (data.status === 200) {

                console.log(data.data);

                const { ip, isp, location } = data.data;
                const { country, region, timezone } = location;

                setResult({
                    ip: ip,
                    isp: isp,
                    location: location,
                    country: country,
                    region: region,
                    timezone: timezone
                });
            }
        } catch(err) {
            if(err.response.status === 422){
                console.log('cant find location');
            }
        }
    }

    const position = [51.505, -0.09]

    const mIcon = window.L.icon({
        iconUrl: markerIcon,
        iconSize: [60, 60],
        iconAnchor: [20, 66]
    });

    return (
        <div>
        <Container>
            <IPContainer>
                <h1>IP Address Tracker</h1>
                <SubmitContainer>
                    <IPSearchInput
                        type="text"
                        placeholder="Search for any IP address or domain"
                        value={input} onInput={e => setInput(e.target.value)}
                    />
                    <IPSearchButton onClick={(e)=> {getIPGeolocation()}}>
                        <img src={SearchButtonImage} alt={"Logo"}/>
                    </IPSearchButton>
                </SubmitContainer>
            </IPContainer>
            <ResultContainer>
                <ResultSection>
                    <h2>IP Address</h2>
                    <p>{result.ip}</p>
                </ResultSection>
                <VerticalLine/>
                <ResultSection>
                    <h2>Location</h2>
                    <p>{result.country}, {result.region}</p>
                </ResultSection>
                <VerticalLine/>
                <ResultSection>
                    <h2>Timezone</h2>
                    <p>{result.timezone}</p>
                </ResultSection>
                <VerticalLine/>
                <ResultSection>
                    <h2>ISP</h2>
                    <p>{result.isp}</p>
                </ResultSection>
            </ResultContainer>
        </Container>
            <div style={{height: '70vh', zIndex: '1'}}>
            <MapContainer center={[51.505, -0.09]} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    // TODO: turns out that API's response doesn't include position for a marker anymore,
                    // TODO: so i cannot make it responsive anymore
                    position={[51.505, -0.09]}
                    icon={mIcon}
                />
            </MapContainer>
            </div>
        </div>
  );
}

export default App;
