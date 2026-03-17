import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Map as MapIcon, Filter, Loader2, X, Navigation, Fuel, AlertCircle, Check, TrendingDown, TrendingUp, BarChart3, ChevronDown } from 'lucide-react';

// ==========================================
// CONSTANTS & MAPPINGS
// ==========================================
const PROVINCE_TO_REGION = {
  'AG': 'Sicilia', 'AL': 'Piemonte', 'AN': 'Marche', 'AO': 'Valle d\'Aosta', 'AQ': 'Abruzzo',
  'AR': 'Toscana', 'AP': 'Marche', 'AT': 'Piemonte', 'AV': 'Campania', 'BA': 'Puglia',
  'BT': 'Puglia', 'BL': 'Veneto', 'BN': 'Campania', 'BG': 'Lombardia', 'BI': 'Piemonte',
  'BO': 'Emilia-Romagna', 'BZ': 'Trentino-Alto Adige', 'BS': 'Lombardia', 'BR': 'Puglia',
  'CA': 'Sardegna', 'CL': 'Sicilia', 'CB': 'Molise', 'CI': 'Sardegna', 'CE': 'Campania',
  'CT': 'Sicilia', 'CZ': 'Calabria', 'CH': 'Abruzzo', 'CO': 'Lombardia', 'CS': 'Calabria',
  'CR': 'Lombardia', 'KR': 'Calabria', 'CN': 'Piemonte', 'EN': 'Sicilia', 'FM': 'Marche',
  'FE': 'Emilia-Romagna', 'FI': 'Toscana', 'FG': 'Puglia', 'FC': 'Emilia-Romagna', 'FR': 'Lazio',
  'GE': 'Liguria', 'GO': 'Friuli-Venezia Giulia', 'GR': 'Toscana', 'IM': 'Liguria', 'IS': 'Molise',
  'SP': 'Liguria', 'LT': 'Lazio', 'LE': 'Puglia', 'LC': 'Lombardia', 'LI': 'Toscana', 'LO': 'Lombardia',
  'LU': 'Toscana', 'MC': 'Marche', 'MN': 'Lombardia', 'MS': 'Toscana', 'MT': 'Basilicata',
  'VS': 'Sardegna', 'ME': 'Sicilia', 'MI': 'Lombardia', 'MO': 'Emilia-Romagna', 'MB': 'Lombardia',
  'NA': 'Campania', 'NO': 'Piemonte', 'NU': 'Sardegna', 'OG': 'Sardegna', 'OT': 'Sardegna',
  'OR': 'Sardegna', 'PD': 'Veneto', 'PA': 'Sicilia', 'PR': 'Emilia-Romagna', 'PV': 'Lombardia',
  'PG': 'Umbria', 'PU': 'Marche', 'PE': 'Abruzzo', 'PC': 'Emilia-Romagna', 'PI': 'Toscana',
  'PT': 'Toscana', 'PN': 'Friuli-Venezia Giulia', 'PZ': 'Basilicata', 'PO': 'Toscana', 'RG': 'Sicilia',
  'RA': 'Emilia-Romagna', 'RC': 'Calabria', 'RE': 'Emilia-Romagna', 'RI': 'Lazio', 'RN': 'Emilia-Romagna',
  'RM': 'Lazio', 'RO': 'Veneto', 'SA': 'Campania', 'SS': 'Sardegna', 'SV': 'Liguria',
  'SI': 'Toscana', 'SR': 'Sicilia', 'SO': 'Lombardia', 'TA': 'Puglia', 'TE': 'Abruzzo',
  'TR': 'Umbria', 'TO': 'Piemonte', 'TP': 'Sicilia', 'TN': 'Trentino-Alto Adige', 'TV': 'Veneto',
  'TS': 'Friuli-Venezia Giulia', 'UD': 'Friuli-Venezia Giulia', 'VA': 'Lombardia', 'VE': 'Veneto',
  'VB': 'Piemonte', 'VC': 'Piemonte', 'VR': 'Veneto', 'VV': 'Calabria', 'VI': 'Veneto', 'VT': 'Lazio'
};

