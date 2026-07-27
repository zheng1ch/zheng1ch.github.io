'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LocateFixed, Map as MapIcon, Moon, Satellite, Search, X } from 'lucide-react';
import { AIRPORTS, FlightRecord } from '@/lib/flightMap';

interface Props { flights: FlightRecord[] }
type MapTheme='light'|'dark'|'satellite';
type CountRow=[string,number];
type LatLngLiteral={lat:number,lng:number};
interface GoogleMapInstance { addListener:(event:string,handler:()=>void)=>void; fitBounds:(bounds:GoogleBounds, padding?:number)=>void }
interface GoogleBounds { extend:(position:LatLngLiteral)=>void }
interface GoogleMarker { addListener:(event:string,handler:()=>void)=>void }
interface GoogleInfoWindow { close:()=>void; setContent:(content:string)=>void; open:(options:GoogleMapInstance|{map:GoogleMapInstance,anchor:GoogleMarker})=>void }
interface GoogleMapsApi {
  Map:new(node:HTMLElement,options:Record<string,unknown>)=>GoogleMapInstance;
  InfoWindow:new()=>GoogleInfoWindow;
  LatLngBounds:new()=>GoogleBounds;
  Polyline:new(options:Record<string,unknown>)=>unknown;
  Marker:new(options:Record<string,unknown>)=>GoogleMarker;
  SymbolPath:{CIRCLE:unknown};
  ControlPosition:{RIGHT_BOTTOM:unknown};
}
interface FlightAnalytics {
  airportTouches:CountRow[]; routes:CountRow[]; airlines:CountRow[]; aircraft:CountRow[];
  countries:number; countryTouches:CountRow[]; distance:number; domestic:number; international:number;
  byDistance:{airports:CountRow[],airlines:CountRow[],aircraft:CountRow[],routes:CountRow[],countries:CountRow[]};
  yearCounts:CountRow[]; yearDistance:CountRow[]; monthCounts:CountRow[]; monthDistance:CountRow[]; dayCounts:CountRow[]; dayDistance:CountRow[];
}
type MapsWindow=Window&{google?:{maps:GoogleMapsApi};__prismGoogleMapsReady?:()=>void};

