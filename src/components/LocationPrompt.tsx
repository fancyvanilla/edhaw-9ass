'use client';

import { useEffect, useState } from 'react';

import { Location } from '@/types/types';

interface Props {
  readonly onLocationSet: (loc: Location) => void;
  readonly location: Location | null;
}
export default function LocationPrompt({ onLocationSet, location}: Props) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocationBasedOnCoordinates=async(long:number,lat:number)=>{
      const url=`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`
      return fetch(url)
      .then(res=>res.json())
      .then(data=>{
        const loc: Location = {
          city: data.address.state_district,
          region: data.address.state ,
          postCode : data.address.postcode,
        };
        onLocationSet(loc);
      })
      .catch(err=>{
        console.log('Failed to reverse geocode:', err);
        setError('Failed to retrieve location');
      })
      .finally(()=>{
        setLoading(false);
      });
    }
    const fetchLocation=async()=>{
    const url=`https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
    try {
      const response=await fetch(url)
      const data=await response.json()
      const { latitude, longitude } = data.location
      await fetchLocationBasedOnCoordinates(longitude,latitude)
    }
    catch(error){
      console.log(error)
      // Fallback: GEOAPIFY API quota exceeded, trying browser geolocation API
      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        return;
     }
      navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      await fetchLocationBasedOnCoordinates(longitude,latitude);
    }, (err) => {
        if (err.code !== err.PERMISSION_DENIED) {
        console.error('Geolocation error:', err);
        setError('Failed to retrieve location');
      }
      setLoading(false);
    },{
      maximumAge: 60000,
    });
    }
  }
    fetchLocation()
  }
  , [onLocationSet]);
  let locationContent;
  if (location) {
    locationContent = (
      <div className="flex flex-col items-start gap-2 dark:bg-white bg-gray-200 text-black p-4 rounded shadow md:w-[50em]">
      <p>
        <strong>📍 Location detected:</strong>
      </p>
      <p>
        {location.city && <span>{location.city}, </span>}
        {location.region && <span>{location.region} </span>}
        {location.postCode && <span>{location.postCode}</span>}
      </p>
      </div>
    );
  } else if (!error && !loading) {
    locationContent = (
      <div className="flex flex-col items-start gap-2 bg-white p-4 rounded shadow md:w-[40em]">
        <p>
          <strong>⚠️ Location access needed:</strong> Please enable location permissions in your browser.
        </p>
        <p>
          This helps us show you relevant outage reports for your area.
        </p>
      </div>
    );
  }
  if (loading) {
    locationContent = (
      <div className="flex items-center justify-center h-16">
        <span className="text-gray-500">Detecting location...</span>
      </div>
    );
  }

  return (
    <div className="mb-4 text-sm text-gray-600">
      {error ? <div className="text-red-500 mb-4">{error}</div> : locationContent}
    </div>
  );
}