export interface FlightRecord {
  date: string;
  airline: string;
  flight: string;
  from: string;
  to: string;
  aircraft: string;
  canceled: boolean;
  cabinClass: string;
  seatType: string;
  reason: string;
}

export interface AirportInfo {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

export const AIRPORTS: Record<string, AirportInfo> = {
  ANC:{name:'Ted Stevens Anchorage International Airport',city:'Anchorage',country:'US',lat:61.179004,lng:-149.992561},
  ATL:{name:'Hartsfield–Jackson Atlanta International Airport',city:'Atlanta',country:'US',lat:33.6367,lng:-84.428101},
  BGR:{name:'Bangor International Airport',city:'Bangor',country:'US',lat:44.806364,lng:-68.826668},
  BHR:{name:'Bharatpur Airport',city:'Bharatpur',country:'NP',lat:27.678101,lng:84.429398},
  BOS:{name:'Boston Logan International Airport',city:'Boston',country:'US',lat:42.36197,lng:-71.0079},
  BUF:{name:'Buffalo Niagara International Airport',city:'Buffalo',country:'US',lat:42.940498,lng:-78.732201},
  CAN:{name:'Guangzhou Baiyun International Airport',city:'Guangzhou',country:'CN',lat:23.392401,lng:113.299004},
  CJU:{name:'Jeju International Airport',city:'Jeju City',country:'KR',lat:33.512058,lng:126.492548},
  CKG:{name:'Chongqing Jiangbei International Airport',city:'Chongqing',country:'CN',lat:29.712254,lng:106.651895},
  CLT:{name:'Charlotte Douglas International Airport',city:'Charlotte',country:'US',lat:35.214001,lng:-80.9431},
  CSX:{name:'Changsha Huanghua International Airport',city:'Changsha',country:'CN',lat:28.189199,lng:113.220001},
  CTU:{name:'Chengdu Shuangliu International Airport',city:'Chengdu',country:'CN',lat:30.558257,lng:103.945966},
  DCA:{name:'Ronald Reagan Washington National Airport',city:'Washington',country:'US',lat:38.8521,lng:-77.037697},
  DEN:{name:'Denver International Airport',city:'Denver',country:'US',lat:39.860027,lng:-104.673792},
  DFW:{name:'Dallas Fort Worth International Airport',city:'Dallas–Fort Worth',country:'US',lat:32.896801,lng:-97.038002},
  DLC:{name:'Dalian Zhoushuizi International Airport',city:'Dalian',country:'CN',lat:38.965719,lng:121.538477},
  DOH:{name:'Hamad International Airport',city:'Doha',country:'QA',lat:25.273056,lng:51.608056},
  EWR:{name:'Newark Liberty International Airport',city:'Newark',country:'US',lat:40.6894,lng:-74.170545},
  FLL:{name:'Fort Lauderdale–Hollywood International Airport',city:'Fort Lauderdale',country:'US',lat:26.072599,lng:-80.152702},
  HKG:{name:'Hong Kong International Airport',city:'Hong Kong',country:'HK',lat:22.31184,lng:113.914862},
  HNL:{name:'Daniel K. Inouye International Airport',city:'Honolulu',country:'US',lat:21.318387,lng:-157.92567},
  ICN:{name:'Incheon International Airport',city:'Seoul',country:'KR',lat:37.469101,lng:126.450996},
  ITO:{name:'Hilo International Airport',city:'Hilo',country:'US',lat:19.72135,lng:-155.045428},
  JFK:{name:'John F. Kennedy International Airport',city:'New York',country:'US',lat:40.639447,lng:-73.779317},
  JJN:{name:'Quanzhou Jinjiang International Airport',city:'Quanzhou',country:'CN',lat:24.795855,lng:118.588599},
  KIX:{name:'Kansai International Airport',city:'Osaka',country:'JP',lat:34.427299,lng:135.244003},
  KMG:{name:'Kunming Changshui International Airport',city:'Kunming',country:'CN',lat:25.110313,lng:102.936743},
  KOA:{name:'Ellison Onizuka Kona International Airport',city:'Kailua-Kona',country:'US',lat:19.738783,lng:-156.045603},
  KTM:{name:'Tribhuvan International Airport',city:'Kathmandu',country:'NP',lat:27.6966,lng:85.3591},
  KWE:{name:'Guiyang Longdongbao International Airport',city:'Guiyang',country:'CN',lat:26.541805,lng:106.80402},
  LAS:{name:'Harry Reid International Airport',city:'Las Vegas',country:'US',lat:36.083361,lng:-115.151817},
  LAX:{name:'Los Angeles International Airport',city:'Los Angeles',country:'US',lat:33.942501,lng:-118.407997},
  LGA:{name:'LaGuardia Airport',city:'New York',country:'US',lat:40.777199,lng:-73.872597},
  LIH:{name:'Lihue Airport',city:'Lihue',country:'US',lat:21.974393,lng:-159.337146},
  LJG:{name:'Lijiang Sanyi International Airport',city:'Lijiang',country:'CN',lat:26.677483,lng:100.244944},
  LXA:{name:'Lhasa Gonggar International Airport',city:'Lhasa',country:'CN',lat:29.298001,lng:90.911951},
  MFM:{name:'Macau International Airport',city:'Macau',country:'MO',lat:22.149599,lng:113.592003},
  MIA:{name:'Miami International Airport',city:'Miami',country:'US',lat:25.796011,lng:-80.289751},
  MSP:{name:'Minneapolis–Saint Paul International Airport',city:'Minneapolis',country:'US',lat:44.880081,lng:-93.221741},
  NKG:{name:'Nanjing Lukou International Airport',city:'Nanjing',country:'CN',lat:31.735032,lng:118.865949},
  NNG:{name:'Nanning Wuxu International Airport',city:'Nanning',country:'CN',lat:22.598071,lng:108.181922},
  OGG:{name:'Kahului International Airport',city:'Kahului',country:'US',lat:20.896263,lng:-156.431837},
  ORD:{name:"Chicago O'Hare International Airport",city:'Chicago',country:'US',lat:41.9786,lng:-87.9048},
  PEK:{name:'Beijing Capital International Airport',city:'Beijing',country:'CN',lat:40.077349,lng:116.596702},
  PHL:{name:'Philadelphia International Airport',city:'Philadelphia',country:'US',lat:39.871899,lng:-75.241096},
  PHX:{name:'Phoenix Sky Harbor International Airport',city:'Phoenix',country:'US',lat:33.435302,lng:-112.005905},
  PKR:{name:'Pokhara Domestic Airport',city:'Pokhara',country:'NP',lat:28.200621,lng:83.981203},
  PKX:{name:'Beijing Daxing International Airport',city:'Beijing',country:'CN',lat:39.501289,lng:116.413967},
  PVG:{name:'Shanghai Pudong International Airport',city:'Shanghai',country:'CN',lat:31.1434,lng:121.805},
  SAN:{name:'San Diego International Airport',city:'San Diego',country:'US',lat:32.733601,lng:-117.190002},
  SEA:{name:'Seattle–Tacoma International Airport',city:'Seattle',country:'US',lat:47.447943,lng:-122.310276},
  SFO:{name:'San Francisco International Airport',city:'San Francisco',country:'US',lat:37.619806,lng:-122.374821},
  SHA:{name:'Shanghai Hongqiao International Airport',city:'Shanghai',country:'CN',lat:31.198104,lng:121.33426},
  SLC:{name:'Salt Lake City International Airport',city:'Salt Lake City',country:'US',lat:40.78886,lng:-111.979866},
  SZX:{name:"Shenzhen Bao'an International Airport",city:'Shenzhen',country:'CN',lat:22.639474,lng:113.803262},
  TAE:{name:'Daegu International Airport',city:'Daegu',country:'KR',lat:35.894394,lng:128.656989},
  TAO:{name:'Qingdao Jiaodong International Airport',city:'Qingdao',country:'CN',lat:36.361953,lng:120.088171},
  TLH:{name:'Tallahassee International Airport',city:'Tallahassee',country:'US',lat:30.401209,lng:-84.35433},
  TPE:{name:'Taiwan Taoyuan International Airport',city:'Taoyuan',country:'TW',lat:25.0777,lng:121.233002},
  TSN:{name:'Tianjin Binhai International Airport',city:'Tianjin',country:'CN',lat:39.124401,lng:117.346001},
  TYN:{name:'Taiyuan Wusu International Airport',city:'Taiyuan',country:'CN',lat:37.746899,lng:112.627998},
  VCE:{name:'Venice Marco Polo Airport',city:'Venice',country:'IT',lat:45.505299,lng:12.3519},
  WUH:{name:'Wuhan Tianhe International Airport',city:'Wuhan',country:'CN',lat:30.774798,lng:114.213723},
  XIY:{name:"Xi'an Xianyang International Airport",city:"Xi'an",country:'CN',lat:34.442207,lng:108.762385},
  XMN:{name:'Xiamen Gaoqi International Airport',city:'Xiamen',country:'CN',lat:24.543889,lng:118.127454},
  XNN:{name:'Xining Caojiabao International Airport',city:'Xining',country:'CN',lat:36.52775,lng:102.040215},
  YNZ:{name:'Yancheng Nanyang International Airport',city:'Yancheng',country:'CN',lat:33.428317,lng:120.20545},
  YTY:{name:'Yangzhou Taizhou Airport',city:'Yangzhou',country:'CN',lat:32.5634,lng:119.7198},
  ZHA:{name:'Zhanjiang Wuchuan International Airport',city:'Zhanjiang',country:'CN',lat:21.481667,lng:110.590278},
  ZUH:{name:'Zhuhai Jinwan Airport',city:'Zhuhai',country:'CN',lat:22.006399,lng:113.375999},
};

export function parseFlightyCsv(csv: string): FlightRecord[] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      if (quoted && csv[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...data] = rows;
  const index = Object.fromEntries(headers.map((header, i) => [header.replace(/^\uFEFF/, ''), i]));
  return data.map((values) => ({
    date: values[index.Date] || '', airline: values[index.Airline] || '',
    flight: values[index.Flight] || '', from: values[index.From] || '', to: values[index.To] || '',
    aircraft: values[index['Aircraft Type Name']] || '', canceled: values[index.Canceled] === 'true',
    cabinClass: values[index['Cabin Class']] || 'Unspecified',
    seatType: values[index['Seat Type']] || 'Unspecified',
    reason: values[index['Flight Reason']] || 'Unspecified',
  })).filter((flight) => flight.from && flight.to && AIRPORTS[flight.from] && AIRPORTS[flight.to]);
}
