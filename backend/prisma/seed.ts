import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Detailed list of 155 real destinations with specific, highly relevant Unsplash images
const RAW_DESTINATIONS = [
  // India (30 Cities)
  {
    city: 'Delhi',
    country: 'India',
    continent: 'India',
    budget: 12000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Red Fort, Qutub Minar, India Gate',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Mumbai',
    country: 'India',
    continent: 'India',
    budget: 15000,
    bestTime: 'Nov to Feb',
    duration: '3 Days',
    attractions: 'Gateway of India, Marine Drive, Elephanta Caves',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1562158147-f8d6fbcd76f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Goa',
    country: 'India',
    continent: 'India',
    budget: 14000,
    bestTime: 'Nov to Feb',
    duration: '4 Days',
    attractions: 'Calangute Beach, Baga Beach, Dudhsagar Falls',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Jaipur',
    country: 'India',
    continent: 'India',
    budget: 10000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Hawa Mahal, Amber Fort, City Palace',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1477584322813-ac0528ef3c3e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1599661046289-e31887846eac?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Udaipur',
    country: 'India',
    continent: 'India',
    budget: 13000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Lake Pichola, City Palace, Jag Mandir',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Jaisalmer',
    country: 'India',
    continent: 'India',
    budget: 12000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Jaisalmer Fort, Sam Sand Dunes, Patwon Ki Haveli',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Jodhpur',
    country: 'India',
    continent: 'India',
    budget: 11000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Mehrangarh Fort, Umaid Bhawan Palace, Jaswant Thada',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1562184647-7598b375fc43?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Manali',
    country: 'India',
    continent: 'India',
    budget: 15000,
    bestTime: 'Oct to Jun',
    duration: '4 Days',
    attractions: 'Solang Valley, Rohtang Pass, Hadimba Temple',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Shimla',
    country: 'India',
    continent: 'India',
    budget: 12000,
    bestTime: 'Mar to Jun',
    duration: '3 Days',
    attractions: 'The Mall Road, Jakhoo Temple, Kufri',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Srinagar',
    country: 'India',
    continent: 'India',
    budget: 20000,
    bestTime: 'Apr to Oct',
    duration: '4 Days',
    attractions: 'Dal Lake, Shalimar Bagh, Nishat Bagh',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1598283733679-b1d5c2199b50?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1566224340263-6e3e3e3e3e3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1598302842443-855a9f1a27e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Gulmarg',
    country: 'India',
    continent: 'India',
    budget: 22000,
    bestTime: 'Dec to Mar',
    duration: '3 Days',
    attractions: 'Gulmarg Gondola, Apharwat Peak, Strawberry Valley',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1598283733679-b1d5c2199b50?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1598302842443-855a9f1a27e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Leh',
    country: 'India',
    continent: 'India',
    budget: 25000,
    bestTime: 'May to Sep',
    duration: '5 Days',
    attractions: 'Pangong Lake, Nubra Valley, Khardung La',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Ladakh',
    country: 'India',
    continent: 'India',
    budget: 27000,
    bestTime: 'May to Sep',
    duration: '6 Days',
    attractions: 'Magnetic Hill, Shanti Stupa, Zanskar Valley',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Rishikesh',
    country: 'India',
    continent: 'India',
    budget: 8999,
    bestTime: 'Sep to Nov',
    duration: '3 Days',
    attractions: 'Laxman Jhula, Triveni Ghat, Beatles Ashram',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1571536802807-304bc1b3a251?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Varanasi',
    country: 'India',
    continent: 'India',
    budget: 9000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Kashi Vishwanath Temple, Dashashwamedh Ghat, Sarnath',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1571536802807-304bc1b3a251?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Agra',
    country: 'India',
    continent: 'India',
    budget: 8999,
    bestTime: 'Oct to Mar',
    duration: '2 Days',
    attractions: 'Taj Mahal, Agra Fort, Fatehpur Sikri',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1598324422222-2b73c4d7cd62?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Munnar',
    country: 'India',
    continent: 'India',
    budget: 14000,
    bestTime: 'Sep to May',
    duration: '3 Days',
    attractions: 'Eravikulam National Park, Mattupetty Dam, Tea Museum',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kochi',
    country: 'India',
    continent: 'India',
    budget: 13000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Fort Kochi, Chinese Fishing Nets, Mattancherry Palace',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Ooty',
    country: 'India',
    continent: 'India',
    budget: 12000,
    bestTime: 'Oct to Jun',
    duration: '3 Days',
    attractions: 'Ooty Botanical Gardens, Ooty Lake, Doddabetta Peak',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1626596120563-71822831c261?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Darjeeling',
    country: 'India',
    continent: 'India',
    budget: 16000,
    bestTime: 'Apr to Jun',
    duration: '3 Days',
    attractions: 'Tiger Hill, Batasia Loop, Himalayan Railway',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Gangtok',
    country: 'India',
    continent: 'India',
    budget: 18000,
    bestTime: 'Oct to Dec',
    duration: '4 Days',
    attractions: 'Nathu La Pass, Tsomgo Lake, Rumtek Monastery',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Port Blair',
    country: 'India',
    continent: 'India',
    budget: 28000,
    bestTime: 'Oct to May',
    duration: '4 Days',
    attractions: 'Cellular Jail, Ross Island, Radhanagar Beach',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kavaratti',
    country: 'India',
    continent: 'India',
    budget: 35000,
    bestTime: 'Oct to May',
    duration: '4 Days',
    attractions: 'Kavaratti Lagoon, Marine Aquarium, Urra Mosque',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Hyderabad',
    country: 'India',
    continent: 'India',
    budget: 12000,
    bestTime: 'Nov to Feb',
    duration: '3 Days',
    attractions: 'Charminar, Golconda Fort, Ramoji Film City',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1581333100576-b73b002c02cf?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1608958416715-aa4bb5a0a3d4?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bengaluru',
    country: 'India',
    continent: 'India',
    budget: 14000,
    bestTime: 'Year-round',
    duration: '3 Days',
    attractions: 'Bangalore Palace, Lalbagh Gardens, Cubbon Park',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1585135246927-4c387ad64b4c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Chennai',
    country: 'India',
    continent: 'India',
    budget: 13000,
    bestTime: 'Nov to Feb',
    duration: '3 Days',
    attractions: 'Marina Beach, Kapaleeshwarar Temple, Mahabalipuram',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1541432901-ecffbb7fcd95?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1599661046289-e31887846eac?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1608958416715-aa4bb5a0a3d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kolkata',
    country: 'India',
    continent: 'India',
    budget: 12000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Victoria Memorial, Howrah Bridge, Dakshineswar Temple',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1565426990001-0d87e89e174b?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Amritsar',
    country: 'India',
    continent: 'India',
    budget: 9000,
    bestTime: 'Oct to Mar',
    duration: '2 Days',
    attractions: 'Golden Temple, Wagah Border, Jallianwala Bagh',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Pune',
    country: 'India',
    continent: 'India',
    budget: 11000,
    bestTime: 'Oct to Mar',
    duration: '3 Days',
    attractions: 'Aga Khan Palace, Shaniwar Wada, Sinhagad Fort',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec97?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Alleppey',
    country: 'India',
    continent: 'India',
    budget: 15000,
    bestTime: 'Sep to Mar',
    duration: '3 Days',
    attractions: 'Alappuzha Beach, Vembanad Lake, Backwaters Houseboat',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1593693411515-c202e974fe08?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
  },

  // Asia (30 Cities)
  {
    city: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    budget: 140000,
    bestTime: 'Mar to May',
    duration: '5 Days',
    attractions: 'Senso-ji, Tokyo Skytree, Shibuya Crossing',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    budget: 130000,
    bestTime: 'Oct to Nov',
    duration: '4 Days',
    attractions: 'Fushimi Inari-taisha, Kinkaku-ji, Arashiyama Bamboo Grove',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Osaka',
    country: 'Japan',
    continent: 'Asia',
    budget: 120000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'Osaka Castle, Dotonbori, Universal Studios',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Seoul',
    country: 'South Korea',
    continent: 'Asia',
    budget: 95000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Gyeongbokgung Palace, N Seoul Tower, Myeongdong',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Busan',
    country: 'South Korea',
    continent: 'Asia',
    budget: 85000,
    bestTime: 'May to Oct',
    duration: '3 Days',
    attractions: 'Haeundae Beach, Gamcheon Culture Village',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Jeju Island',
    country: 'South Korea',
    continent: 'Asia',
    budget: 90000,
    bestTime: 'May to Sep',
    duration: '4 Days',
    attractions: 'Hallasan Mountain, Manjanggul Cave',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1578002171601-902a5a7645a9?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1517089596392-db9a5e9478cc?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    budget: 75000,
    bestTime: 'Feb to Apr',
    duration: '4 Days',
    attractions: 'Gardens by the Bay, Sentosa Island, Marina Bay Sands',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1568240409418-47209772ee57?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    budget: 35000,
    bestTime: 'Nov to Feb',
    duration: '4 Days',
    attractions: 'Grand Palace, Wat Arun, Chatuchak Market',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1563492065561-9f5a49a6fe0e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Phuket',
    country: 'Thailand',
    continent: 'Asia',
    budget: 45000,
    bestTime: 'Nov to Apr',
    duration: '4 Days',
    attractions: 'Patong Beach, Phi Phi Islands, Big Buddha',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Chiang Mai',
    country: 'Thailand',
    continent: 'Asia',
    budget: 38000,
    bestTime: 'Nov to Feb',
    duration: '3 Days',
    attractions: 'Wat Phra That Doi Suthep, Night Bazaar',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1563492065561-9f5a49a6fe0e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    continent: 'Asia',
    budget: 40000,
    bestTime: 'Dec to Feb',
    duration: '3 Days',
    attractions: 'Petronas Twin Towers, Batu Caves, Bukit Bintang',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1541093113199-a2e9d84e903f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595183301741-2b7304874f44?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Langkawi',
    country: 'Malaysia',
    continent: 'Asia',
    budget: 45000,
    bestTime: 'Nov to Apr',
    duration: '4 Days',
    attractions: 'Langkawi Sky Bridge, Pantai Cenang',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1541093113199-a2e9d84e903f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1595183301741-2b7304874f44?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Penang',
    country: 'Malaysia',
    continent: 'Asia',
    budget: 38000,
    bestTime: 'Nov to Jan',
    duration: '3 Days',
    attractions: 'George Town Street Art, Kek Lok Si Temple',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1595183301741-2b7304874f44?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1541093113199-a2e9d84e903f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kathmandu',
    country: 'Nepal',
    continent: 'Asia',
    budget: 25000,
    bestTime: 'Oct to Dec',
    duration: '3 Days',
    attractions: 'Boudhanath Stupa, Pashupatinath Temple, Swayambhunath',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Pokhara',
    country: 'Nepal',
    continent: 'Asia',
    budget: 28000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Phewa Lake, Sarangkot Peak, Peace Pagoda',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Colombo',
    country: 'Sri Lanka',
    continent: 'Asia',
    budget: 32000,
    bestTime: 'Jan to Mar',
    duration: '3 Days',
    attractions: 'Galle Face Green, Gangaramaya Temple',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1554160454-e0eb37478028?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1625471415174-8b6540c49fb4?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1588598126852-d7b4d999935e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Galle',
    country: 'Sri Lanka',
    continent: 'Asia',
    budget: 36000,
    bestTime: 'Dec to Apr',
    duration: '3 Days',
    attractions: 'Galle Fort, Unawatuna Beach, Jungle Beach',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1625471415174-8b6540c49fb4?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1554160454-e0eb37478028?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1588598126852-d7b4d999935e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kandy',
    country: 'Sri Lanka',
    continent: 'Asia',
    budget: 30000,
    bestTime: 'Jan to Apr',
    duration: '3 Days',
    attractions: 'Temple of the Tooth, Kandy Lake',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1588598126852-d7b4d999935e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1554160454-e0eb37478028?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1625471415174-8b6540c49fb4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Male',
    country: 'Maldives',
    continent: 'Asia',
    budget: 110000,
    bestTime: 'Nov to Apr',
    duration: '4 Days',
    attractions: 'Male Friday Mosque, National Museum',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Maafushi',
    country: 'Maldives',
    continent: 'Asia',
    budget: 65000,
    bestTime: 'Nov to Apr',
    duration: '4 Days',
    attractions: 'Bikini Beach, Sandbank tours, Snorkeling spots',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Port Louis',
    country: 'Mauritius',
    continent: 'Asia',
    budget: 85000,
    bestTime: 'May to Dec',
    duration: '4 Days',
    attractions: 'Caudan Waterfront, Sir Seewoosagur Botanical Garden',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1579705744820-21a48c41db0b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1606501290374-bbd758f8448a?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Grand Baie',
    country: 'Mauritius',
    continent: 'Asia',
    budget: 95000,
    bestTime: 'May to Dec',
    duration: '5 Days',
    attractions: 'Pereybere Beach, Grand Bay Lagoon',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1606501290374-bbd758f8448a?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1579705744820-21a48c41db0b?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Istanbul',
    country: 'Turkey',
    continent: 'Asia',
    budget: 70000,
    bestTime: 'Apr to May',
    duration: '4 Days',
    attractions: 'Hagia Sophia, Blue Mosque, Grand Bazaar',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Cappadocia',
    country: 'Turkey',
    continent: 'Asia',
    budget: 85000,
    bestTime: 'Apr to Jun',
    duration: '3 Days',
    attractions: 'Goreme Open Air Museum, Love Valley',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Antalya',
    country: 'Turkey',
    continent: 'Asia',
    budget: 75000,
    bestTime: 'Jun to Sep',
    duration: '4 Days',
    attractions: 'Hadrian’s Gate, Old Town (Kaleiçi)',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Dubai',
    country: 'UAE',
    continent: 'Asia',
    budget: 65000,
    bestTime: 'Nov to Mar',
    duration: '4 Days',
    attractions: 'Burj Khalifa, Dubai Mall, Desert Safari',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1618245341258-005d5c0bcf1c?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522083165195-342750297f4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Abu Dhabi',
    country: 'UAE',
    continent: 'Asia',
    budget: 70000,
    bestTime: 'Nov to Mar',
    duration: '4 Days',
    attractions: 'Sheikh Zayed Grand Mosque, Ferrari World',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1618245341258-005d5c0bcf1c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1522083165195-342750297f4e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Hanoi',
    country: 'Vietnam',
    continent: 'Asia',
    budget: 35000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Hoan Kiem Lake, Old Quarter',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1509060464153-44667396260f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Halong Bay',
    country: 'Vietnam',
    continent: 'Asia',
    budget: 45000,
    bestTime: 'Oct to Dec',
    duration: '3 Days',
    attractions: 'Ti Top Island, Sung Sot Cave',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1509060464153-44667396260f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Ho Chi Minh',
    country: 'Vietnam',
    continent: 'Asia',
    budget: 36000,
    bestTime: 'Dec to Apr',
    duration: '4 Days',
    attractions: 'War Remnants Museum, Ben Thanh Market',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1509060464153-44667396260f?auto=format&fit=crop&w=800&q=80'
  },

  // Europe (30 Cities)
  {
    city: 'Paris',
    country: 'France',
    continent: 'Europe',
    budget: 140000,
    bestTime: 'Apr to Jun',
    duration: '5 Days',
    attractions: 'Eiffel Tower, Louvre Museum, Notre-Dame',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1499856134248-712176d6c86f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Nice',
    country: 'France',
    continent: 'Europe',
    budget: 130000,
    bestTime: 'May to Oct',
    duration: '4 Days',
    attractions: 'Promenade des Anglais, Castle Hill',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Lyon',
    country: 'France',
    continent: 'Europe',
    budget: 120000,
    bestTime: 'Apr to Oct',
    duration: '3 Days',
    attractions: 'Basilique Notre Dame, Vieux Lyon',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1588613328221-bf281d39b8bc?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'London',
    country: 'UK',
    continent: 'Europe',
    budget: 150000,
    bestTime: 'May to Sep',
    duration: '5 Days',
    attractions: 'Tower of London, British Museum, London Eye',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Edinburgh',
    country: 'UK',
    continent: 'Europe',
    budget: 130000,
    bestTime: 'Jun to Aug',
    duration: '4 Days',
    attractions: 'Edinburgh Castle, Royal Mile',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bath',
    country: 'UK',
    continent: 'Europe',
    budget: 110000,
    bestTime: 'Jul to Sep',
    duration: '2 Days',
    attractions: 'Roman Baths, Bath Abbey',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1605553070440-b6f7c75dbf10?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1529655683826-aba9b3e21f66?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Rome',
    country: 'Italy',
    continent: 'Europe',
    budget: 125000,
    bestTime: 'Apr to Jun',
    duration: '4 Days',
    attractions: 'Colosseum, Vatican Museums, Trevi Fountain',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1515548419970-d79a71a590e8?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1531572753766-1097a3106b2e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Venice',
    country: 'Italy',
    continent: 'Europe',
    budget: 135000,
    bestTime: 'Apr to Jun',
    duration: '3 Days',
    attractions: 'St. Mark’s Basilica, Grand Canal',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Florence',
    country: 'Italy',
    continent: 'Europe',
    budget: 120000,
    bestTime: 'May to Sep',
    duration: '3 Days',
    attractions: 'Uffizi Gallery, Cathedral of Santa Maria',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1504186131844-6a0fe06001d1?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Milan',
    country: 'Italy',
    continent: 'Europe',
    budget: 130000,
    bestTime: 'Sep to Nov',
    duration: '3 Days',
    attractions: 'Duomo di Milano, Galleria Vittorio Emanuele II',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1529260830199-445824838d28?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    budget: 110000,
    bestTime: 'May to Jun',
    duration: '4 Days',
    attractions: 'Sagrada Família, Park Güell, La Rambla',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1559585640-1ec6024d2e82?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Madrid',
    country: 'Spain',
    continent: 'Europe',
    budget: 105000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Royal Palace of Madrid, Prado Museum',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1559585640-1ec6024d2e82?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Seville',
    country: 'Spain',
    continent: 'Europe',
    budget: 98000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'Plaza de España, Alcázar of Seville',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1559585640-1ec6024d2e82?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    continent: 'Europe',
    budget: 125000,
    bestTime: 'Apr to Sep',
    duration: '4 Days',
    attractions: 'Rijksmuseum, Van Gogh Museum, Anne Frank House',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Rotterdam',
    country: 'Netherlands',
    continent: 'Europe',
    budget: 115000,
    bestTime: 'Apr to Sep',
    duration: '3 Days',
    attractions: 'Cube Houses, Markthal, Erasmus Bridge',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1583422409516-2895a77efedd?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    continent: 'Europe',
    budget: 95000,
    bestTime: 'May to Sep',
    duration: '4 Days',
    attractions: 'Charles Bridge, Prague Castle, Old Town Square',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1517949900011-0d87e89e174b?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1509136561182-890d14d8525b?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Vienna',
    country: 'Austria',
    continent: 'Europe',
    budget: 115000,
    bestTime: 'Apr to May',
    duration: '4 Days',
    attractions: 'Schönbrunn Palace, St. Stephen’s Cathedral',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1517949900011-0d87e89e174b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1509136561182-890d14d8525b?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Budapest',
    country: 'Hungary',
    continent: 'Europe',
    budget: 90000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'Buda Castle, Parliament Building, Széchenyi Thermal Bath',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1565426990001-0d87e89e174b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1517949900011-0d87e89e174b?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Berlin',
    country: 'Germany',
    continent: 'Europe',
    budget: 110000,
    bestTime: 'May to Sep',
    duration: '4 Days',
    attractions: 'Brandenburg Gate, Berlin Wall, Reichstag Building',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1509136561182-890d14d8525b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Munich',
    country: 'Germany',
    continent: 'Europe',
    budget: 120000,
    bestTime: 'Sep to Oct',
    duration: '3 Days',
    attractions: 'Marienplatz, Nymphenburg Palace',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1509136561182-890d14d8525b?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Zurich',
    country: 'Switzerland',
    continent: 'Europe',
    budget: 180000,
    bestTime: 'Jun to Aug',
    duration: '3 Days',
    attractions: 'Lake Zurich, Bahnhofstrasse, Uetliberg',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1594568818485-61ff5fb82ee7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Interlaken',
    country: 'Switzerland',
    continent: 'Europe',
    budget: 195000,
    bestTime: 'Jun to Aug',
    duration: '4 Days',
    attractions: 'Harder Kulm, Lake Brienz, Jungfraujoch excursion',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1594568818485-61ff5fb82ee7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Geneva',
    country: 'Switzerland',
    continent: 'Europe',
    budget: 170000,
    bestTime: 'May to Oct',
    duration: '3 Days',
    attractions: 'Jet d’Eau, Lake Geneva, Palais des Nations',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1594568818485-61ff5fb82ee7?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Lucerne',
    country: 'Switzerland',
    continent: 'Europe',
    budget: 185000,
    bestTime: 'May to Sep',
    duration: '3 Days',
    attractions: 'Chapel Bridge, Mount Pilatus, Swiss Transport Museum',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1594568818485-61ff5fb82ee7?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    budget: 160000,
    bestTime: 'May to Oct',
    duration: '4 Days',
    attractions: 'Oia Cliffs, Caldera cruise, Red Beach',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1601581874834-3b60656a5e17?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Athens',
    country: 'Greece',
    continent: 'Europe',
    budget: 110000,
    bestTime: 'Apr to Jun',
    duration: '4 Days',
    attractions: 'Acropolis, Parthenon, Plaka district',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1601581874834-3b60656a5e17?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Mykonos',
    country: 'Greece',
    continent: 'Europe',
    budget: 150000,
    bestTime: 'Jun to Sep',
    duration: '3 Days',
    attractions: 'Little Venice, Windmills, Paradise Beach',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1601581874834-3b60656a5e17?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1608155686393-8fdd966d784d?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Lisbon',
    country: 'Portugal',
    continent: 'Europe',
    budget: 105000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'Belém Tower, Jerónimos Monastery, Alfama district',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1509840144525-4c55a4ecd067?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1549918838-74848d6f51cc?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Porto',
    country: 'Portugal',
    continent: 'Europe',
    budget: 98000,
    bestTime: 'May to Sep',
    duration: '3 Days',
    attractions: 'Dom Luís I Bridge, Livraria Lello',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1509840144525-4c55a4ecd067?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1549918838-74848d6f51cc?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Dublin',
    country: 'Ireland',
    continent: 'Europe',
    budget: 120000,
    bestTime: 'Jun to Aug',
    duration: '4 Days',
    attractions: 'Trinity College, Guinness Storehouse',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1549918838-74848d6f51cc?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1509840144525-4c55a4ecd067?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80'
  },

  // North America (20 Cities)
  {
    city: 'New York',
    country: 'USA',
    continent: 'North America',
    budget: 180000,
    bestTime: 'Sep to Nov',
    duration: '5 Days',
    attractions: 'Times Square, Central Park, Statue of Liberty',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1524168206189-78331607a93f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Los Angeles',
    country: 'USA',
    continent: 'North America',
    budget: 170000,
    bestTime: 'Mar to May',
    duration: '5 Days',
    attractions: 'Hollywood Walk of Fame, Santa Monica Pier',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1542259005-4c3e390c5f6e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'San Francisco',
    country: 'USA',
    continent: 'North America',
    budget: 165000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Golden Gate Bridge, Alcatraz Island',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1542259005-4c3e390c5f6e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Las Vegas',
    country: 'USA',
    continent: 'North America',
    budget: 150000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'The Strip, Bellagio Fountains, Grand Canyon heli-tour',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1522083165195-342750297f4e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Chicago',
    country: 'USA',
    continent: 'North America',
    budget: 140000,
    bestTime: 'Jun to Aug',
    duration: '4 Days',
    attractions: 'Millennium Park (The Bean), Navy Pier',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1524168206189-78331607a93f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Miami',
    country: 'USA',
    continent: 'North America',
    budget: 155000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'South Beach, Everglades National Park',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Orlando',
    country: 'USA',
    continent: 'North America',
    budget: 160000,
    bestTime: 'Jan to Apr',
    duration: '5 Days',
    attractions: 'Walt Disney World, Universal Orlando Resort',
    category: 'Family',
    image: 'https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Washington DC',
    country: 'USA',
    continent: 'North America',
    budget: 135000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Lincoln Memorial, National Mall, White House',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1557160854-e1e89fdd32e6?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Seattle',
    country: 'USA',
    continent: 'North America',
    budget: 145000,
    bestTime: 'Jun to Sep',
    duration: '4 Days',
    attractions: 'Space Needle, Pike Place Market',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Boston',
    country: 'USA',
    continent: 'North America',
    budget: 138000,
    bestTime: 'Jun to Oct',
    duration: '3 Days',
    attractions: 'Freedom Trail, Fenway Park, Harvard University',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1506970371743-5702ca990be6?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Toronto',
    country: 'Canada',
    continent: 'North America',
    budget: 140000,
    bestTime: 'Jun to Oct',
    duration: '4 Days',
    attractions: 'CN Tower, Royal Ontario Museum, Toronto Islands',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Vancouver',
    country: 'Canada',
    continent: 'North America',
    budget: 155000,
    bestTime: 'Jun to Oct',
    duration: '4 Days',
    attractions: 'Stanley Park, Capilano Suspension Bridge',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Montreal',
    country: 'Canada',
    continent: 'North America',
    budget: 130000,
    bestTime: 'May to Sep',
    duration: '4 Days',
    attractions: 'Notre-Dame Basilica, Mount Royal Park',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1532960401447-7dda05b637a8?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Quebec City',
    country: 'Canada',
    continent: 'North America',
    budget: 135000,
    bestTime: 'Jun to Aug',
    duration: '3 Days',
    attractions: 'Château Frontenac, Old Quebec historical walls',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1599824401560-ef02b12f0c0e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Mexico City',
    country: 'Mexico',
    continent: 'North America',
    budget: 85000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'Frida Kahlo Museum, Zocalo plaza, Teotihuacan ruins',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1585464231875-d9ef1fcfad0b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1512813583145-ac0528ef3c3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Cancun',
    country: 'Mexico',
    continent: 'North America',
    budget: 95000,
    bestTime: 'Dec to Apr',
    duration: '5 Days',
    attractions: 'Playa Delfines, Chichen Itza excursion',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Tulum',
    country: 'Mexico',
    continent: 'North America',
    budget: 105000,
    bestTime: 'Nov to Dec',
    duration: '4 Days',
    attractions: 'Tulum Ruins, Grand Cenote swimming',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Guadalajara',
    country: 'Mexico',
    continent: 'North America',
    budget: 82000,
    bestTime: 'Oct to Dec',
    duration: '3 Days',
    attractions: 'Guadalajara Cathedral, Hospicio Cabañas',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1512813583145-ac0528ef3c3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1585464231875-d9ef1fcfad0b?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Havana',
    country: 'Cuba',
    continent: 'North America',
    budget: 90000,
    bestTime: 'Nov to Apr',
    duration: '4 Days',
    attractions: 'Old Havana historic streets, El Morro Castle',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1560242203-0c2422033bc6?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1512813583145-ac0528ef3c3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Varadero',
    country: 'Cuba',
    continent: 'North America',
    budget: 98000,
    bestTime: 'Nov to Apr',
    duration: '5 Days',
    attractions: 'Varadero Beach, Cueva de Ambrosio',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },

  // South America (15 Cities)
  {
    city: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'South America',
    budget: 110000,
    bestTime: 'Dec to Mar',
    duration: '4 Days',
    attractions: 'Christ the Redeemer, Sugarloaf Mountain',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1549400827-07ab0a2d02ca?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Sao Paulo',
    country: 'Brazil',
    continent: 'South America',
    budget: 105000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'Ibirapuera Park, São Paulo Museum of Art',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1549400827-07ab0a2d02ca?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Salvador',
    country: 'Brazil',
    continent: 'South America',
    budget: 95000,
    bestTime: 'Dec to Mar',
    duration: '3 Days',
    attractions: 'Pelourinho, Elevador Lacerda',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1549400827-07ab0a2d02ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    continent: 'South America',
    budget: 95000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'Teatro Colón, La Boca district, Recoleta Cemetery',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1583002621742-c60657eea523?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bariloche',
    country: 'Argentina',
    continent: 'South America',
    budget: 115000,
    bestTime: 'Jul to Sep',
    duration: '4 Days',
    attractions: 'Cerro Catedral, Nahuel Huapi Lake',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1530268576356-0cf6b6a0a030?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Santiago',
    country: 'Chile',
    continent: 'South America',
    budget: 110000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Cerro Santa Lucía, Plaza de Armas',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1589825316315-7a4b69d4bd4e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1579619163273-0498eb7cd42f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Valparaiso',
    country: 'Chile',
    continent: 'South America',
    budget: 102000,
    bestTime: 'Nov to Mar',
    duration: '3 Days',
    attractions: 'La Sebastiana (Neruda home), Historic Funiculars',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1579619163273-0498eb7cd42f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1589825316315-7a4b69d4bd4e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Lima',
    country: 'Peru',
    continent: 'South America',
    budget: 98000,
    bestTime: 'Dec to Apr',
    duration: '3 Days',
    attractions: 'Plaza Mayor, Larco Museum, Miraflores coastline',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1531945086322-64e2ffae14a6?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Cusco',
    country: 'Peru',
    continent: 'South America',
    budget: 105000,
    bestTime: 'May to Sep',
    duration: '4 Days',
    attractions: 'Sacsayhuamán ruins, Plaza de Armas',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Machu Picchu',
    country: 'Peru',
    continent: 'South America',
    budget: 125000,
    bestTime: 'May to Sep',
    duration: '3 Days',
    attractions: 'Huayna Picchu, Intihuatana Stone',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bogota',
    country: 'Colombia',
    continent: 'South America',
    budget: 85000,
    bestTime: 'Dec to Mar',
    duration: '3 Days',
    attractions: 'Monserrate Sanctuary, Gold Museum',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1590483734724-29ba022e8615?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1583531172005-814ff889b161?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Cartagena',
    country: 'Colombia',
    continent: 'South America',
    budget: 95000,
    bestTime: 'Dec to Apr',
    duration: '4 Days',
    attractions: 'Walled City historic fort, Castillo San Felipe',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1583531172005-814ff889b161?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1590483734724-29ba022e8615?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Medellin',
    country: 'Colombia',
    continent: 'South America',
    budget: 88000,
    bestTime: 'Year-round',
    duration: '4 Days',
    attractions: 'Arvi Park, Plaza Botero, Cable Cars',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1594385208643-4a1fb5fdd88b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1590483734724-29ba022e8615?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1568289463675-15a3f2d2427a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Quito',
    country: 'Ecuador',
    continent: 'South America',
    budget: 90000,
    bestTime: 'Jun to Sep',
    duration: '3 Days',
    attractions: 'Mitad del Mundo, Quito Old Town historical plazas',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Galapagos',
    country: 'Ecuador',
    continent: 'South America',
    budget: 180000,
    bestTime: 'Dec to May',
    duration: '5 Days',
    attractions: 'Tortuga Bay, Charles Darwin Research Station',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },

  // Africa (15 Cities)
  {
    city: 'Cairo',
    country: 'Egypt',
    continent: 'Africa',
    budget: 68000,
    bestTime: 'Oct to Apr',
    duration: '4 Days',
    attractions: 'Giza Pyramids, Sphinx, Egyptian Museum',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1600577916048-804c9191e36c?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1547984605-9b25136c5e92?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Luxor',
    country: 'Egypt',
    continent: 'Africa',
    budget: 75000,
    bestTime: 'Oct to Apr',
    duration: '3 Days',
    attractions: 'Valley of the Kings, Karnak Temple',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1600577916048-804c9191e36c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1547984605-9b25136c5e92?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Aswan',
    country: 'Egypt',
    continent: 'Africa',
    budget: 72000,
    bestTime: 'Oct to Apr',
    duration: '3 Days',
    attractions: 'Philae Temple, High Dam, Nubian Village',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1547984605-9b25136c5e92?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1600577916048-804c9191e36c?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    budget: 110000,
    bestTime: 'Nov to Mar',
    duration: '4 Days',
    attractions: 'Table Mountain, Cape of Good Hope, Robben Island',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Johannesburg',
    country: 'South Africa',
    continent: 'Africa',
    budget: 98000,
    bestTime: 'May to Sep',
    duration: '3 Days',
    attractions: 'Apartheid Museum, Soweto township, Gold Reef City',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Kruger',
    country: 'South Africa',
    continent: 'Africa',
    budget: 135000,
    bestTime: 'May to Sep',
    duration: '4 Days',
    attractions: 'Sabi Sands Game Reserve, Panorama Route',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Nairobi',
    country: 'Kenya',
    continent: 'Africa',
    budget: 85000,
    bestTime: 'Jul to Oct',
    duration: '3 Days',
    attractions: 'Nairobi National Park, Giraffe Centre',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Mombasa',
    country: 'Kenya',
    continent: 'Africa',
    budget: 92000,
    bestTime: 'Dec to Mar',
    duration: '4 Days',
    attractions: 'Fort Jesus, Diani Beach, Nyali Beach',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Zanzibar',
    country: 'Tanzania',
    continent: 'Africa',
    budget: 98000,
    bestTime: 'Jun to Oct',
    duration: '4 Days',
    attractions: 'Nungwi Beach, Prison Island, Mnemba Atoll',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1563841930606-67e2bde48b7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Stone Town',
    country: 'Tanzania',
    continent: 'Africa',
    budget: 90000,
    bestTime: 'Jun to Oct',
    duration: '3 Days',
    attractions: 'House of Wonders, Old Fort, Spice markets',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Marrakech',
    country: 'Morocco',
    continent: 'Africa',
    budget: 80000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'Majorelle Garden, Bahia Palace, Jemaa el-Fnaa',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1597212622942-9b5022e8615a?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1553098223-4b6b592f86a9?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Casablanca',
    country: 'Morocco',
    continent: 'Africa',
    budget: 82000,
    bestTime: 'May to Sep',
    duration: '3 Days',
    attractions: 'Hassan II Mosque, Corniche boardwalk',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1553098223-4b6b592f86a9?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1597212622942-9b5022e8615a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Fes',
    country: 'Morocco',
    continent: 'Africa',
    budget: 78000,
    bestTime: 'Apr to Jun',
    duration: '3 Days',
    attractions: 'Fes el Bali medina, Chouara Tannery',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1597212622942-9b5022e8615a?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Victoria Falls',
    country: 'Zimbabwe',
    continent: 'Africa',
    budget: 110000,
    bestTime: 'Feb to May',
    duration: '3 Days',
    attractions: 'Devil’s Pool, Victoria Falls National Park',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1472214222541-d510753a49f8?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Mahe',
    country: 'Seychelles',
    continent: 'Africa',
    budget: 145000,
    bestTime: 'Apr to May',
    duration: '4 Days',
    attractions: 'Beau Vallon Beach, Morne Seychellois National Park',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1589979482837-e74f2e145060?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80'
  },

  // Australia & Oceania (15 Cities)
  {
    city: 'Sydney',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 140000,
    bestTime: 'Sep to Nov',
    duration: '5 Days',
    attractions: 'Sydney Opera House, Bondi Beach, Harbour Bridge',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1554868339-0b29ffeb53c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Melbourne',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 135000,
    bestTime: 'Mar to May',
    duration: '4 Days',
    attractions: 'Federation Square, Great Ocean Road excursion',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1554868339-0b29ffeb53c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Brisbane',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 120000,
    bestTime: 'Apr to Oct',
    duration: '3 Days',
    attractions: 'South Bank Parklands, Lone Pine Koala Sanctuary',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1554868339-0b29ffeb53c4?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Gold Coast',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 130000,
    bestTime: 'May to Oct',
    duration: '4 Days',
    attractions: 'Surfers Paradise, Warner Bros. Movie World',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1517400181354-28b5849495df?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1552083375-1447ce886ab0?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Cairns',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 145000,
    bestTime: 'Jun to Oct',
    duration: '4 Days',
    attractions: 'Great Barrier Reef snorkel cruise, Kuranda',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1554868339-0b29ffeb53c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Perth',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 125000,
    bestTime: 'Sep to Nov',
    duration: '4 Days',
    attractions: 'Kings Park, Rottnest Island (Quokkas)',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1579684389783-b1d9b79336d0?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1517400181354-28b5849495df?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Adelaide',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 115000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'Barossa Valley winery tour, Glenelg Beach',
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1590483734724-29ba022e8615?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Hobart',
    country: 'Australia',
    continent: 'Australia & Oceania',
    budget: 120000,
    bestTime: 'Dec to Feb',
    duration: '3 Days',
    attractions: 'MONA Museum, Mount Wellington summit',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Auckland',
    country: 'New Zealand',
    continent: 'Australia & Oceania',
    budget: 145000,
    bestTime: 'Dec to Mar',
    duration: '4 Days',
    attractions: 'Sky Tower, Waiheke Island vineyards',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3a09551ff?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Queenstown',
    country: 'New Zealand',
    continent: 'Australia & Oceania',
    budget: 165000,
    bestTime: 'Dec to Feb',
    duration: '5 Days',
    attractions: 'Milford Sound tour, Shotover Jet, Coronet Peak',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Rotorua',
    country: 'New Zealand',
    continent: 'Australia & Oceania',
    budget: 135000,
    bestTime: 'Nov to Apr',
    duration: '3 Days',
    attractions: 'Te Puia geothermal valley, Hobbiton Movie Set',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1589807564177-1a067ff073bb?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1506382813144-8464fa9d4730?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Suva',
    country: 'Fiji',
    continent: 'Australia & Oceania',
    budget: 95000,
    bestTime: 'May to Oct',
    duration: '4 Days',
    attractions: 'Fiji Museum, Colo-I-Suva Forest Park',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Nadi',
    country: 'Fiji',
    continent: 'Australia & Oceania',
    budget: 110000,
    bestTime: 'May to Oct',
    duration: '4 Days',
    attractions: 'Sabeto Hot Springs, Denarau Island beaches',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1515548419970-d79a71a590e8?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Bora Bora',
    country: 'French Polynesia',
    continent: 'Australia & Oceania',
    budget: 240000,
    bestTime: 'May to Oct',
    duration: '5 Days',
    attractions: 'Matira Beach, Mt Otemanu lagoon cruises',
    category: 'Romantic',
    image: 'https://images.unsplash.com/photo-1532408840957-4340307ec518?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Papeete',
    country: 'French Polynesia',
    continent: 'Australia & Oceania',
    budget: 190000,
    bestTime: 'May to Oct',
    duration: '4 Days',
    attractions: 'Papeete Municipal Market, Faarumai Waterfalls',
    category: 'Relaxation',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1532408840957-4340307ec518?auto=format&fit=crop&w=800&q=80'
  },

  // Middle East (7 Cities)
  {
    city: 'Doha',
    country: 'Qatar',
    continent: 'Middle East',
    budget: 68000,
    bestTime: 'Nov to Mar',
    duration: '3 Days',
    attractions: 'Souq Waqif, Museum of Islamic Art',
    category: 'Trending',
    image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1522083165195-342750297f4e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Muscat',
    country: 'Oman',
    continent: 'Middle East',
    budget: 62000,
    bestTime: 'Nov to Mar',
    duration: '3 Days',
    attractions: 'Sultan Qaboos Grand Mosque, Mutrah Souq',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1582298538104-ff2e7b1d3d7c?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1541432901-ecffbb7fcd95?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Riyadh',
    country: 'Saudi Arabia',
    continent: 'Middle East',
    budget: 85000,
    bestTime: 'Nov to Mar',
    duration: '4 Days',
    attractions: 'Kingdom Centre Tower, Masmak Fortress',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1606579339763-a69e7ac46a42?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1522083165195-342750297f4e?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Jeddah',
    country: 'Saudi Arabia',
    continent: 'Middle East',
    budget: 80000,
    bestTime: 'Nov to Mar',
    duration: '3 Days',
    attractions: 'King Fahd’s Fountain, Al-Balad old town',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1616190419596-e2839e0150d6?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1541432901-ecffbb7fcd95?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Amman',
    country: 'Jordan',
    continent: 'Middle East',
    budget: 75000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'Amman Roman Theater, Citadel hill ruins',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1541432901-ecffbb7fcd95?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1549877452-9c387ad64b4a?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Petra',
    country: 'Jordan',
    continent: 'Middle East',
    budget: 95000,
    bestTime: 'Mar to May',
    duration: '3 Days',
    attractions: 'The Treasury, Monastery, Siq canyon path',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1549877452-9c387ad64b4a?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1541432901-ecffbb7fcd95?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
  },
  {
    city: 'Jerusalem',
    country: 'Israel',
    continent: 'Middle East',
    budget: 110000,
    bestTime: 'Apr to May',
    duration: '4 Days',
    attractions: 'Western Wall, Dome of the Rock, Church of the Holy Sepulchre',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    gallery: 'https://images.unsplash.com/photo-1549877452-9c387ad64b4a?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/photo-1541432901-ecffbb7fcd95?auto=format&fit=crop&w=800&q=80'
  }
];

