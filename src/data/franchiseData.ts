export interface CafeFranchise {
  id: string;
  city: string;
  branchName: string;
  isCurrent: boolean;
  address: string;
  phone: string;
  hours: string;
  websiteUrl?: string;
  mapsUrl?: string;
  badge?: string;
  status: 'Open' | 'Coming Soon' | 'Partner';
}

export const CAFE_FRANCHISES: CafeFranchise[] = [
  {
    id: 'sangli-100ft',
    city: 'Sangli',
    branchName: 'Cafe Choco Craze — Sangli (100ft Road)',
    isCurrent: true,
    address: '100ft Road, Nishant Colony, Opposite to Military Canteen, Sangli, Maharashtra 416416',
    phone: '+91 9850568355',
    hours: '12:00 PM – 9:30 PM (Tue Closed)',
    websiteUrl: 'https://chococraze.xyz/sangli',
    mapsUrl: 'https://maps.app.goo.gl/aAXvm39A9ifWXnJU6?g_st=iw',
    badge: 'Current Webpage',
    status: 'Open',
  },
  {
    id: 'kolhapur-rajarampuri',
    city: 'Kolhapur',
    branchName: 'Cafe Choco Craze — Kolhapur (Rajarampuri)',
    isCurrent: false,
    address: 'Near 2nd Lane, Rajarampuri, Kolhapur, Maharashtra',
    phone: '+91 9850568355',
    hours: '11:00 AM – 10:30 PM',
    mapsUrl: 'https://maps.google.com/?q=Cafe+Choco+Craze+Kolhapur',
    badge: 'Popular Franchise',
    status: 'Open',
  },
  {
    id: 'pune-fc-road',
    city: 'Pune',
    branchName: 'Cafe Choco Craze — Pune (FC Road / Kothrud)',
    isCurrent: false,
    address: 'Fergusson College Road / Kothrud, Pune, Maharashtra',
    phone: '+91 9850568355',
    hours: '11:00 AM – 11:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Cafe+Choco+Craze+Pune',
    badge: 'Franchise Outlet',
    status: 'Open',
  },
  {
    id: 'miraj-station-road',
    city: 'Miraj',
    branchName: 'Cafe Choco Craze — Miraj',
    isCurrent: false,
    address: 'Near Mission Hospital / High School Road, Miraj',
    phone: '+91 9850568355',
    hours: '12:00 PM – 10:00 PM',
    mapsUrl: 'https://maps.google.com/?q=Cafe+Choco+Craze+Miraj',
    badge: 'Twin City Branch',
    status: 'Open',
  },
  {
    id: 'jaysingpur-main',
    city: 'Jaysingpur',
    branchName: 'Cafe Choco Craze — Jaysingpur',
    isCurrent: false,
    address: 'Station Road, Jaysingpur, Maharashtra',
    phone: '+91 9850568355',
    hours: '12:00 PM – 10:00 PM',
    status: 'Open',
  },
  {
    id: 'karad-highway',
    city: 'Karad',
    branchName: 'Cafe Choco Craze — Karad',
    isCurrent: false,
    address: 'Near Bus Stand / Kolhapur Naka, Karad',
    phone: '+91 9850568355',
    hours: '12:00 PM – 9:30 PM',
    status: 'Open',
  },
];

export const FRANCHISE_INQUIRY = {
  brand: 'Cafe Choco Craze',
  tagline: 'Join Maharashtra\'s Fastest Growing Cafe Chain',
  phone: '+91 9850568355',
  email: 'franchise@chococraze.xyz',
  headquarters: 'Sangli, Maharashtra',
  established: '2019',
};
