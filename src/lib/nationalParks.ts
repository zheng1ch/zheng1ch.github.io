export interface NationalPark {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  image: string;
  visited?: string;
  photos?: string[];
  offset?: [number, number];
  region?: 'alaska' | 'hawaii' | 'territory';
}

const img = (path: string) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}`;

const PARKS: NationalPark[] = [
  {id:'acad',name:'Acadia',state:'Maine',lat:44.35,lng:-68.21,visited:'2025-08-06',image:img('e/e9/Acadia_National_Park_02.JPG/250px-Acadia_National_Park_02.JPG')},
  {id:'arch',name:'Arches',state:'Utah',lat:38.68,lng:-109.57,offset:[-1.2,-1],image:img('f/f0/Delicate_arch_sunset.jpg/250px-Delicate_arch_sunset.jpg')},
  {id:'badl',name:'Badlands',state:'South Dakota',lat:43.75,lng:-102.5,image:img('b/b9/MK00609_Badlands.jpg/250px-MK00609_Badlands.jpg')},
  {id:'bibe',name:'Big Bend',state:'Texas',lat:29.25,lng:-103.25,image:img('f/f6/Canyon%2C_Rio_Grande%2C_Texas.jpeg/250px-Canyon%2C_Rio_Grande%2C_Texas.jpeg')},
  {id:'bisc',name:'Biscayne',state:'Florida',lat:25.65,lng:-80.08,visited:'2025-12-17',offset:[.5,0],image:img('4/48/Biscayne.JPG/250px-Biscayne.JPG')},
  {id:'blca',name:'Black Canyon of the Gunnison',state:'Colorado',lat:38.57,lng:-107.72,offset:[1.2,-.3],image:img('0/0b/Black_Canyon_and_Gunnison_River_2008.jpg/250px-Black_Canyon_and_Gunnison_River_2008.jpg')},
  {id:'brca',name:'Bryce Canyon',state:'Utah',lat:37.57,lng:-112.18,offset:[-1.4,.5],image:img('c/c3/Inspiration_Point_Bryce_Canyon_November_2018_panorama.jpg/250px-Inspiration_Point_Bryce_Canyon_November_2018_panorama.jpg')},
  {id:'cany',name:'Canyonlands',state:'Utah',lat:38.2,lng:-109.93,offset:[.7,1.1],image:img('9/99/Green_River_Overlook_Ekker_Butte.jpg/250px-Green_River_Overlook_Ekker_Butte.jpg')},
  {id:'care',name:'Capitol Reef',state:'Utah',lat:38.2,lng:-111.17,offset:[-.2,-1.5],image:img('1/1f/Capitol_Reef_National_Park.jpg/250px-Capitol_Reef_National_Park.jpg')},
  {id:'cave',name:'Carlsbad Caverns',state:'New Mexico',lat:32.17,lng:-104.44,offset:[.8,.4],image:img('d/dd/Carlsbad_Interior_Formations.jpg/250px-Carlsbad_Interior_Formations.jpg')},
  {id:'chis',name:'Channel Islands',state:'California',lat:34.01,lng:-119.42,offset:[-1.1,1],image:img('4/42/Channel_Islands_National_Park_by_Sentinel-2.jpg/250px-Channel_Islands_National_Park_by_Sentinel-2.jpg')},
  {id:'cong',name:'Congaree',state:'South Carolina',lat:33.79,lng:-80.78,image:img('4/4f/A548%2C_Congaree_National_Park%2C_South_Carolina%2C_USA%2C_2012.jpg/250px-A548%2C_Congaree_National_Park%2C_South_Carolina%2C_USA%2C_2012.jpg')},
  {id:'crla',name:'Crater Lake',state:'Oregon',lat:42.94,lng:-122.1,image:img('8/8d/Above_Crater_Lake_%28cropped%29.jpg/250px-Above_Crater_Lake_%28cropped%29.jpg')},
  {id:'cuva',name:'Cuyahoga Valley',state:'Ohio',lat:41.24,lng:-81.55,image:img('a/a4/Cuyahoga_Valley_National_Park_20.jpg/250px-Cuyahoga_Valley_National_Park_20.jpg')},
  {id:'deva',name:'Death Valley',state:'California / Nevada',lat:36.24,lng:-116.82,visited:'2025-11-20',offset:[-.5,-.7],image:img('8/87/Mesquite_Sand_Dunes_in_Death_Valley.jpg/250px-Mesquite_Sand_Dunes_in_Death_Valley.jpg')},
  {id:'dena',name:'Denali',state:'Alaska',lat:63.33,lng:-150.5,visited:'2023-07-01',region:'alaska',offset:[2,-1],image:img('c/c6/Every_Road-_Denali_%287945497984%29.jpg/250px-Every_Road-_Denali_%287945497984%29.jpg')},
  {id:'drto',name:'Dry Tortugas',state:'Florida',lat:24.63,lng:-82.87,offset:[-1.6,1],image:img('5/5f/Fort-Jefferson_Dry-Tortugas.jpg/250px-Fort-Jefferson_Dry-Tortugas.jpg')},
  {id:'ever',name:'Everglades',state:'Florida',lat:25.32,lng:-80.93,visited:'2025-06-23',offset:[-.8,1],image:img('2/2a/Sunset_over_the_River_of_Grass%2C_NPSphoto%2C_G.Gardner_%289255157507%29.jpg/250px-Sunset_over_the_River_of_Grass%2C_NPSphoto%2C_G.Gardner_%289255157507%29.jpg')},
  {id:'gaar',name:'Gates of the Arctic',state:'Alaska',lat:67.78,lng:-153.3,region:'alaska',offset:[-1,-2],image:img('f/fc/Remote_river_in_Gates_of_the_Arctic_%2816524035298%29.jpg/250px-Remote_river_in_Gates_of_the_Arctic_%2816524035298%29.jpg')},
  {id:'jeff',name:'Gateway Arch',state:'Missouri',lat:38.63,lng:-90.19,image:img('d/de/Gateway_Arch%2C_St._Louis.jpg/250px-Gateway_Arch%2C_St._Louis.jpg')},
  {id:'glac',name:'Glacier',state:'Montana',lat:48.68,lng:-113.8,image:img('5/51/Mountain_Goat_at_Hidden_Lake.jpg/250px-Mountain_Goat_at_Hidden_Lake.jpg')},
  {id:'glba',name:'Glacier Bay',state:'Alaska',lat:58.5,lng:-137,region:'alaska',offset:[4,1],image:img('b/bf/A045%2C_Glacier_Bay_National_Park%2C_Alaska%2C_USA%2C_Johns_Hopkins_Glacier%2C_2002.jpg/250px-A045%2C_Glacier_Bay_National_Park%2C_Alaska%2C_USA%2C_Johns_Hopkins_Glacier%2C_2002.jpg')},
  {id:'grca',name:'Grand Canyon',state:'Arizona',lat:36.06,lng:-112.14,visited:'2022-07-24',offset:[.2,-.8],image:img('a/aa/Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg/250px-Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg')},
  {id:'grte',name:'Grand Teton',state:'Wyoming',lat:43.79,lng:-110.68,visited:'2025-05-19',offset:[1,.8],image:img('d/d0/Barns_grand_tetons.jpg/250px-Barns_grand_tetons.jpg')},
  {id:'grba',name:'Great Basin',state:'Nevada',lat:38.98,lng:-114.3,offset:[-1.3,-.4],image:img('b/be/Prometheus_Wheeler.jpg/250px-Prometheus_Wheeler.jpg')},
  {id:'grsa',name:'Great Sand Dunes',state:'Colorado',lat:37.73,lng:-105.51,offset:[.8,.8],image:img('4/48/Great_Sand_Dunes_National_Park_and_Preserve%2C_United_States_%28Unsplash%29.jpg/250px-Great_Sand_Dunes_National_Park_and_Preserve%2C_United_States_%28Unsplash%29.jpg')},
  {id:'grsm',name:'Great Smoky Mountains',state:'North Carolina / Tennessee',lat:35.61,lng:-83.43,visited:'2024-11-27',image:img('b/bc/View_atop_Cliff_Tops_on_Mount_LeConte%2C_GSMNP%2C_TN.jpg/250px-View_atop_Cliff_Tops_on_Mount_LeConte%2C_GSMNP%2C_TN.jpg')},
  {id:'gumo',name:'Guadalupe Mountains',state:'Texas',lat:31.92,lng:-104.87,offset:[-1,-.8],image:img('8/8f/Guadalupe_Peak_from_Hunter_Peak.jpg/250px-Guadalupe_Peak_from_Hunter_Peak.jpg')},
  {id:'hale',name:'Haleakalā',state:'Hawaiʻi',lat:20.72,lng:-156.17,visited:'2026-04-15',region:'hawaii',offset:[2,-1],image:img('4/48/Haleakala_National_Park_02.jpg/250px-Haleakala_National_Park_02.jpg')},
  {id:'havo',name:'Hawaiʻi Volcanoes',state:'Hawaiʻi',lat:19.38,lng:-155.2,visited:'2026-04-20',region:'hawaii',offset:[4,1],image:img('8/89/P%C4%81hoehoe_and_Aa_flows_at_Hawaii.jpg/250px-P%C4%81hoehoe_and_Aa_flows_at_Hawaii.jpg')},
  {id:'hosp',name:'Hot Springs',state:'Arkansas',lat:34.51,lng:-93.05,image:img('a/a1/Steamy_Entrance_Springs_on_Cold_Night_in_Hot_Springs_National_Park.jpg/250px-Steamy_Entrance_Springs_on_Cold_Night_in_Hot_Springs_National_Park.jpg')},
  {id:'indu',name:'Indiana Dunes',state:'Indiana',lat:41.65,lng:-87.05,image:img('3/3d/Indiana_Dunes_National_Lakeshore%2C_Michigan_City%2C_Indiana%2C_Estados_Unidos%2C_2012-10-20%2C_DD_03.jpg/250px-Indiana_Dunes_National_Lakeshore%2C_Michigan_City%2C_Indiana%2C_Estados_Unidos%2C_2012-10-20%2C_DD_03.jpg')},
  {id:'isro',name:'Isle Royale',state:'Michigan',lat:48.1,lng:-88.55,image:img('8/88/Edisen_Fishery_at_IRNP.jpg/250px-Edisen_Fishery_at_IRNP.jpg')},
  {id:'jotr',name:'Joshua Tree',state:'California',lat:33.79,lng:-115.9,visited:'2022-12-12',offset:[.6,.8],image:img('f/f9/Joshua_Tree_-_Cyclops_%2B_Potato_Head_-_Sunrise.jpg/250px-Joshua_Tree_-_Cyclops_%2B_Potato_Head_-_Sunrise.jpg')},
  {id:'katm',name:'Katmai',state:'Alaska',lat:58.5,lng:-155,region:'alaska',offset:[-3,2],image:img('1/1e/Katmai_Crater_1980.jpg/250px-Katmai_Crater_1980.jpg')},
  {id:'kefj',name:'Kenai Fjords',state:'Alaska',lat:59.92,lng:-149.65,visited:'2023-06-28',region:'alaska',offset:[1,2],image:img('c/cd/Kenai_Fjords_coast.jpg/250px-Kenai_Fjords_coast.jpg')},
  {id:'kica',name:'Kings Canyon',state:'California',lat:36.8,lng:-118.55,offset:[.7,-.8],image:img('3/3a/KingsCanyonNP.JPG/250px-KingsCanyonNP.JPG')},
  {id:'kova',name:'Kobuk Valley',state:'Alaska',lat:67.55,lng:-159.28,region:'alaska',offset:[-4,-1],image:img('d/de/Kobuk_Bendlova_235.jpg/250px-Kobuk_Bendlova_235.jpg')},
  {id:'lacl',name:'Lake Clark',state:'Alaska',lat:60.97,lng:-153.42,region:'alaska',offset:[-2,1],image:img('a/ac/Lake_Clark_National_Park.jpg/250px-Lake_Clark_National_Park.jpg')},
  {id:'lavo',name:'Lassen Volcanic',state:'California',lat:40.49,lng:-121.51,image:img('f/ff/Lassen_Peak_and_Lake_Helen.jpg/250px-Lassen_Peak_and_Lake_Helen.jpg')},
  {id:'maca',name:'Mammoth Cave',state:'Kentucky',lat:37.18,lng:-86.1,image:img('7/70/Mammoth_Cave_Rotunda_%28USGS_Lwt02830%29.jpg/250px-Mammoth_Cave_Rotunda_%28USGS_Lwt02830%29.jpg')},
  {id:'meve',name:'Mesa Verde',state:'Colorado',lat:37.18,lng:-108.49,offset:[-.5,.7],image:img('8/83/Cliff_Palace-Colorado-Mesa_Verde_NP.jpg/250px-Cliff_Palace-Colorado-Mesa_Verde_NP.jpg')},
  {id:'mora',name:'Mount Rainier',state:'Washington',lat:46.85,lng:-121.75,visited:'2012-08-28',offset:[1,1],image:img('3/32/Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG/250px-Mount_Rainier_from_above_Myrtle_Falls_in_August.JPG')},
  {id:'npsa',name:'National Park of American Samoa',state:'American Samoa',lat:-14.25,lng:-170.68,region:'territory',offset:[-5,1],image:img('3/3c/Pola_Islands_Tutuila_NPS.jpg/250px-Pola_Islands_Tutuila_NPS.jpg')},
  {id:'neri',name:'New River Gorge',state:'West Virginia',lat:38.07,lng:-81.08,image:img('2/23/Grandview_Overlook%2C_New_River.jpg/250px-Grandview_Overlook%2C_New_River.jpg')},
  {id:'noca',name:'North Cascades',state:'Washington',lat:48.77,lng:-121.3,visited:'2026-07-19',photos:[
    '/parks/north-cascades/gallery/01-lake-overlook.webp',
    '/parks/north-cascades/gallery/02-boat.webp',
    '/parks/north-cascades/gallery/03-turquoise-water.webp',
    '/parks/north-cascades/gallery/04-swimmers.webp',
    '/parks/north-cascades/gallery/05-mountain-road.webp',
    '/parks/north-cascades/gallery/06-lake-stumps.webp',
  ],offset:[1.3,-.7],image:img('8/80/Cascade_Pass_and_Pelton_Basin.jpg/250px-Cascade_Pass_and_Pelton_Basin.jpg')},
  {id:'olym',name:'Olympic',state:'Washington',lat:47.8,lng:-123.6,visited:'2026-07-18',offset:[-1,0],image:img('a/a8/Cedar_Creek_Abbey_Island_Ruby_Beach.jpg/250px-Cedar_Creek_Abbey_Island_Ruby_Beach.jpg')},
  {id:'pefo',name:'Petrified Forest',state:'Arizona',lat:35.07,lng:-109.78,offset:[1,.7],image:img('5/51/Jasper_Forest_at_Petrified_Forest_NP_in_AZ_12.jpg/250px-Jasper_Forest_at_Petrified_Forest_NP_in_AZ_12.jpg')},
  {id:'pinn',name:'Pinnacles',state:'California',lat:36.48,lng:-121.16,offset:[-1,.5],image:img('4/44/Rock_formations_at_Pinnacles_National_Park.jpg/250px-Rock_formations_at_Pinnacles_National_Park.jpg')},
  {id:'redw',name:'Redwood',state:'California',lat:41.3,lng:-124,offset:[-1,0],image:img('d/de/Redwood_National_Park%2C_fog_in_the_forest.jpg/250px-Redwood_National_Park%2C_fog_in_the_forest.jpg')},
  {id:'romo',name:'Rocky Mountain',state:'Colorado',lat:40.4,lng:-105.58,image:img('3/3e/Rocky_Mountain_National_Park_in_September_2011_-_Glacier_Gorge_from_Bear_Lake.JPG/250px-Rocky_Mountain_National_Park_in_September_2011_-_Glacier_Gorge_from_Bear_Lake.JPG')},
  {id:'sagu',name:'Saguaro',state:'Arizona',lat:32.25,lng:-110.5,image:img('b/b4/Saguaro_Sunset.jpg/250px-Saguaro_Sunset.jpg')},
  {id:'seki',name:'Sequoia',state:'California',lat:36.43,lng:-118.68,offset:[-.5,.9],image:img('d/d0/General_Sherman_Tree_in_Sequoia_National_Park_-_June_2022.jpg/250px-General_Sherman_Tree_in_Sequoia_National_Park_-_June_2022.jpg')},
  {id:'shen',name:'Shenandoah',state:'Virginia',lat:38.53,lng:-78.35,image:img('1/10/Skyline_Drive_in_the_Fall_%2821852619608%29.jpg/250px-Skyline_Drive_in_the_Fall_%2821852619608%29.jpg')},
  {id:'thro',name:'Theodore Roosevelt',state:'North Dakota',lat:46.97,lng:-103.45,image:img('3/34/View_of_Theodore_Roosevelt_National_Park.jpg/250px-View_of_Theodore_Roosevelt_National_Park.jpg')},
  {id:'viis',name:'Virgin Islands',state:'U.S. Virgin Islands',lat:18.33,lng:-64.73,region:'territory',offset:[5,1],image:img('2/20/St_John_Trunk_Bay_3.jpg/250px-St_John_Trunk_Bay_3.jpg')},
  {id:'voya',name:'Voyageurs',state:'Minnesota',lat:48.5,lng:-92.88,visited:'2025-09-30',image:img('b/bd/Voyageurs_National_Park.jpg/250px-Voyageurs_National_Park.jpg')},
  {id:'whsa',name:'White Sands',state:'New Mexico',lat:32.78,lng:-106.17,offset:[-1.2,.3],image:img('c/cf/White_Sands_National_Park_visitor_center_and_native_plant_garden%2C_New_Mexico%2C_United_States.jpg/250px-White_Sands_National_Park_visitor_center_and_native_plant_garden%2C_New_Mexico%2C_United_States.jpg')},
  {id:'wica',name:'Wind Cave',state:'South Dakota',lat:43.57,lng:-103.48,offset:[-1,.7],image:img('1/1c/Skyway_Lake%2C_stalactites%2C_Wind_Cave.jpg/250px-Skyway_Lake%2C_stalactites%2C_Wind_Cave.jpg')},
  {id:'wrst',name:'Wrangell–St. Elias',state:'Alaska',lat:61,lng:-142,region:'alaska',offset:[4,0],image:img('4/4b/Mt_Saint_Elias%2C_South_Central_Alaska.jpg/250px-Mt_Saint_Elias%2C_South_Central_Alaska.jpg')},
  {id:'yell',name:'Yellowstone',state:'Wyoming / Montana / Idaho',lat:44.6,lng:-110.5,visited:'2025-05-19',offset:[-1,-.7],image:img('7/73/Grand_Canyon_of_yellowstone.jpg/250px-Grand_Canyon_of_yellowstone.jpg')},
  {id:'yose',name:'Yosemite',state:'California',lat:37.87,lng:-119.54,visited:'2025-03-08',offset:[.7,-.5],image:img('e/ea/Half_Dome_with_Eastern_Yosemite_Valley_%2850MP%29.jpg/250px-Half_Dome_with_Eastern_Yosemite_Valley_%2850MP%29.jpg')},
  {id:'zion',name:'Zion',state:'Utah',lat:37.3,lng:-113.05,offset:[.8,1.5],image:img('1/10/Zion_angels_landing_view.jpg/250px-Zion_angels_landing_view.jpg')},
];

export const NATIONAL_PARKS: NationalPark[] = PARKS.map(park => ({
  ...park,
  photos: PARK_PHOTOS[park.id] ?? park.photos,
}));
import { PARK_PHOTOS } from './parkPhotos';