const DARK_MAP_STYLES=[
  {elementType:'geometry',stylers:[{color:'#111827'}]},
  {elementType:'labels.text.stroke',stylers:[{color:'#111827'}]},
  {elementType:'labels.text.fill',stylers:[{color:'#64748b'}]},
  {featureType:'administrative.country',elementType:'geometry.stroke',stylers:[{color:'#334155'}]},
  {featureType:'administrative.province',elementType:'geometry.stroke',stylers:[{color:'#263244'}]},
  {featureType:'landscape',elementType:'geometry',stylers:[{color:'#111827'}]},
  {featureType:'poi',stylers:[{visibility:'off'}]},
  {featureType:'road',stylers:[{visibility:'off'}]},
  {featureType:'transit',stylers:[{visibility:'off'}]},
  {featureType:'water',elementType:'geometry',stylers:[{color:'#050a12'}]},
  {featureType:'water',elementType:'labels.text.fill',stylers:[{color:'#475569'}]},
];
let googleMapsPromise:Promise<GoogleMapsApi>|null=null;
function loadGoogleMaps(){
  if(typeof window==='undefined')return Promise.reject(new Error('Google Maps requires a browser'));
  const mapsWindow=window as MapsWindow;
  if(mapsWindow.google?.maps)return Promise.resolve(mapsWindow.google.maps);
  if(googleMapsPromise)return googleMapsPromise;
  const key=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  googleMapsPromise=new Promise((resolve,reject)=>{
    if(!key){reject(new Error('Missing Google Maps API key'));return;}
    const callback='__prismGoogleMapsReady';
    mapsWindow.__prismGoogleMapsReady=()=>{
      const maps=mapsWindow.google?.maps;
      delete mapsWindow.__prismGoogleMapsReady;
      if(typeof maps?.Map==='function')resolve(maps);
      else reject(new Error('Google Maps loaded without the Maps library'));
    };
    const script=document.createElement('script');
    script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=${callback}`;
    script.async=true;
    script.onerror=()=>{delete mapsWindow.__prismGoogleMapsReady;googleMapsPromise=null;reject(new Error('Google Maps failed to load'));};
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

function distanceKm(f: FlightRecord) {
  const a=AIRPORTS[f.from], b=AIRPORTS[f.to], rad=Math.PI/180;
  const dLat=(b.lat-a.lat)*rad, dLng=(b.lng-a.lng)*rad;
  const h=Math.sin(dLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLng/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}

function counts(values:string[]) { const map=new Map<string,number>(); values.filter(Boolean).forEach(v=>map.set(v,(map.get(v)||0)+1)); return [...map].sort((a,b)=>b[1]-a[1]); }
function weightedCounts(flights:FlightRecord[],keys:(flight:FlightRecord)=>string[]){const map=new Map<string,number>();flights.forEach(f=>{const km=distanceKm(f);keys(f).filter(Boolean).forEach(key=>map.set(key,(map.get(key)||0)+km));});return [...map].sort((a,b)=>b[1]-a[1]);}
const AIRLINES:Record<string,{iata:string,name:string}>={AAL:{iata:'AA',name:'American Airlines'},AAR:{iata:'OZ',name:'Asiana Airlines'},ASA:{iata:'AS',name:'Alaska Airlines'},BHA:{iata:'U4',name:'Buddha Air'},CCA:{iata:'CA',name:'Air China'},CES:{iata:'MU',name:'China Eastern Airlines'},CHH:{iata:'HU',name:'Hainan Airlines'},CPA:{iata:'CX',name:'Cathay Pacific'},CRK:{iata:'HX',name:'Hong Kong Airlines'},CSH:{iata:'FM',name:'Shanghai Airlines'},CSN:{iata:'CZ',name:'China Southern Airlines'},CSZ:{iata:'ZH',name:'Shenzhen Airlines'},CXA:{iata:'MF',name:'XiamenAir'},DAL:{iata:'DL',name:'Delta Air Lines'},DKH:{iata:'HO',name:'Juneyao Air'},HAL:{iata:'HA',name:'Hawaiian Airlines'},JBU:{iata:'B6',name:'JetBlue Airways'},QTR:{iata:'QR',name:'Qatar Airways'},SIL:{iata:'3M',name:'Silver Airways'},SWA:{iata:'WN',name:'Southwest Airlines'},UAL:{iata:'UA',name:'United Airlines'},UIA:{iata:'B7',name:'UNI Air'}};
function airlineInfo(code:string){return AIRLINES[code]||{iata:code,name:code};}
function airportSearch(code:string){const a=AIRPORTS[code];return `${code} ${a?.city||''} ${a?.name||''} ${a?.country||''}`;}
function countryFlag(code:string){return code.length===2?String.fromCodePoint(...[...code.toUpperCase()].map(char=>127397+char.charCodeAt(0))):'🌐';}
function estimatedDuration(flight:FlightRecord){return distanceKm(flight)/730+.68;}
function formatDuration(hours:number){return hours<1?`${Math.round(hours*60)} min`:`${Math.floor(hours)} h ${Math.round((hours%1)*60)} min`;}
function aircraftAbbreviation(name:string){return name.replace(/^Airbus\s+/,'').replace(/^Boeing\s+/,'B').replace(/^Embraer RJ\s*/,'ERJ-').replace(/^Embraer\s+/,'E').replace(/^Bombardier CRJ\s*/,'CRJ-').replace(/^Bombardier Dash 8\s*/,'DHC-8-').replace(/^McDonnell Douglas\s+/,'MD-').replace(' ER','ER').replace(/\s+/g,'');}

export default function FlightMap({ flights }: Props) {
  const mapNode=useRef<HTMLDivElement>(null), mapRef=useRef<GoogleMapInstance|null>(null);
  const [query,setQuery]=useState(''), [year,setYear]=useState('all'), [mapError,setMapError]=useState(''), [mapTheme,setMapTheme]=useState<MapTheme|null>(null);
  const [unit,setUnit]=useState<'km'|'mi'>('mi');
  useEffect(()=>{const sync=()=>setMapTheme(document.documentElement.classList.contains('dark')?'dark':'light');sync();const observer=new MutationObserver(sync);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>observer.disconnect();},[]);
  const chooseMapTheme=(theme:MapTheme)=>setMapTheme(theme);
  const years=useMemo(()=>[...new Set(flights.map(f=>f.date.slice(0,4)))].sort().reverse(),[flights]);
  const visible=useMemo(()=>flights.filter(f=>{const airline=airlineInfo(f.airline);const haystack=`${airportSearch(f.from)} ${airportSearch(f.to)} ${f.airline} ${airline.iata} ${airline.name} ${f.flight} ${f.aircraft}`.toLowerCase();return(year==='all'||f.date.startsWith(year))&&(!query||haystack.includes(query.toLowerCase()));}),[flights,year,query]);
  const analytics=useMemo(()=>{
    const airportTouches=counts(visible.flatMap(f=>[f.from,f.to]));
    const routes=counts(visible.map(f=>[f.from,f.to].sort().join('–')));
    const airlines=counts(visible.map(f=>airlineInfo(f.airline).iata));
    const aircraft=counts(visible.map(f=>f.aircraft||'Unknown aircraft'));
    const countries=new Set(airportTouches.map(([code])=>AIRPORTS[code].country));
    const domestic=visible.filter(f=>AIRPORTS[f.from].country===AIRPORTS[f.to].country).length;
    const distance=visible.reduce((sum,f)=>sum+distanceKm(f),0);
    const routeKey=(f:FlightRecord)=>[f.from,f.to].sort().join('–');
    const uniqueCountries=(f:FlightRecord)=>[...new Set([AIRPORTS[f.from].country,AIRPORTS[f.to].country])];
    const countryTouches=counts(visible.flatMap(uniqueCountries));
    const byDistance={airports:weightedCounts(visible,f=>[f.from,f.to]),airlines:weightedCounts(visible,f=>[airlineInfo(f.airline).iata]),aircraft:weightedCounts(visible,f=>[f.aircraft||'Unknown aircraft']),routes:weightedCounts(visible,f=>[routeKey(f)]),countries:weightedCounts(visible,uniqueCountries)};
    const yearCounts=counts(visible.map(f=>f.date.slice(0,4))).sort((a,b)=>a[0].localeCompare(b[0]));
    const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const yearDistance=weightedCounts(visible,f=>[f.date.slice(0,4)]).sort((a,b)=>a[0].localeCompare(b[0]));
    const monthMap=new Map(monthNames.map(m=>[m,0])),monthDistanceMap=new Map(monthNames.map(m=>[m,0]));visible.forEach(f=>{const m=monthNames[Number(f.date.slice(5,7))-1];if(m){monthMap.set(m,(monthMap.get(m)||0)+1);monthDistanceMap.set(m,(monthDistanceMap.get(m)||0)+distanceKm(f));}});
    const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],dayMap=new Map(dayNames.map(d=>[d,0])),dayDistanceMap=new Map(dayNames.map(d=>[d,0]));visible.forEach(f=>{const d=new Date(`${f.date}T12:00:00`).getDay(),name=dayNames[d];dayMap.set(name,(dayMap.get(name)||0)+1);dayDistanceMap.set(name,(dayDistanceMap.get(name)||0)+distanceKm(f));});
    return {airportTouches,routes,airlines,aircraft,countries:countries.size,countryTouches,distance,domestic,international:visible.length-domestic,byDistance,yearCounts,yearDistance,monthCounts:[...monthMap],monthDistance:[...monthDistanceMap],dayCounts:[...dayMap],dayDistance:[...dayDistanceMap]};
  },[visible]);

  useEffect(()=>{
    if(!mapTheme)return;
    let disposed=false;
    (async()=>{
      const maps=await loadGoogleMaps();
      if(disposed||!mapNode.current)return;
      const airportFlights=new Map<string,FlightRecord[]>(),routeGroups=new Map<string,FlightRecord[]>();
      visible.forEach(f=>{airportFlights.set(f.from,[...(airportFlights.get(f.from)||[]),f]);airportFlights.set(f.to,[...(airportFlights.get(f.to)||[]),f]);const key=[f.from,f.to].sort().join('|');routeGroups.set(key,[...(routeGroups.get(key)||[]),f]);});
      const satellite=mapTheme==='satellite';
      const map=new maps.Map(mapNode.current,{center:{lat:28,lng:0},zoom:2.25,minZoom:2,mapTypeId:satellite?'satellite':'roadmap',styles:mapTheme==='dark'?DARK_MAP_STYLES:null,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,zoomControl:true,zoomControlOptions:{position:maps.ControlPosition.RIGHT_BOTTOM},gestureHandling:'greedy',backgroundColor:mapTheme==='dark'?'#07101d':'#dbeafe'});
      mapRef.current=map;
      const info=new maps.InfoWindow(),bounds=new maps.LatLngBounds();
      map.addListener('click',()=>info.close());
      const routeColor=mapTheme==='light'?'#f43f5e':'#38bdf8';
      routeGroups.forEach((items,key)=>{const [from,to]=key.split('|'),a=AIRPORTS[from],b=AIRPORTS[to],count=items.length,weight=count>=10?6:count>=2?3.5:2.75,opacity=count>=10?.98:count>=2?.92:.84;new maps.Polyline({map,path:[{lat:a.lat,lng:a.lng},{lat:b.lat,lng:b.lng}],geodesic:true,strokeColor:routeColor,strokeOpacity:opacity,strokeWeight:weight,zIndex:count,clickable:false});});
      airportFlights.forEach((items,code)=>{const a=AIRPORTS[code],scale=items.length>=10?7:items.length>=2?5:3.5;const marker=new maps.Marker({map,position:{lat:a.lat,lng:a.lng},title:`${code} · ${a.city}`,icon:{path:maps.SymbolPath.CIRCLE,scale,fillColor:routeColor,fillOpacity:1,strokeColor:'#ffffff',strokeWeight:1.4}});marker.addListener('click',()=>{info.setContent(`<div class="flight-popup"><strong>${code} · ${a.city}</strong><span>${a.name}</span><span>${items.length} flight touchpoint${items.length===1?'':'s'}</span></div>`);info.open({map,anchor:marker});});bounds.extend({lat:a.lat,lng:a.lng});});
      map.fitBounds(bounds,42);
      setMapError('');
    })().catch(error=>{if(!disposed)setMapError(error instanceof Error?error.message:'Google Maps failed to load');});
    return()=>{disposed=true;mapRef.current=null;};
  },[visible,mapTheme]);

  const fitRoutes=()=>{const maps=(window as MapsWindow).google?.maps;if(!maps||!mapRef.current)return;const bounds=new maps.LatLngBounds();analytics.airportTouches.forEach(([code])=>bounds.extend({lat:AIRPORTS[code].lat,lng:AIRPORTS[code].lng}));mapRef.current.fitBounds(bounds,42);};
  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row gap-3">
      <label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search airport, airline, flight…" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-10 outline-none focus:border-accent"/>{query&&<button onClick={()=>setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-label="Clear search"><X size={17}/></button>}</label>
      <select value={year} onChange={e=>setYear(e.target.value)} className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 outline-none focus:border-accent"><option value="all">All years</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select>
    </div>
    <div className="flight-map-shell relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl">
      <div ref={mapNode} className="flight-map"/>
      <div className="absolute left-4 top-4 z-[500] flex flex-wrap gap-2">
        <button onClick={fitRoutes} className="map-action"><LocateFixed size={16}/> Fit routes</button>
      </div>
      <div className="map-style-switch" aria-label="Map style">
        <MapStyleButton active={mapTheme==='light'} onClick={()=>chooseMapTheme('light')} icon={<MapIcon size={14}/>} label="Light"/>
        <MapStyleButton active={mapTheme==='dark'} onClick={()=>chooseMapTheme('dark')} icon={<Moon size={14}/>} label="Dark"/>
        <MapStyleButton active={mapTheme==='satellite'} onClick={()=>chooseMapTheme('satellite')} icon={<Satellite size={14}/>} label="Satellite"/>
      </div>
      {mapError&&<div className="absolute inset-0 z-[600] grid place-items-center bg-neutral-950/90 p-6 text-center text-white"><div><strong>Map unavailable</strong><p className="mt-2 text-sm text-neutral-300">{mapError}</p></div></div>}
      {!visible.length&&<div className="absolute inset-0 z-[450] grid place-items-center pointer-events-none"><span className="rounded-xl bg-neutral-950/80 px-4 py-3 text-white">No flights match these filters.</span></div>}
    </div>
    {/* <p className="text-xs text-neutral-500">Airport coordinates from OurAirports · Map powered by Google Maps.</p> */}

    <MyFlightRadarStats flights={visible} analytics={analytics} unit={unit} setUnit={setUnit}/>
  </div>;
}

function MapStyleButton({active,onClick,icon,label}:{active:boolean,onClick:()=>void,icon:React.ReactNode,label:string}){return <button onClick={onClick} className={active?'active':''}>{icon}<span>{label}</span></button>}
function formatDistance(km:number,unit:'km'|'mi'){return Math.round(unit==='km'?km:km*.621371).toLocaleString()}

function MyFlightRadarStats({flights,analytics,unit,setUnit}:{flights:FlightRecord[],analytics:FlightAnalytics,unit:'km'|'mi',setUnit:(u:'km'|'mi')=>void}){
  const hours=analytics.distance/730+flights.length*.68;
  const[rotationPhase,setRotationPhase]=useState(0);
  useEffect(()=>{const update=()=>setRotationPhase(Math.floor(Date.now()/5000));update();const timer=window.setInterval(update,250);return()=>window.clearInterval(timer);},[]);
  const distanceAlt=rotationPhase%2,timeAlt=rotationPhase%4;
  const[chartMetric,setChartMetric]=useState<'flights'|'distance'>('flights');
  const ordered=[...flights].sort((a,b)=>distanceKm(a)-distanceKm(b)),shortest=ordered[0];
  const distanceAlternatives=shortest?[`${(analytics.distance/384400).toFixed(2)}× to the Moon`,`${(analytics.distance/149597870).toFixed(5)}× to the Sun`]:['',''];
  const timeAlternatives=[[`${(hours/24).toFixed(1)} days`,`${(hours/168).toFixed(1)} weeks`],[`${(hours/730).toFixed(2)} months`,`${(hours/8760).toFixed(3)} years`]];
  return <section className="fr24-stats space-y-5">
    <div className="fr24-toolbar"><h2>Flight statistics</h2><div className="global-unit"><span>Units</span><div className="stats-unit-switch"><button onClick={()=>setUnit('mi')} className={unit==='mi'?'active':''}>mi</button><button onClick={()=>setUnit('km')} className={unit==='km'?'active':''}>km</button></div></div></div>
    <div className="fr24-summary-grid">
      <SummaryBlock value={flights.length.toLocaleString()} label="flights"><span>{analytics.domestic} domestic</span><span>{analytics.international} international</span></SummaryBlock>
      <SummaryBlock value={formatDistance(analytics.distance,unit)} label={unit.toUpperCase()}><span>{(analytics.distance/40075).toFixed(1)}× around Earth</span><span key={distanceAlt} className="rotating-stat">{distanceAlternatives[distanceAlt]}</span></SummaryBlock>
      <SummaryBlock value={`${Math.floor(hours)} h ${Math.round((hours%1)*60)} min`} label="flight time"><span key={timeAlt%2} className="rotating-stat rotating-pair"><span>{timeAlternatives[timeAlt%2][0]}</span><span>{timeAlternatives[timeAlt%2][1]}</span></span></SummaryBlock>
    </div>
    {/* <div className="fr24-ranking-header"><h2>Flight history rankings</h2></div> */}
    <div className="fr24-rank-grid"><Ranking title="Top airports" flightRows={analytics.airportTouches} distanceRows={analytics.byDistance.airports} total={`${analytics.airportTouches.length} total airports`} unit={unit} airports/><Ranking title="Top airlines" flightRows={analytics.airlines} distanceRows={analytics.byDistance.airlines} total={`${analytics.airlines.length} total airlines`} unit={unit} airlines/><Ranking title="Top aircraft" flightRows={analytics.aircraft} distanceRows={analytics.byDistance.aircraft} total={`${analytics.aircraft.length} total aircraft`} unit={unit} aircraft/><Ranking title="Top routes" flightRows={analytics.routes} distanceRows={analytics.byDistance.routes} total={`${analytics.routes.length} total routes`} unit={unit}/><ExtremeFlightRanking title="Longest flights" flights={[...ordered].reverse()} unit={unit}/><ExtremeFlightRanking title="Shortest flights" flights={ordered} unit={unit}/><Ranking title="Top countries & regions" flightRows={analytics.countryTouches} distanceRows={analytics.byDistance.countries} total={`${analytics.countries} total regions`} unit={unit} countries/></div>
    <div className="fr24-chart-grid"><MiniChart title="Flights per year" flightRows={analytics.yearCounts} distanceRows={analytics.yearDistance} unit={unit} metric={chartMetric} setMetric={setChartMetric}/><MiniChart title="Flights per month" flightRows={analytics.monthCounts} distanceRows={analytics.monthDistance} unit={unit} metric={chartMetric} setMetric={setChartMetric}/><MiniChart title="Flights per weekday" flightRows={analytics.dayCounts} distanceRows={analytics.dayDistance} unit={unit} metric={chartMetric} setMetric={setChartMetric}/></div>
    {/* <p className="stats-methodology">Distance is calculated from great-circle airport coordinates. Flight duration is estimated from route distance and is not measured data supplied by Flighty.</p> */}
  </section>;
}
function SummaryBlock({value,label,children}:{value:string,label:string,children:React.ReactNode}){return <article className="fr24-summary"><div className="fr24-summary-top"><div><strong>{value}</strong><span>{label}</span></div></div><div className="fr24-equivalents">{children}</div></article>}
function Ranking({title,flightRows,distanceRows,total,unit,airlines=false,aircraft=false,countries=false,airports=false}:{title:string,flightRows:[string,number][],distanceRows:[string,number][],total:string,unit:'km'|'mi',airlines?:boolean,aircraft?:boolean,countries?:boolean,airports?:boolean}){const[metric,setMetric]=useState<'flights'|'distance'>('flights'),rows=(metric==='flights'?flightRows:distanceRows).slice(0,9),max=rows[0]?.[1]||1,[totalNumber,...totalWords]=total.split(' ');return <article className="fr24-panel ranking-panel"><PanelHeader title={title} metric={metric} setMetric={setMetric} stacked/><div className="rank-list">{rows.map(([name,value])=><div key={name}>{airlines?<AirlineLabel code={name}/>:countries?<span title={name}>{countryFlag(name)} {name}</span>:airports?<span title={AIRPORTS[name]?.name}>{countryFlag(AIRPORTS[name]?.country||'')} {name}</span>:aircraft?<span title={name}>{aircraftAbbreviation(name)}</span>:<span>{name}</span>}<i><b style={{width:`${value/max*100}%`}}/></i><strong>{metric==='distance'?`${formatDistance(value,unit)} ${unit}`:Math.round(value)}</strong></div>)}</div><footer><strong>{totalNumber}</strong><span>{totalWords.join(' ')}</span></footer></article>}
function AirlineLabel({code}:{code:string}){
  const info=Object.values(AIRLINES).find(a=>a.iata===code)||{iata:code,name:code};
  return <span className="airline-label" title={`${info.name} (${info.iata})`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`https://images.kiwi.com/airlines/64/${info.iata}.png`} alt={info.name}/><span>{info.iata}</span>
  </span>;
}
function ExtremeFlightRanking({title,flights,unit}:{title:string,flights:FlightRecord[],unit:'km'|'mi'}){const unique=[...new Map(flights.map(f=>[[f.from,f.to].sort().join('–'),f])).values()];return <article className="fr24-panel ranking-panel extreme-ranking"><RankingTitle title={title}/><div className="extreme-list">{unique.slice(0,9).map((flight,index)=>{const from=AIRPORTS[flight.from],to=AIRPORTS[flight.to];return <div key={`${flight.from}-${flight.to}-${index}`} title={`${from.city} to ${to.city} · ${formatDuration(estimatedDuration(flight))}`}><span>{countryFlag(from.country)} {flight.from}–{flight.to} {countryFlag(to.country)}</span><strong>{formatDistance(distanceKm(flight),unit)} {unit}</strong></div>})}</div><footer><strong>{unique.length}</strong><span>unique routes</span></footer></article>}
function RankingTitle({title}:{title:string}){const lines=title==='Top countries & regions'?['Top','Countries & regions']:[title.split(' ')[0],title.split(' ').slice(1).join(' ')];return <h3 className="ranking-title"><span>{lines[0]}</span><span>{lines[1]}</span></h3>}
function PanelHeader({title,metric,setMetric,stacked=false}:{title:string,metric:'flights'|'distance',setMetric:(m:'flights'|'distance')=>void,stacked?:boolean}){return <div className="panel-header">{stacked?<RankingTitle title={title}/>:<h3>{title}</h3>}<div className="panel-switch"><button className={metric==='flights'?'active':''} onClick={()=>setMetric('flights')}>Flights</button><button className={metric==='distance'?'active':''} onClick={()=>setMetric('distance')}>Distance</button></div></div>}
function MiniChart({title,flightRows,distanceRows,unit,metric,setMetric}:{title:string,flightRows:[string,number][],distanceRows:[string,number][],unit:'km'|'mi',metric:'flights'|'distance',setMetric:(metric:'flights'|'distance')=>void}){
  const rows=metric==='flights'?flightRows:distanceRows;
  const max=Math.max(1,...rows.map(r=>r[1]));
  return <article className="fr24-panel fr24-chart"><PanelHeader title={title} metric={metric} setMetric={setMetric}/><div className="mini-bars">{rows.map(([label,value])=>{const shown=metric==='distance'?formatCompactDistance(value,unit):String(Math.round(value));return <div key={label} className="bar-cell"><strong>{shown}</strong><div className="bar-track"><span style={{height:`${Math.max(3,value/max*100)}%`}}/></div><small>{label}</small></div>})}</div></article>;
}
function formatCompactDistance(km:number,unit:'km'|'mi'){const value=unit==='km'?km:km*.621371;return value>=1000?`${(value/1000).toFixed(value>=10000?0:1)}k`:Math.round(value).toString()}