const FALLBACK_STATIONS = [
  { id: '1', name: 'Distributore Roma Centro', brand: 'Eni', type: 'Stradale', address: 'Via Roma 1', city: 'Roma', province: 'RM', lat: 41.9028, lng: 12.4964, prices: { 'Benzina_1': { isSelf: 1, price: 1.750 }, 'Gasolio_1': { isSelf: 1, price: 1.650 } } },
  { id: '2', name: 'Q8 Milano Fiera', brand: 'Q8', type: 'Stradale', address: 'Viale Fiera 10', city: 'Milano', province: 'MI', lat: 45.4642, lng: 9.1900, prices: { 'Benzina_1': { isSelf: 1, price: 1.820 }, 'GPL_0': { isSelf: 0, price: 0.750 } } },
  { id: '3', name: 'IP Napoli Ovest', brand: 'IP', type: 'Stradale', address: 'Corso Napoli 5', city: 'Napoli', province: 'NA', lat: 40.8518, lng: 14.2681, prices: { 'Benzina_1': { isSelf: 1, price: 1.710 } } },
  { id: '4', name: 'Esso Firenze Sud', brand: 'Esso', type: 'Stradale', address: 'Piazza Firenze 2', city: 'Firenze', province: 'FI', lat: 43.7696, lng: 11.2558, prices: { 'Benzina_1': { isSelf: 1, price: 1.780 }, 'Gasolio_1': { isSelf: 1, price: 1.680 } } },
  { id: '5', name: 'Tamoil Torino Nord', brand: 'Tamoil', type: 'Stradale', address: 'Via Torino 20', city: 'Torino', province: 'TO', lat: 45.0703, lng: 7.6868, prices: { 'Benzina_1': { isSelf: 1, price: 1.740 } } },
  { id: '6', name: 'Conad Palermo Est', brand: 'Conad', type: 'Stradale', address: 'Via Palermo 8', city: 'Palermo', province: 'PA', lat: 38.1157, lng: 13.3615, prices: { 'Benzina_1': { isSelf: 1, price: 1.690 }, 'Metano_0': { isSelf: 0, price: 1.100 } } },
  { id: '7', name: 'Rete Indipendente Bari', brand: 'Indipendente', type: 'Stradale', address: 'Viale Bari 1', city: 'Bari', province: 'BA', lat: 41.1171, lng: 16.8719, prices: { 'Benzina_1': { isSelf: 1, price: 1.650 } } },
  { id: '8', name: 'Eni Bologna', brand: 'Eni', type: 'Stradale', address: 'Via Bologna 3', city: 'Bologna', province: 'BO', lat: 44.4949, lng: 11.3426, prices: { 'Benzina_1': { isSelf: 1, price: 1.760 }, 'Gasolio_1': { isSelf: 1, price: 1.660 } } },
  { id: '9', name: 'Q8 Genova', brand: 'Q8', type: 'Stradale', address: 'Corso Genova 15', city: 'Genova', province: 'GE', lat: 44.4056, lng: 8.9463, prices: { 'Benzina_1': { isSelf: 1, price: 1.790 }, 'GPL_0': { isSelf: 0, price: 0.720 } } },
  { id: '10', name: 'IP Venezia', brand: 'IP', type: 'Stradale', address: 'Via Venezia 4', city: 'Venezia', province: 'VE', lat: 45.4408, lng: 12.3155, prices: { 'Benzina_1': { isSelf: 1, price: 1.830 } } }
];

const PROXY_LIST = [
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];
const ANAGRAFICA_URL = 'https://www.mimit.gov.it/images/exportCSV/anagrafica_impianti_attivi.csv';
const PREZZI_URL = 'https://www.mimit.gov.it/images/exportCSV/prezzo_alle_8.csv';
const FUEL_COLORS = { 'Benzina': '#6366f1', 'Gasolio': '#f59e0b', 'GPL': '#10b981', 'Metano': '#3b82f6', 'GNL': '#8b5cf6' };
const getFuelColor = (ft) => FUEL_COLORS[ft] || '#64748b';

