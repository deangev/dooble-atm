import React, { useRef, useState } from 'react'
import './App.css';
import { icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvent, MapConsumer, Popup } from 'react-leaflet'
import SearchIcon from '@material-ui/icons/Search';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import Axios from 'axios';

var myIcon = icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII='
})

function SetViewOnClick({ animateRef }) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom() + 1, {
      animate: animateRef.current || false,
    })
  })
  return null
}

function App() {
  const [map, setMap] = useState(null);
  const animateRef = useRef(true);
  const [atms, setAtms] = useState();

  const handleChange = async e => {
    if (e.target.value.length !== 0) {
      const getAtm = await Axios.post(`https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26&q=${e.target.value}`)
      setAtms(getAtm.data.result.records)
    }
  }

  return (
    <div className="App d-lg-flex d-block" >
      <MapContainer className="col-lg-9 col-12 map-wrapper" scrollWheelZoom={true} center={[31.07, 34.78]} zoom={8} whenCreated={setMap}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
        {atms && atms.map((atm, index) => {
          return (
            <Marker key={index} position={[atm.X_Coordinate, atm.Y_Coordinate]} icon={myIcon}>
              <Popup>
                <h6>{atm.Bank_Name}</h6>
                <p>{atm.ATM_Address}, {atm.City}</p>
              </Popup>
            </Marker>
          )
        })}
        <SetViewOnClick animateRef={animateRef} />
        <MapConsumer>
          {(map) => {
            let specificLocation = atms && atms.filter((el) => {
              return el.X_Coordinate > 30 && el.X_Coordinate < 33
            })
            specificLocation && specificLocation[0] && map.setView([specificLocation[0].X_Coordinate, specificLocation[0].Y_Coordinate], 10)
            return null
          }}
        </MapConsumer>
      </MapContainer>
      <div className="search-results-container col-lg-3 col-12">
        <div className="input-container">
          <input type="text" onChange={e => handleChange(e)} />
          <SearchIcon className="search-icon" />
        </div>
        <div className="results-container">
          {atms && atms.map((atm, index) => {
            return (
              <div key={index} onClick={() => {
                map.setView([atm.X_Coordinate, atm.Y_Coordinate], 12)
              }} className="bank-result-container d-flex flex-row-reverse border-bottom">
                <div id="atm-icon-container" className="d-flex align-items-center"><LocalAtmIcon /></div>
                <div className="atm-details-container">
                  <h5>{atm.Bank_Name}</h5>
                  <div>
                    <span>{atm.ATM_Address} | {atm.ATM_Type}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
