import React, { useState } from 'react'
import { Map, Marker } from 'pigeon-maps'

//pigeon maps
export default function VolcanoMap(latitude, longitude) {
  const [center, setCenter] = useState([latitude, longitude])
  const [zoom, setZoom] = useState(1)


  return (
    <div className="map">
    <Map 

    width={400}
    height={300}
    center={center} 
    zoom={zoom} 
    onBoundsChanged={({ center, zoom }) => { 
        setCenter(center) 
        setZoom(zoom) 
    }} 
    >
    <Marker 
    width={50}
    anchor={[latitude, longitude]} 
  />
  </Map>
  </div>
  )
}