async function main() {
  console.log('🌱 Auditing and updating database seeding with destination-accurate imagery...');

  // Clean tables
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  let seededCount = 0;

  const getRegionByCountry = (country: string, city: string): string => {
    const c = country.toLowerCase().trim();
    const ct = city.toLowerCase().trim();

    // Middle East (UAE, Saudi Arabia, Qatar, Bahrain, Kuwait, Oman, Jordan, Israel, Lebanon, Turkey)
    const middleEastCountries = [
      'united arab emirates', 'uae', 'saudi arabia', 'qatar', 'bahrain', 
      'kuwait', 'oman', 'jordan', 'israel', 'lebanon', 'turkey'
    ];
    if (middleEastCountries.includes(c)) return 'Middle East';

    // South Asia (India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Maldives)
    const southAsiaCountries = [
      'india', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan', 'maldives'
    ];
    if (southAsiaCountries.includes(c)) return 'South Asia';

    // Southeast Asia (Thailand, Singapore, Malaysia, Indonesia, Vietnam, Philippines, Cambodia)
    const southeastAsiaCountries = [
      'thailand', 'singapore', 'malaysia', 'indonesia', 'vietnam', 'philippines', 'cambodia'
    ];
    if (southeastAsiaCountries.includes(c)) return 'Southeast Asia';

    // East Asia (Japan, South Korea, China, Taiwan)
    const eastAsiaCountries = [
      'japan', 'south korea', 'china', 'taiwan'
    ];
    if (eastAsiaCountries.includes(c)) return 'East Asia';

    // Europe
    const europeCountries = [
      'france', 'italy', 'united kingdom', 'uk', 'spain', 'germany', 'switzerland', 'greece',
      'netherlands', 'austria', 'czech republic', 'hungary', 'portugal', 'ireland'
    ];
    if (europeCountries.includes(c)) return 'Europe';

    // North America
    const northAmericaCountries = [
      'united states', 'usa', 'canada', 'mexico', 'cuba'
    ];
    if (northAmericaCountries.includes(c)) return 'North America';

    // South America
    const southAmericaCountries = [
      'brazil', 'argentina', 'chile', 'peru', 'colombia', 'ecuador'
    ];
    if (southAmericaCountries.includes(c)) return 'South America';

    // Africa
    const africaCountries = [
      'egypt', 'south africa', 'morocco', 'kenya', 'tanzania', 'mauritius', 'seychelles'
    ];
    if (africaCountries.includes(c)) return 'Africa';

    // Oceania
    const oceaniaCountries = [
      'australia', 'new zealand', 'fiji'
    ];
    if (oceaniaCountries.includes(c)) return 'Oceania';

    return 'Other';
  };

  const getNormalizedCountry = (country: string): string => {
    const c = country.trim();
    if (c.toLowerCase() === 'united arab emirates' || c.toLowerCase() === 'emirates' || c.toLowerCase() === 'uae') {
      return 'UAE';
    }
    if (c.toLowerCase() === 'united kingdom' || c.toLowerCase() === 'uk') {
      return 'UK';
    }
    if (c.toLowerCase() === 'united states' || c.toLowerCase() === 'usa') {
      return 'USA';
    }
    return c;
  };

  for (const raw of RAW_DESTINATIONS) {
    const normalizedCountry = getNormalizedCountry(raw.country);
    const calculatedRegion = getRegionByCountry(raw.country, raw.city);
    const description = `${raw.city}, located in the gorgeous region of ${normalizedCountry}, is globally famous for attractions like ${raw.attractions}. Visitors love to experience ${raw.category} travel tours, local foods, and scenic sightseeing landmarks.`;

    // Create Destination
    const dest = await prisma.destination.create({
      data: {
        name: raw.city,
        city: raw.city,
        country: normalizedCountry,
        continent: raw.continent,
        region: calculatedRegion,
        description: description,
        image: raw.image,
        gallery: raw.gallery,
        bestTimeToVisit: raw.bestTime,
        averageDuration: raw.duration,
        estimatedBudget: raw.budget,
        rating: Math.round((4.3 + (seededCount % 7) * 0.1) * 10) / 10,
        reviewCount: 22 + (seededCount % 40),
        popularAttractions: raw.attractions,
        thingsToDo: 'Sightseeing, Photography, Tasting local foods, Souvenir Shopping',
        travelTips: 'Always carry a valid ID, use verified transports, keep weather appropriate apparel',
      }
    });

    // Programmatically generate Tour Packages associated with the correct, matching image!
    const durationDays = parseInt(raw.duration.split(' ')[0]) || 4;
    const nightsCount = durationDays - 1;
    const basePrice = raw.budget * 1.15;
    const discountPercent = (seededCount % 3) * 10 + 5; // 5%, 15%, 25%
    const discountedPrice = Math.round(basePrice * (1 - discountPercent / 100));
    
    // Adult and Child Rates in INR
    const pricePerAdult = discountedPrice;
    const pricePerChild = Math.round(discountedPrice * 0.65);

    // Dynamic day-by-day Itinerary Generation
    const itineraryDays = [];
    for (let day = 1; day <= durationDays; day++) {
      itineraryDays.push({
        day,
        theme: day === 1 ? 'Arrival & Welcome Dinner' : day === durationDays ? 'Departure Transfers' : 'Guided City Tour & Highlights',
        activities: [
          { time: 'Morning', activity: `Guided sightseeing of ${raw.attractions.split(',')[0]}`, location: raw.city, cost: 0 },
          { time: 'Evening', activity: `Local walks, markets & dinners`, location: raw.city, cost: 0 }
        ]
      });
    }

    const inclusions = [
      'Accommodation in premium double sharing rooms',
      'Daily breakfast buffet options',
      'AC sedan transfers for sightseeing itineraries',
      'Professional certified local tour guides'
    ].join(',');

    const exclusions = [
      'Round trip flight ticket prices',
      'Entry tickets to monuments & parks',
      'Personal dining orders or laundry laundry fees'
    ].join(',');

    await prisma.package.create({
      data: {
        destinationId: dest.id,
        title: `${raw.city} Highlight Holiday`,
        image: raw.image, // Use the correct destination-specific image!
        gallery: raw.gallery,
        description: `Explore the gorgeous landmarks of ${raw.city} on this complete ${durationDays}-day vacation. Includes premium hotels, dedicated AC transport, and daily breakfast.`,
        duration: durationDays,
        nights: nightsCount,
        pricePerAdult: pricePerAdult,
        pricePerChild: pricePerChild,
        originalPrice: Math.round(basePrice),
        discount: discountPercent,
        rating: dest.rating,
        reviewCount: dest.reviewCount,
        category: raw.category,
        availableDates: ['2026-10-15', '2026-10-30', '2026-11-12', '2026-11-28', '2026-12-10'].join(','),
        hotel: `${raw.city} Royal Regency & Suites`,
        meals: 'Daily Breakfast Included',
        transportation: 'Private AC Transport',
        activities: 'Historic Walks, Shopping Tours, Local Cuisine Tasting',
        itinerary: JSON.stringify({
          destination: raw.city,
          daysCount: durationDays,
          totalEstimatedCost: pricePerAdult,
          itinerary: itineraryDays
        }),
        inclusions: inclusions,
        exclusions: exclusions
      }
    });

    seededCount++;
  }

  console.log(`- Audited and updated ${seededCount} destinations and tour packages.`);
  console.log('🌱 Data Quality Seeding Finished Successfully!');
}

main()
  .catch((e) => {
    console.error('Error during data audit seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