// ==========================================
// UTILITY
// ==========================================
const fetchWithProxy = async (targetUrl) => {
  for (let proxy of PROXY_LIST) {
    try {
      const r = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`);
      if (r.ok) return await r.text();
    } catch (e) { console.warn(`Proxy ${proxy} failed`); }
  }
  throw new Error('All proxies failed');
};
const parseCSV = (csvText, config) =>
  new Promise((resolve, reject) => {
    if (window.Papa) window.Papa.parse(csvText, { ...config, complete: resolve, error: reject });
    else reject(new Error("PapaParse not loaded"));
  });
const formatDelta = (delta) => {
  const m = Math.round(delta * 1000);
  return `${m >= 0 ? '+' : ''}${m}`;
};

// ==========================================
// COLLAPSIBLE PANEL COMPONENT
// ==========================================
function CollapsiblePanel({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t border-slate-100">{children}</div>}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Inizializzazione...');
  const [stations, setStations] = useState([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [showSelf, setShowSelf] = useState(true);
  const [showServito, setShowServito] = useState(true);
  const [maxPrice, setMaxPrice] = useState(2.000);
  const [filterRegion, setFilterRegion] = useState('Tutte');
  const [filterProvince, setFilterProvince] = useState('Tutte');
  const [filterCity, setFilterCity] = useState('Tutte');
  const [mapBounds, setMapBounds] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Load deps
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!document.querySelector('#leaflet-css')) {
        const l = document.createElement('link'); l.id = 'leaflet-css'; l.rel = 'stylesheet';
        l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l);
      }
      const ls = (src) => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.body.appendChild(s); });
      if (!window.Papa) await ls('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js');
      if (!window.L) await ls('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
      if (isMounted) initDataFetching();
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const initDataFetching = async () => {
    try {
      setLoadingMsg('Scaricamento anagrafica impianti...');
      const anagraficaText = await fetchWithProxy(ANAGRAFICA_URL);
      setLoadingMsg('Scaricamento prezzi carburanti...');
      const prezziText = await fetchWithProxy(PREZZI_URL);
      setLoadingMsg('Elaborazione dei dati...');
      const csvOpts = { header: true, delimiter: '|', skipEmptyLines: true, comments: 'Estrazione' };
      const parsedA = await parseCSV(anagraficaText, csvOpts);
      const parsedP = await parseCSV(prezziText, csvOpts);
      const MIN_VALID = 0.500, MAX_VALID = 5.000;
      const pricesMap = {};
      parsedP.data.forEach(row => {
        if (!row.idImpianto || !row.descCarburante || !row.prezzo) return;
        const id = row.idImpianto.trim(), fuel = row.descCarburante.trim(), price = parseFloat(row.prezzo), self = parseInt(row.isSelf);
        if (isNaN(price) || price < MIN_VALID || price > MAX_VALID) return;
        if (!pricesMap[id]) pricesMap[id] = {};
        const key = `${fuel}_${self}`;
        if (!pricesMap[id][key] || price < pricesMap[id][key].price) pricesMap[id][key] = { isSelf: self, price, type: fuel };
      });
      const merged = [];
      parsedA.data.forEach(row => {
        if (!row.idImpianto || !row.Latitudine || !row.Longitudine || !row.Provincia) return;
        const id = row.idImpianto.trim();
        if (!pricesMap[id]) return;
        let lat = parseFloat(row.Latitudine), lng = parseFloat(row.Longitudine);
        if (isNaN(lat) || isNaN(lng) || lat < 35 || lat > 48 || lng < 6 || lng > 19) return;
        merged.push({ id, name: row['Nome Impianto'] || row.Gestore, brand: row.Bandiera, type: row['Tipo Impianto'], address: row.Indirizzo, city: row.Comune, province: row.Provincia.toUpperCase(), lat, lng, prices: pricesMap[id] });
      });
      setStations(merged); setDataLoaded(true);
    } catch (e) {
      console.error(e); setUsedFallback(true); setStations(FALLBACK_STATIONS); setDataLoaded(true);
    }
  };

  // Filter
  const globalFilteredStations = useMemo(() => {
    if (!stations.length || (!showSelf && !showServito)) return [];
    return stations.filter(s => {
      const region = PROVINCE_TO_REGION[s.province] || 'Ignota';
      if (filterRegion !== 'Tutte' && region !== filterRegion) return false;
      if (filterProvince !== 'Tutte' && s.province !== filterProvince) return false;
      if (filterCity !== 'Tutte' && s.city !== filterCity) return false;
      let minP = Infinity, minFuel = '';
      Object.keys(s.prices).forEach(k => {
        const p = s.prices[k];
        if (((p.isSelf === 1 && showSelf) || (p.isSelf === 0 && showServito)) && p.price >= 0.500 && p.price < minP) {
          minP = p.price; minFuel = p.type;
        }
      });
      if (minP === Infinity || minP > maxPrice) return false;
      s.activePrice = minP; s.activeFuelType = minFuel; return true;
    });
  }, [stations, showSelf, showServito, maxPrice, filterRegion, filterProvince, filterCity]);

  const geoData = useMemo(() => {
    const regions = new Set(), provinces = new Set(), cities = new Set();
    stations.forEach(s => { const r = PROVINCE_TO_REGION[s.province]; if (r) { regions.add(r); if (filterRegion === 'Tutte' || filterRegion === r) { provinces.add(s.province); if (filterProvince === 'Tutte' || filterProvince === s.province) cities.add(s.city); } } });
    return { regions: [...regions].sort(), provinces: [...provinces].sort(), cities: [...cities].sort() };
  }, [stations, filterRegion, filterProvince]);

  // Map init
  useEffect(() => {
    if (!dataLoaded || !window.L) return;
    if (!mapRef.current) {
      mapRef.current = window.L.map('map', { zoomControl: false }).setView([41.8719, 12.5674], 6);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB', maxZoom: 19 }).addTo(mapRef.current);
      window.L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
      mapRef.current.on('moveend', () => setMapBounds(mapRef.current.getBounds()));
      setMapBounds(mapRef.current.getBounds());
    }
  }, [dataLoaded]);

  // Visible in viewport
  const visibleStations = useMemo(() => {
    if (!mapBounds) return [];
    let inView = globalFilteredStations.filter(s => mapBounds.contains(window.L.latLng(s.lat, s.lng)));
    inView.sort((a, b) => a.activePrice - b.activePrice);
    return inView;
  }, [globalFilteredStations, mapBounds]);

  // Per-fuel stats
  const fuelStats = useMemo(() => {
    const data = {};
    visibleStations.forEach(s => {
      Object.keys(s.prices).forEach(k => {
        const p = s.prices[k];
        if (((p.isSelf === 1 && showSelf) || (p.isSelf === 0 && showServito)) && p.price >= 0.500) {
          if (!data[p.type]) data[p.type] = { sum: 0, count: 0, min: Infinity, max: -Infinity };
          data[p.type].sum += p.price; data[p.type].count++;
          if (p.price < data[p.type].min) data[p.type].min = p.price;
          if (p.price > data[p.type].max) data[p.type].max = p.price;
        }
      });
    });
    const result = {};
    Object.keys(data).forEach(t => { const d = data[t]; result[t] = { avg: d.sum / d.count, min: d.min, max: d.max, count: d.count }; });
    return result;
  }, [visibleStations, showSelf, showServito]);

  const fuelAverages = useMemo(() => {
    const avgs = {};
    Object.keys(fuelStats).forEach(t => { avgs[t] = fuelStats[t].avg; });
    return avgs;
  }, [fuelStats]);

  const sortedFuelTypes = useMemo(() => {
    return Object.keys(fuelStats).sort((a, b) => {
      const order = ['Benzina', 'Gasolio', 'GPL', 'Metano', 'GNL'];
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [fuelStats]);

  // Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    const render = visibleStations.slice(0, 300);
    render.forEach((station, i) => {
      const isCheapest = i === 0;
      const fuelAvg = fuelAverages[station.activeFuelType] || 0;
      const delta = fuelAvg > 0 ? station.activePrice - fuelAvg : 0;
      const isBelow = delta < 0;
      const deltaLabel = fuelAvg > 0 ? formatDelta(delta) : '—';
      const fuelsHtml = Object.keys(station.prices)
        .filter(k => (station.prices[k].isSelf === 1 && showSelf) || (station.prices[k].isSelf === 0 && showServito))
        .sort().map(k => {
          const p = station.prices[k];
          const badge = p.isSelf === 1
            ? '<span style="font-size:9px;padding:1px 4px;background:#dbeafe;color:#2563eb;border-radius:4px;margin-left:4px">Self</span>'
            : '<span style="font-size:9px;padding:1px 4px;background:#ede9fe;color:#7c3aed;border-radius:4px;margin-left:4px">Serv</span>';
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid #f1f5f9"><div style="display:flex;align-items:center"><span style="color:#475569;font-size:12px;font-weight:500">${p.type}</span>${badge}</div><span style="color:#0f172a;font-weight:800;font-size:12px">€${p.price.toFixed(3)}</span></div>`;
        }).join('');
      const dotColor = isCheapest ? '#10b981' : (isBelow ? '#3b82f6' : '#6366f1');
      const dotSz = isCheapest ? 18 : 14, ringSz = isCheapest ? 28 : 22;
      const iconHtml = `<div style="position:relative;display:flex;justify-content:center;align-items:center;width:40px;height:40px;cursor:pointer;z-index:10" onmouseover="this.querySelector('.tt').style.display='flex'" onmouseout="this.querySelector('.tt').style.display='none'"><div style="width:${ringSz}px;height:${ringSz}px;border-radius:50%;background:${dotColor}18;display:flex;align-items:center;justify-content:center"><div style="width:${dotSz}px;height:${dotSz}px;border-radius:50%;background:${dotColor};border:2.5px solid white;box-shadow:0 1px 8px ${dotColor}50"></div></div><div class="tt" style="display:none;flex-direction:column;position:absolute;bottom:32px;left:50%;transform:translateX(-50%);background:white;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;min-width:210px;z-index:999;box-shadow:0 12px 40px rgba(0,0,0,0.12)"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #f1f5f9;padding-bottom:6px;margin-bottom:6px"><span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#64748b">${station.brand}</span><span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:6px;background:${isBelow ? '#d1fae5' : '#fef3c7'};color:${isBelow ? '#059669' : '#d97706'}">${deltaLabel} ${station.activeFuelType}</span></div>${fuelsHtml}</div></div>`;
      const icon = window.L.divIcon({ html: iconHtml, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });
      const marker = window.L.marker([station.lat, station.lng], { icon }).addTo(map);
      marker.on('click', () => setSelectedStation(station));
      markersRef.current.push(marker);
    });
  }, [visibleStations, showSelf, showServito, fuelAverages]);

  const handleRegionChange = (e) => { setFilterRegion(e.target.value); setFilterProvince('Tutte'); setFilterCity('Tutte'); };
  const handleStationClick = (station) => {
    setSelectedStation(station);
    if (mapRef.current) mapRef.current.flyTo([station.lat, station.lng], 16, { animate: true, duration: 1.5 });
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (!dataLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <div className="mb-6 relative">
          <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/25">
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="12" width="22" height="30" rx="4" fill="white" opacity="0.95"/>
              <path d="M36 20 L46 14 L46 28 L40 25 L40 20" fill="white" opacity="0.8"/>
              <rect x="19" y="17" width="12" height="8" rx="2" fill="white" opacity="0.4"/>
              <path d="M34 38 L52 52" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <path d="M44 52 L52 52 L52 44" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">CostaMeno</h1>
        <div className="flex items-center space-x-3 mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-sm font-semibold text-slate-500 tracking-tight">{loadingMsg}</span>
        </div>
      </div>
    );
  }

  const listStations = visibleStations.slice(0, 300);

  // Chart helpers
  const chartData = sortedFuelTypes.length > 0 ? (() => {
    const gMin = Math.min(...sortedFuelTypes.map(ft => fuelStats[ft].min));
    const gMax = Math.max(...sortedFuelTypes.map(ft => fuelStats[ft].max));
    const range = gMax - gMin || 0.1;
    return { gMin, gMax, range };
  })() : null;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-800">

      {/* HEADER */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 z-50 px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="12" width="22" height="30" rx="4" fill="white" opacity="0.95"/>
              <path d="M36 20 L46 14 L46 28 L40 25 L40 20" fill="white" opacity="0.8"/>
              <rect x="19" y="17" width="12" height="8" rx="2" fill="white" opacity="0.4"/>
              <path d="M34 38 L52 52" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <path d="M44 52 L52 52 L52 44" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
              Costa<span className="text-transparent bg-clip-text bg-indigo-600">Meno</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 hidden sm:block">Trova il pieno al miglior prezzo · Dati MIMIT</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {usedFallback && (
            <div className="flex items-center text-amber-600 font-semibold text-xs bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />Test
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR */}
        <aside className={`absolute md:relative z-40 bg-white w-full max-w-sm md:w-[400px] flex-shrink-0 flex flex-col h-full border-r border-slate-200 shadow-xl md:shadow-none transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 custom-scrollbar">

            {/* Filters */}
            <section className="space-y-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Filtra Distributori</h2>
              </div>

              {/* Mode */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Modalità</label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer select-none transition-all ${showSelf ? 'bg-indigo-50 border-indigo-400 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                    <input type="checkbox" className="sr-only" checked={showSelf} onChange={(e) => setShowSelf(e.target.checked)} />
                    <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors ${showSelf ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300'}`}>
                      {showSelf && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                    </div>
                    <span className="font-semibold text-sm">Self</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 cursor-pointer select-none transition-all ${showServito ? 'bg-violet-50 border-violet-400 text-violet-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                    <input type="checkbox" className="sr-only" checked={showServito} onChange={(e) => setShowServito(e.target.checked)} />
                    <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors ${showServito ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-300'}`}>
                      {showServito && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                    </div>
                    <span className="font-semibold text-sm">Servito</span>
                  </label>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prezzo Max</label>
                  <span className="font-extrabold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-sm tabular-nums border border-slate-200">€{maxPrice.toFixed(3)}</span>
                </div>
                <input type="range" min="1.300" max="2.500" step="0.010" value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-500" />
              </div>

              {/* Geo */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Zona</label>
                <select value={filterRegion} onChange={handleRegionChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm">
                  <option value="Tutte">Tutta Italia</option>
                  {geoData.regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <select value={filterProvince} onChange={(e) => { setFilterProvince(e.target.value); setFilterCity('Tutte'); }}
                    disabled={filterRegion === 'Tutte' || geoData.provinces.length <= 1}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm">
                    <option value="Tutte">Provincia</option>
                    {geoData.provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
                    disabled={filterProvince === 'Tutte' || geoData.cities.length <= 1}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm">
                    <option value="Tutte">Città</option>
                    {geoData.cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* ======= COLLAPSIBLE: Prezzi Medi ======= */}
            {sortedFuelTypes.length > 0 && (
              <CollapsiblePanel
                title="Prezzi Medi per Carburante"
                icon={<BarChart3 className="w-4 h-4 text-indigo-400" />}
                defaultOpen={false}
              >
                <div className="space-y-2 mt-2">
                  {sortedFuelTypes.map(ft => (
                    <div key={ft} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: getFuelColor(ft) }}></div>
                        <span className="text-[12px] font-bold text-slate-600">{ft}</span>
                        <span className="text-[10px] text-slate-400">({fuelStats[ft].count})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[14px] font-extrabold text-slate-800 tabular-nums">€{fuelStats[ft].avg.toFixed(3)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>
            )}

            {/* ======= COLLAPSIBLE: Distribuzione Prezzi ======= */}
            {sortedFuelTypes.length > 0 && chartData && (
              <CollapsiblePanel
                title="Distribuzione Prezzi in Zona"
                icon={<TrendingDown className="w-4 h-4 text-emerald-500" />}
                defaultOpen={false}
              >
                <div className="space-y-5 mt-2">
                  {sortedFuelTypes.map(ft => {
                    const stats = fuelStats[ft];
                    const chartW = 240;
                    const minPos = ((stats.min - chartData.gMin) / chartData.range) * chartW;
                    const maxPos = ((stats.max - chartData.gMin) / chartData.range) * chartW;
                    const avgPos = ((stats.avg - chartData.gMin) / chartData.range) * chartW;
                    const barW = Math.max(maxPos - minPos, 3);
                    const color = getFuelColor(ft);
                    return (
                      <div key={ft}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }}></div>
                            <span className="text-[12px] font-bold text-slate-700">{ft}</span>
                          </div>
                          <span className="text-[11px] font-extrabold text-slate-700 tabular-nums">media €{stats.avg.toFixed(3)}</span>
                        </div>
                        <svg width="100%" height="24" viewBox={`0 0 ${chartW} 24`} className="overflow-visible" preserveAspectRatio="xMidYMid meet">
                          <rect x="0" y="9" width={chartW} height="6" rx="3" fill="#e2e8f0" />
                          <rect x={minPos} y="7" width={barW} height="10" rx="5" fill={color} opacity="0.2" />
                          <line x1={avgPos} y1="4" x2={avgPos} y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx={minPos} cy="12" r="3" fill="white" stroke={color} strokeWidth="1.5" />
                          <circle cx={maxPos} cy="12" r="3" fill="white" stroke={color} strokeWidth="1.5" />
                        </svg>
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400 font-medium tabular-nums">€{stats.min.toFixed(3)}</span>
                          <span className="text-[10px] text-slate-400 font-medium tabular-nums">€{stats.max.toFixed(3)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsiblePanel>
            )}

            <div className="h-px bg-slate-100 shrink-0"></div>

            {/* Results */}
            <section className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <div className="relative flex h-2 w-2">
                    {listStations.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${listStations.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  </div>
                  <span>{listStations.length} distributori in zona</span>
                </div>
                {listStations.length === 300 && globalFilteredStations.length > 300 && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200" title={`${globalFilteredStations.length} totali`}>Max 300</span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pb-6 pr-1 custom-scrollbar">
                {listStations.length === 0 ? (
                  <div className="text-center p-6 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="font-medium text-sm">Nessuna stazione in quest'area.</p>
                    <p className="text-xs mt-1 opacity-60">Sposta la mappa o modifica i filtri.</p>
                  </div>
                ) : (
                  listStations.map((station, idx) => {
                    const isCheapest = idx === 0;
                    const fuelAvg = fuelAverages[station.activeFuelType] || 0;
                    const delta = fuelAvg > 0 ? station.activePrice - fuelAvg : 0;
                    const isBelow = delta < 0;
                    return (
                      <div key={`${station.id}-${idx}`}
                        className={`p-3.5 rounded-2xl cursor-pointer select-none transition-all duration-200 group relative overflow-hidden
                          ${isCheapest
                            ? 'bg-emerald-50 border-2 border-emerald-300 shadow-sm'
                            : 'bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm'}
                          ${selectedStation?.id === station.id && !isCheapest ? 'ring-2 ring-indigo-400 border-transparent' : ''}`}
                        onClick={() => handleStationClick(station)}>
                        {isCheapest && (
                          <div className="absolute top-0 right-0 bg-emerald-500 text-[9px] font-black text-white tracking-widest uppercase px-2.5 py-0.5 rounded-bl-xl">TOP</div>
                        )}
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">{station.brand}</span>
                            <h3 className={`font-bold text-sm leading-snug mt-0.5 ${isCheapest ? 'text-emerald-800' : 'text-slate-800'} line-clamp-1`}>{station.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 line-clamp-1">
                              <MapIcon className="w-3 h-3 shrink-0 opacity-60" /> {station.city} ({station.province})
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`font-extrabold text-lg tabular-nums ${isCheapest ? 'text-emerald-600' : 'text-slate-800'}`}>€{station.activePrice.toFixed(3)}</span>
                            {fuelAvg > 0 && (
                              <div className={`flex items-center justify-end gap-0.5 mt-0.5 text-[11px] font-bold ${isBelow ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {isBelow ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                <span className="tabular-nums">{formatDelta(delta)} {station.activeFuelType}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && <div className="absolute inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

        {/* OVERLAY CARD */}
        {selectedStation && (() => {
          const fuelAvg = fuelAverages[selectedStation.activeFuelType] || 0;
          const delta = fuelAvg > 0 ? selectedStation.activePrice - fuelAvg : 0;
          const isBelow = delta < 0;
          return (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] w-[calc(100%-2rem)] max-w-[400px] pointer-events-none md:ml-[200px]">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 pointer-events-auto relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedStation(null); }}
                  className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="pr-10">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{selectedStation.brand}</span>
                    {fuelAvg > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isBelow ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isBelow ? '↓' : '↑'} {formatDelta(delta)} vs media {selectedStation.activeFuelType}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">{selectedStation.name}</h3>
                  <p className="text-xs font-medium text-slate-400 flex items-start gap-1.5 mt-1 mb-4">
                    <MapIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{selectedStation.address}, {selectedStation.city} ({selectedStation.province})</span>
                  </p>
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Prezzi Disponibili</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
                      {Object.keys(selectedStation.prices)
                        .filter(k => (selectedStation.prices[k].isSelf === 1 && showSelf) || (selectedStation.prices[k].isSelf === 0 && showServito))
                        .sort()
                        .map(key => {
                          const p = selectedStation.prices[key];
                          const pAvg = fuelAverages[p.type];
                          const pDelta = pAvg ? p.price - pAvg : null;
                          return (
                            <div key={key} className="flex flex-col">
                              <span className="text-[11px] font-semibold text-slate-400">{p.type} <span className="opacity-60">({p.isSelf ? 'Self' : 'Serv'})</span></span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-extrabold text-sm text-slate-800 tabular-nums">€{p.price.toFixed(3)}</span>
                                {pDelta !== null && (
                                  <span className={`text-[9px] font-bold ${pDelta < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {pDelta < 0 ? '↓' : '↑'}{Math.abs(Math.round(pDelta * 1000))}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lng}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                      <Navigation className="w-4 h-4" /> Ottieni Indicazioni
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MAP */}
        <main className="flex-1 relative z-10 bg-slate-100">
          <div id="map" className="w-full h-full" />
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
      `}</style>
    </div>
  );
}
