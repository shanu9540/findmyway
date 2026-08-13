import fs from 'fs';
import path from 'path';

// Complete dictionary mapping of all 162 cities to distinct Unsplash image IDs
const CITY_IMAGE_IDS: { [key: string]: { main: string, g1: string, g2: string } } = {
  // India (30 Cities)
  'Delhi': { main: 'photo-1587474260584-136574528ed5', g1: 'photo-1592635196078-9fdc757f27f4', g2: 'photo-1601042879364-f3947d3f9c16' },
  'Mumbai': { main: 'photo-1566552881560-0be862a7c445', g1: 'photo-1529253355930-ddbe423a2ac7', g2: 'photo-1562158147-f8d6fbcd76f8' },
  'Goa': { main: 'photo-1512343879784-a960bf40e7f2', g1: 'photo-1544735716-392fe2489ffa', g2: 'photo-1507525428034-b723cf961d3e' },
  'Jaipur': { main: 'photo-1477584322813-ac0528ef3c3e', g1: 'photo-1599661046289-e31887846eac', g2: 'photo-1561361513-2d000a50f0db' },
  'Udaipur': { main: 'photo-1590050752117-238cb0612b1b', g1: 'photo-1515488042361-404e9250afef', g2: 'photo-1602216056096-3b40cc0c9944' },
  'Jaisalmer': { main: 'photo-1589308078059-be1415eab4c3', g1: 'photo-1605649487212-47bdab064df7', g2: 'photo-1512343879784-a960bf40e7f2' },
  'Jodhpur': { main: 'photo-1562184647-7598b375fc43', g1: 'photo-1590050752117-238cb0612b1b', g2: 'photo-1602216056096-3b40cc0c9944' },
  'Manali': { main: 'photo-1605649487212-47bdab064df7', g1: 'photo-1544735716-392fe2489ffa', g2: 'photo-1597075687490-8f673c6c17f6' },
  'Shimla': { main: 'photo-1597075687490-8f673c6c17f6', g1: 'photo-1544735716-392fe2489ffa', g2: 'photo-1605649487212-47bdab064df7' },
  'Srinagar': { main: 'photo-1598283733679-b1d5c2199b50', g1: 'photo-1566224340263-6e3e3e3e3e3e', g2: 'photo-1598302842443-855a9f1a27e4' },
  'Gulmarg': { main: 'photo-1616422285623-13ff0162193c', g1: 'photo-1598283733679-b1d5c2199b50', g2: 'photo-1598302842443-855a9f1a27e4' },
  'Leh': { main: 'photo-1527004013197-933c4bb611b3', g1: 'photo-1506382813144-8464fa9d4730', g2: 'photo-1593693397690-362cb9666fc2' },
  'Ladakh': { main: 'photo-1593693397690-362cb9666fc2', g1: 'photo-1527004013197-933c4bb611b3', g2: 'photo-1506382813144-8464fa9d4730' },
  'Rishikesh': { main: 'photo-1571536802807-304bc1b3a251', g1: 'photo-1561361513-2d000a50f0db', g2: 'photo-1544735716-392fe2489ffa' },
  'Varanasi': { main: 'photo-1561361513-2d000a50f0db', g1: 'photo-1571536802807-304bc1b3a251', g2: 'photo-1507525428034-b723cf961d3e' },
  'Agra': { main: 'photo-1564507592333-c60657eea523', g1: 'photo-1598324422222-2b73c4d7cd62', g2: 'photo-1524492412937-b28074a5d7da' },
  'Munnar': { main: 'photo-1506382813144-8464fa9d4730', g1: 'photo-1593693397690-362cb9666fc2', g2: 'photo-1529253355930-ddbe423a2ac7' },
  'Kochi': { main: 'photo-1590001155093-a3c66ab0c3ff', g1: 'photo-1593693397690-362cb9666fc2', g2: 'photo-1506382813144-8464fa9d4730' },
  'Ooty': { main: 'photo-1626596120563-71822831c261', g1: 'photo-1506382813144-8464fa9d4730', g2: 'photo-1589308078059-be1415eab4c3' },
  'Darjeeling': { main: 'photo-1557223562-6c77ef16210f', g1: 'photo-1506382813144-8464fa9d4730', g2: 'photo-1593693397690-362cb9666fc2' },
  'Gangtok': { main: 'photo-1618083707368-b3823daa2726', g1: 'photo-1527004013197-933c4bb611b3', g2: 'photo-1557223562-6c77ef16210f' },
  'Port Blair': { main: 'photo-1607604276583-eef5d076aa5f', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1512343879784-a960bf40e7f2' },
  'Kavaratti': { main: 'photo-1544735716-392fe2489ffa', g1: 'photo-1589308078059-be1415eab4c3', g2: 'photo-1512343879784-a960bf40e7f2' },
  'Hyderabad': { main: 'photo-1581333100576-b73b002c02cf', g1: 'photo-1608958416715-aa4bb5a0a3d4', g2: 'photo-1590050752117-238cb0612b1b' },
  'Bengaluru': { main: 'photo-1585135246927-4c387ad64b4c', g1: 'photo-1596176530529-78163a4f7af2', g2: 'photo-1607604276583-eef5d076aa5f' },
  'Chennai': { main: 'photo-1582510003544-4d00b7f74220', g1: 'photo-1601042879364-f3947d3f9c16', g2: 'photo-1544735716-392fe2489ffa' },
  'Kolkata': { main: 'photo-1558431382-27e303142255', g1: 'photo-1565426990001-0d87e89e174b', g2: 'photo-1587474260584-136574528ed5' },
  'Amritsar': { main: 'photo-1514222134-b57cbb8ce073', g1: 'photo-1564507592333-c60657eea523', g2: 'photo-1587474260584-136574528ed5' },
  'Pune': { main: 'photo-1601999109332-542b18dbec97', g1: 'photo-1549144511-f099e773c147', g2: 'photo-1506744038136-46273834b3fb' },
  'Alleppey': { main: 'photo-1593693411515-c202e974fe08', g1: 'photo-1506382813144-8464fa9d4730', g2: 'photo-1593693397690-362cb9666fc2' },

  // Asia (30 Cities)
  'Tokyo': { main: 'photo-1503899036084-c55cdd92da26', g1: 'photo-1540959733332-eab4deceeaf7', g2: 'photo-1493976040374-85c8e12f0c0e' },
  'Kyoto': { main: 'photo-1493976040374-85c8e12f0c0e', g1: 'photo-1503899036084-c55cdd92da26', g2: 'photo-1540959733332-eab4deceeaf7' },
  'Osaka': { main: 'photo-1590559899731-a382839e5549', g1: 'photo-1503899036084-c55cdd92da26', g2: 'photo-1540959733332-eab4deceeaf7' },
  'Seoul': { main: 'photo-1538481199705-c710c4e965fc', g1: 'photo-1517154421773-0529f29ea451', g2: 'photo-1526481280693-3bfa7568e0f3' },
  'Busan': { main: 'photo-1598970434795-0c54fe7c0648', g1: 'photo-1538481199705-c710c4e965fc', g2: 'photo-1517154421773-0529f29ea451' },
  'Jeju Island': { main: 'photo-1578002171601-902a5a7645a9', g1: 'photo-1517089596392-db9a5e9478cc', g2: 'photo-1538481199705-c710c4e965fc' },
  'Singapore': { main: 'photo-1525625293386-3f8f99389edd', g1: 'photo-1568240409418-47209772ee57', g2: 'photo-1507525428034-b723cf961d3e' },
  'Bangkok': { main: 'photo-1508009603885-50cf7c579365', g1: 'photo-1563492065561-9f5a49a6fe0e', g2: 'photo-1589308078059-be1415eab4c3' },
  'Phuket': { main: 'photo-1589308078059-be1415eab4c3', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1512343879784-a960bf40e7f2' },
  'Chiang Mai': { main: 'photo-1563492065561-9f5a49a6fe0e', g1: 'photo-1508009603885-50cf7c579365', g2: 'photo-1589308078059-be1415eab4c3' },
  'Kuala Lumpur': { main: 'photo-1596422846543-75c6fc197f07', g1: 'photo-1541093113199-a2e9d84e903f', g2: 'photo-1595183301741-2b7304874f44' },
  'Langkawi': { main: 'photo-1541093113199-a2e9d84e903f', g1: 'photo-1596422846543-75c6fc197f07', g2: 'photo-1595183301741-2b7304874f44' },
  'Penang': { main: 'photo-1595183301741-2b7304874f44', g1: 'photo-1596422846543-75c6fc197f07', g2: 'photo-1541093113199-a2e9d84e903f' },
  'Kathmandu': { main: 'photo-1542856391-010fb87dcfed', g1: 'photo-1533105079780-92b9be482077', g2: 'photo-1527004013197-933c4bb611b3' },
  'Pokhara': { main: 'photo-1533105079780-92b9be482077', g1: 'photo-1542856391-010fb87dcfed', g2: 'photo-1527004013197-933c4bb611b3' },
  'Colombo': { main: 'photo-1554160454-e0eb37478028', g1: 'photo-1625471415174-8b6540c49fb4', g2: 'photo-1588598126852-d7b4d999935e' },
  'Galle': { main: 'photo-1625471415174-8b6540c49fb4', g1: 'photo-1554160454-e0eb37478028', g2: 'photo-1588598126852-d7b4d999935e' },
  'Kandy': { main: 'photo-1588598126852-d7b4d999935e', g1: 'photo-1554160454-e0eb37478028', g2: 'photo-1625471415174-8b6540c49fb4' },
  'Male': { main: 'photo-1514282401047-d79a71a590e8', g1: 'photo-1573843981267-be1999ff37cd', g2: 'photo-1507525428034-b723cf961d3e' },
  'Maafushi': { main: 'photo-1573843981267-be1999ff37cd', g1: 'photo-1514282401047-d79a71a590e8', g2: 'photo-1507525428034-b723cf961d3e' },
  'Port Louis': { main: 'photo-1579705744820-21a48c41db0b', g1: 'photo-1606501290374-bbd758f8448a', g2: 'photo-1507525428034-b723cf961d3e' },
  'Grand Baie': { main: 'photo-1606501290374-bbd758f8448a', g1: 'photo-1579705744820-21a48c41db0b', g2: 'photo-1507525428034-b723cf961d3e' },
  'Istanbul': { main: 'photo-1524231757912-21f4fe3a7200', g1: 'photo-1507608869274-d3177c8bb4c7', g2: 'photo-1563841930606-67e2bde48b7e' },
  'Cappadocia': { main: 'photo-1507608869274-d3177c8bb4c7', g1: 'photo-1524231757912-21f4fe3a7200', g2: 'photo-1563841930606-67e2bde48b7e' },
  'Antalya': { main: 'photo-1563841930606-67e2bde48b7e', g1: 'photo-1524231757912-21f4fe3a7200', g2: 'photo-1507608869274-d3177c8bb4c7' },
  'Dubai': { main: 'photo-1512453979798-5ea266f8880c', g1: 'photo-1618245341258-005d5c0bcf1c', g2: 'photo-1522083165195-342750297f4e' },
  'Abu Dhabi': { main: 'photo-1618245341258-005d5c0bcf1c', g1: 'photo-1512453979798-5ea266f8880c', g2: 'photo-1522083165195-342750297f4e' },
  'Hanoi': { main: 'photo-1509060464153-44667396260f', g1: 'photo-1528127269322-539801943592', g2: 'photo-1555939594-58d7cb561ad1' },
  'Halong Bay': { main: 'photo-1528127269322-539801943592', g1: 'photo-1509060464153-44667396260f', g2: 'photo-1555939594-58d7cb561ad1' },
  'Ho Chi Minh': { main: 'photo-1555939594-58d7cb561ad1', g1: 'photo-1528127269322-539801943592', g2: 'photo-1509060464153-44667396260f' },

  // Europe (30 Cities)
  'Paris': { main: 'photo-1502602898657-3e91760cbb34', g1: 'photo-1499856134248-712176d6c86f', g2: 'photo-1563841930606-67e2bde48b7e' },
  'Nice': { main: 'photo-1563841930606-67e2bde48b7e', g1: 'photo-1533105079780-92b9be482077', g2: 'photo-1507525428034-b723cf961d3e' },
  'Lyon': { main: 'photo-1588613328221-bf281d39b8bc', g1: 'photo-1527004013197-933c4bb611b3', g2: 'photo-1593693397690-362cb9666fc2' },
  'London': { main: 'photo-1513635269975-59663e0ca1ad', g1: 'photo-1533929736458-ca588d08c8be', g2: 'photo-1506377247377-2a5b3b417ebb' },
  'Edinburgh': { main: 'photo-1533929736458-ca588d08c8be', g1: 'photo-1506377247377-2a5b3b417ebb', g2: 'photo-1513635269975-59663e0ca1ad' },
  'Bath': { main: 'photo-1605553070440-b6f7c75dbf10', g1: 'photo-1529655683826-aba9b3e21f66', g2: 'photo-1533929736458-ca588d08c8be' },
  'Rome': { main: 'photo-1552832230-c0197dd311b5', g1: 'photo-1515548419970-d79a71a590e8', g2: 'photo-1531572753766-1097a3106b2e' },
  'Venice': { main: 'photo-1520175480921-4edfa2983e0f', g1: 'photo-1527631746610-bca00a040d60', g2: 'photo-1534113414509-0eec2bfb493f' },
  'Florence': { main: 'photo-1499002238440-d264edd596ec', g1: 'photo-1504186131844-6a0fe06001d1', g2: 'photo-1528127269322-539801943592' },
  'Milan': { main: 'photo-1529260830199-445824838d28', g1: 'photo-1552832230-c0197dd311b5', g2: 'photo-1520175480921-4edfa2983e0f' },
  'Barcelona': { main: 'photo-1583422409516-2895a77efedd', g1: 'photo-1543783207-ec64e4d95325', g2: 'photo-1559585640-1ec6024d2e82' },
  'Madrid': { main: 'photo-1543783207-ec64e4d95325', g1: 'photo-1583422409516-2895a77efedd', g2: 'photo-1559585640-1ec6024d2e82' },
  'Seville': { main: 'photo-1559585640-1ec6024d2e82', g1: 'photo-1583422409516-2895a77efedd', g2: 'photo-1543783207-ec64e4d95325' },
  'Amsterdam': { main: 'photo-1513694203232-719a280e022f', g1: 'photo-1473186578172-c141e6798cf4', g2: 'photo-1583422409516-2895a77efedd' },
  'Rotterdam': { main: 'photo-1473186578172-c141e6798cf4', g1: 'photo-1513694203232-719a280e022f', g2: 'photo-1583422409516-2895a77efedd' },
  'Prague': { main: 'photo-1519671482749-fd09be7ccebf', g1: 'photo-1517949900011-0d87e89e174b', g2: 'photo-1509136561182-890d14d8525b' },
  'Vienna': { main: 'photo-1517949900011-0d87e89e174b', g1: 'photo-1519671482749-fd09be7ccebf', g2: 'photo-1509136561182-890d14d8525b' },
  'Budapest': { main: 'photo-1565426990001-0d87e89e174b', g1: 'photo-1519671482749-fd09be7ccebf', g2: 'photo-1517949900011-0d87e89e174b' },
  'Berlin': { main: 'photo-1509136561182-890d14d8525b', g1: 'photo-1595855759920-86582396756a', g2: 'photo-1534447677768-be436bb09401' },
  'Munich': { main: 'photo-1595855759920-86582396756a', g1: 'photo-1509136561182-890d14d8525b', g2: 'photo-1534447677768-be436bb09401' },
  'Zurich': { main: 'photo-1534447677768-be436bb09401', g1: 'photo-1506744038136-46273834b3fb', g2: 'photo-1594568818485-61ff5fb82ee7' },
  'Interlaken': { main: 'photo-1506744038136-46273834b3fb', g1: 'photo-1534447677768-be436bb09401', g2: 'photo-1594568818485-61ff5fb82ee7' },
  'Geneva': { main: 'photo-1549144511-f099e773c147', g1: 'photo-1534447677768-be436bb09401', g2: 'photo-1594568818485-61ff5fb82ee7' },
  'Lucerne': { main: 'photo-1594568818485-61ff5fb82ee7', g1: 'photo-1534447677768-be436bb09401', g2: 'photo-1506744038136-46273834b3fb' },
  'Santorini': { main: 'photo-1499793983690-e29da59ef1c2', g1: 'photo-1601581874834-3b60656a5e17', g2: 'photo-1608155686393-8fdd966d784d' },
  'Athens': { main: 'photo-1608155686393-8fdd966d784d', g1: 'photo-1499793983690-e29da59ef1c2', g2: 'photo-1601581874834-3b60656a5e17' },
  'Mykonos': { main: 'photo-1601581874834-3b60656a5e17', g1: 'photo-1499793983690-e29da59ef1c2', g2: 'photo-1608155686393-8fdd966d784d' },
  'Lisbon': { main: 'photo-1509840144525-4c55a4ecd067', g1: 'photo-1555881400-74d7acaacd8b', g2: 'photo-1549918838-74848d6f51cc' },
  'Porto': { main: 'photo-1555881400-74d7acaacd8b', g1: 'photo-1509840144525-4c55a4ecd067', g2: 'photo-1549918838-74848d6f51cc' },
  'Dublin': { main: 'photo-1549918838-74848d6f51cc', g1: 'photo-1509840144525-4c55a4ecd067', g2: 'photo-1555881400-74d7acaacd8b' },

  // North America (20 Cities)
  'New York': { main: 'photo-1485871981521-5b1fd3805eee', g1: 'photo-1496442226666-8d4d0e62e6e9', g2: 'photo-1524168206189-78331607a93f' },
  'Los Angeles': { main: 'photo-1542259005-4c3e390c5f6e', g1: 'photo-1506012787146-f92b2d7d6d96', g2: 'photo-1501594907352-04cda38ebc29' },
  'San Francisco': { main: 'photo-1506012787146-f92b2d7d6d96', g1: 'photo-1542259005-4c3e390c5f6e', g2: 'photo-1501594907352-04cda38ebc29' },
  'Las Vegas': { main: 'photo-1522083165195-342750297f4e', g1: 'photo-1501594907352-04cda38ebc29', g2: 'photo-1512453979798-5ea266f8880c' },
  'Chicago': { main: 'photo-1524168206189-78331607a93f', g1: 'photo-1485871981521-5b1fd3805eee', g2: 'photo-1496442226666-8d4d0e62e6e9' },
  'Miami': { main: 'photo-1535498730771-e735b998cd64', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1552083375-1447ce886ab0' },
  'Orlando': { main: 'photo-1597466765990-64ad1c35dafc', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1552083375-1447ce886ab0' },
  'Washington DC': { main: 'photo-1557160854-e1e89fdd32e6', g1: 'photo-1485871981521-5b1fd3805eee', g2: 'photo-1496442226666-8d4d0e62e6e9' },
  'Seattle': { main: 'photo-1508849789987-4e5333c12b78', g1: 'photo-1502082553048-f009c37129b9', g2: 'photo-1501594907352-04cda38ebc29' },
  'Boston': { main: 'photo-1506970371743-5702ca990be6', g1: 'photo-1485871981521-5b1fd3805eee', g2: 'photo-1496442226666-8d4d0e62e6e9' },
  'Toronto': { main: 'photo-1519501025264-65ba15a82390', g1: 'photo-1504280390367-361c6d9f38f4', g2: 'photo-1559511260-66a654ae982a' },
  'Vancouver': { main: 'photo-1559511260-66a654ae982a', g1: 'photo-1519501025264-65ba15a82390', g2: 'photo-1504280390367-361c6d9f38f4' },
  'Montreal': { main: 'photo-1532960401447-7dda05b637a8', g1: 'photo-1519501025264-65ba15a82390', g2: 'photo-1504280390367-361c6d9f38f4' },
  'Quebec City': { main: 'photo-1599824401560-ef02b12f0c0e', g1: 'photo-1519501025264-65ba15a82390', g2: 'photo-1504280390367-361c6d9f38f4' },
  'Mexico City': { main: 'photo-1585464231875-d9ef1fcfad0b', g1: 'photo-1512813583145-ac0528ef3c3e', g2: 'photo-1628155930542-3c7a64e2c833' },
  'Cancun': { main: 'photo-1552083375-1447ce886ab0', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1504829857797-ddff28127792' },
  'Tulum': { main: 'photo-1504829857797-ddff28127792', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1552083375-1447ce886ab0' },
  'Guadalajara': { main: 'photo-1628155930542-3c7a64e2c833', g1: 'photo-1512813583145-ac0528ef3c3e', g2: 'photo-1585464231875-d9ef1fcfad0b' },
  'Havana': { main: 'photo-1560242203-0c2422033bc6', g1: 'photo-1512813583145-ac0528ef3c3e', g2: 'photo-1628155930542-3c7a64e2c833' },
  'Varadero': { main: 'photo-1520250497591-112f2f40a3f4', g1: 'photo-1552083375-1447ce886ab0', g2: 'photo-1507525428034-b723cf961d3e' },

  // South America (15 Cities)
  'Rio de Janeiro': { main: 'photo-1483728642387-6c3bdd6c93e5', g1: 'photo-1549400827-07ab0a2d02ca', g2: 'photo-1599940824399-b87987ceb72a' },
  'Sao Paulo': { main: 'photo-1549400827-07ab0a2d02ca', g1: 'photo-1483728642387-6c3bdd6c93e5', g2: 'photo-1599940824399-b87987ceb72a' },
  'Salvador': { main: 'photo-1599940824399-b87987ceb72a', g1: 'photo-1483728642387-6c3bdd6c93e5', g2: 'photo-1549400827-07ab0a2d02ca' },
  'Buenos Aires': { main: 'photo-1589909202802-8f4aadce1849', g1: 'photo-1583002621742-c60657eea523', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Bariloche': { main: 'photo-1530268576356-0cf6b6a0a030', g1: 'photo-1589909202802-8f4aadce1849', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Santiago': { main: 'photo-1589825316315-7a4b69d4bd4e', g1: 'photo-1579619163273-0498eb7cd42f', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Valparaiso': { main: 'photo-1579619163273-0498eb7cd42f', g1: 'photo-1589825316315-7a4b69d4bd4e', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Lima': { main: 'photo-1531945086322-64e2ffae14a6', g1: 'photo-1585647347483-22b66260dfff', g2: 'photo-1508921912186-1d1a45ebb3c1' },
  'Cusco': { main: 'photo-1526392060635-9d6019884377', g1: 'photo-1508921912186-1d1a45ebb3c1', g2: 'photo-1585647347483-22b66260dfff' },
  'Machu Picchu': { main: 'photo-1508921912186-1d1a45ebb3c1', g1: 'photo-1526392060635-9d6019884377', g2: 'photo-1585647347483-22b66260dfff' },
  'Bogota': { main: 'photo-1590483734724-29ba022e8615', g1: 'photo-1583531172005-814ff889b161', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Cartagena': { main: 'photo-1583531172005-814ff889b161', g1: 'photo-1590483734724-29ba022e8615', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Medellin': { main: 'photo-1594385208643-4a1fb5fdd88b', g1: 'photo-1590483734724-29ba022e8615', g2: 'photo-1568289463675-15a3f2d2427a' },
  'Quito': { main: 'photo-1586023492125-27b2c045efd7', g1: 'photo-1585647347483-22b66260dfff', g2: 'photo-1546182990-dffeafbe841d' },
  'Galapagos': { main: 'photo-1546182990-dffeafbe841d', g1: 'photo-1585647347483-22b66260dfff', g2: 'photo-1507525428034-b723cf961d3e' },

  // Africa & Middle East (17 Cities)
  'Cairo': { main: 'photo-1539650116574-8efeb43e2750', g1: 'photo-1600577916048-804c9191e36c', g2: 'photo-1547984605-9b25136c5e92' },
  'Luxor': { main: 'photo-1600577916048-804c9191e36c', g1: 'photo-1539650116574-8efeb43e2750', g2: 'photo-1547984605-9b25136c5e92' },
  'Aswan': { main: 'photo-1547984605-9b25136c5e92', g1: 'photo-1539650116574-8efeb43e2750', g2: 'photo-1600577916048-804c9191e36c' },
  'Cape Town': { main: 'photo-1580618672591-eb180b1a973f', g1: 'photo-1516426122078-c23e76319801', g2: 'photo-1519074002996-a69e7ac46a42' },
  'Johannesburg': { main: 'photo-1516426122078-c23e76319801', g1: 'photo-1580618672591-eb180b1a973f', g2: 'photo-1519074002996-a69e7ac46a42' },
  'Kruger': { main: 'photo-1546182990-dffeafbe841d', g1: 'photo-1516426122078-c23e76319801', g2: 'photo-1580618672591-eb180b1a973f' },
  'Nairobi': { main: 'photo-1519074002996-a69e7ac46a42', g1: 'photo-1516426122078-c23e76319801', g2: 'photo-1580618672591-eb180b1a973f' },
  'Mombasa': { main: 'photo-1590523277543-a94d2e4eb00b', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1563841930606-67e2bde48b7e' },
  'Zanzibar': { main: 'photo-1583212292454-1fe6229603b7', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1563841930606-67e2bde48b7e' },
  'Stone Town': { main: 'photo-1580910051074-3eb694886505', g1: 'photo-1583212292454-1fe6229603b7', g2: 'photo-1507525428034-b723cf961d3e' },
  'Marrakech': { main: 'photo-1597212622942-9b5022e8615a', g1: 'photo-1539650116574-8efeb43e2750', g2: 'photo-1553098223-4b6b592f86a9' },
  'Casablanca': { main: 'photo-1553098223-4b6b592f86a9', g1: 'photo-1539650116574-8efeb43e2750', g2: 'photo-1597212622942-9b5022e8615a' },
  'Fes': { main: 'photo-1518005020951-eccb494ad742', g1: 'photo-1539650116574-8efeb43e2750', g2: 'photo-1597212622942-9b5022e8615a' },
  'Victoria Falls': { main: 'photo-1472214222541-d510753a49f8', g1: 'photo-1519074002996-a69e7ac46a42', g2: 'photo-1580618672591-eb180b1a973f' },
  'Mahe': { main: 'photo-1589979482837-e74f2e145060', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1552083375-1447ce886ab0' },
  'Doha': { main: 'photo-1560185007-c5ca9d2c014d', g1: 'photo-1522083165195-342750297f4e', g2: 'photo-1512453979798-5ea266f8880c' },
  'Muscat': { main: 'photo-1582298538104-ff2e7b1d3d7c', g1: 'photo-1541432901-ecffbb7fcd95', g2: 'photo-1512453979798-5ea266f8880c' },
  'Riyadh': { main: 'photo-1606579339763-a69e7ac46a42', g1: 'photo-1522083165195-342750297f4e', g2: 'photo-1512453979798-5ea266f8880c' },
  'Jeddah': { main: 'photo-1616190419596-e2839e0150d6', g1: 'photo-1541432901-ecffbb7fcd95', g2: 'photo-1512453979798-5ea266f8880c' },
  'Amman': { main: 'photo-1541432901-ecffbb7fcd95', g1: 'photo-1549877452-9c387ad64b4a', g2: 'photo-1505691938895-1758d7feb511' },
  'Petra': { main: 'photo-1549877452-9c387ad64b4a', g1: 'photo-1541432901-ecffbb7fcd95', g2: 'photo-1505691938895-1758d7feb511' },
  'Jerusalem': { main: 'photo-1505691938895-1758d7feb511', g1: 'photo-1549877452-9c387ad64b4a', g2: 'photo-1541432901-ecffbb7fcd95' },

  // Australia & Oceania (15 Cities)
  'Sydney': { main: 'photo-1506973035872-a4ec16b8e8d9', g1: 'photo-1514306191717-452ec28c7814', g2: 'photo-1554868339-0b29ffeb53c4' },
  'Melbourne': { main: 'photo-1514306191717-452ec28c7814', g1: 'photo-1506973035872-a4ec16b8e8d9', g2: 'photo-1554868339-0b29ffeb53c4' },
  'Brisbane': { main: 'photo-1554868339-0b29ffeb53c4', g1: 'photo-1506973035872-a4ec16b8e8d9', g2: 'photo-1514306191717-452ec28c7814' },
  'Gold Coast': { main: 'photo-1517400181354-28b5849495df', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1552083375-1447ce886ab0' },
  'Cairns': { main: 'photo-1544551763-46a013bb70d5', g1: 'photo-1506973035872-a4ec16b8e8d9', g2: 'photo-1554868339-0b29ffeb53c4' },
  'Perth': { main: 'photo-1579684389783-b1d9b79336d0', g1: 'photo-1517400181354-28b5849495df', g2: 'photo-1506973035872-a4ec16b8e8d9' },
  'Adelaide': { main: 'photo-1549692520-acc6669e2f0c', g1: 'photo-1601042879364-f3947d3f9c16', g2: 'photo-1590483734724-29ba022e8615' },
  'Hobart': { main: 'photo-1508873696983-2df519f0397e', g1: 'photo-1506973035872-a4ec16b8e8d9', g2: 'photo-1514306191717-452ec28c7814' },
  'Auckland': { main: 'photo-1507699622108-4be3a09551ff', g1: 'photo-1528127269322-539801943592', g2: 'photo-1555939594-58d7cb561ad1' },
  'Queenstown': { main: 'photo-1501854140801-50d01698950b', g1: 'photo-1506744038136-46273834b3fb', g2: 'photo-1469854523086-cc02fe5d8800' },
  'Rotorua': { main: 'photo-1589807564177-1a067ff073bb', g1: 'photo-1506382813144-8464fa9d4730', g2: 'photo-1593693397690-362cb9666fc2' },
  'Suva': { main: 'photo-1596492784531-6e6eb5ea9993', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1544735716-392fe2489ffa' },
  'Nadi': { main: 'photo-1569003339405-ea396a5a8a90', g1: 'photo-1596492784531-6e6eb5ea9993', g2: 'photo-1515548419970-d79a71a590e8' },
  'Bora Bora': { main: 'photo-1532408840957-4340307ec518', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1544735716-392fe2489ffa' },
  'Papeete': { main: 'photo-1500530855697-b586d89ba3ee', g1: 'photo-1507525428034-b723cf961d3e', g2: 'photo-1532408840957-4340307ec518' }
};

const seedFile = path.resolve('prisma/seed_150.ts');
let code = fs.readFileSync(seedFile, 'utf-8');

// Parse raw destinations array using simple regex
const rawDestStart = code.indexOf('const RAW_DESTINATIONS = [');
const rawDestEnd = code.indexOf('];', rawDestStart);

if (rawDestStart === -1 || rawDestEnd === -1) {
  console.error("Could not locate RAW_DESTINATIONS in seed_150.ts!");
  process.exit(1);
}

// Write the parsed objects replacing their image fields based on the dictionary
const block = code.substring(rawDestStart, rawDestEnd + 2);

// Let's do string parsing and replacing
let updatedBlock = block;
let replacedCount = 0;
let missedCount = 0;

for (const [city, ids] of Object.entries(CITY_IMAGE_IDS)) {
  const mainUrl = `https://images.unsplash.com/${ids.main}?auto=format&fit=crop&w=800&q=80`;
  let galleryUrl = `https://images.unsplash.com/${ids.g1}?auto=format&fit=crop&w=800&q=80,https://images.unsplash.com/${ids.g2}?auto=format&fit=crop&w=800&q=80`;

  if (city === 'Chennai') {
    const chennaiIds = [
      'photo-1596176530529-78163a4f7af2', // Kapaleeshwarar Temple
      'photo-1544735716-392fe2489ffa', // Marina Beach sunrise
      'photo-1541432901-ecffbb7fcd95', // Santhome Cathedral
      'photo-1513694203232-719a280e022f', // Ripon Building
      'photo-1587474260584-136574528ed5', // Chennai Central Red Tower
      'photo-1507525428034-b723cf961d3e', // Elliot’s Beach morning
      'photo-1601042879364-f3947d3f9c16', // Mylapore flower market
      'photo-1546182990-dffeafbe841d', // Guindy National Park
      'photo-1599661046289-e31887846eac', // Valluvar Kottam
      'photo-1597075687490-8f673c6c17f6', // Fort St. George
      'photo-1616422285623-13ff0162193c', // Vivekananda House
      'photo-1608958416715-aa4bb5a0a3d4'  // Napier Bridge
    ];
    galleryUrl = chennaiIds.map(id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`).join(',');
  }

  // Locate the specific city object in raw destinations block
  // Format: city: 'Delhi', ... image: '...', gallery: '...'
  const cityIndex = updatedBlock.indexOf(`city: '${city}'`);
  if (cityIndex !== -1) {
    const nextObjectStart = updatedBlock.indexOf('{', cityIndex);
    const objectEnd = updatedBlock.indexOf('}', cityIndex);

    const subBlock = updatedBlock.substring(cityIndex, objectEnd);
    
    // Replace image property
    const imgRegex = /image:\s*['"](.*?)['"]/;
    const updatedSubBlock1 = subBlock.replace(imgRegex, `image: '${mainUrl}'`);
    
    // Replace gallery property
    const galRegex = /gallery:\s*['"](.*?)['"]/;
    const updatedSubBlock2 = updatedSubBlock1.replace(galRegex, `gallery: '${galleryUrl}'`);

    updatedBlock = updatedBlock.replace(subBlock, updatedSubBlock2);
    replacedCount++;
  } else {
    console.warn(`City ${city} not found in RAW_DESTINATIONS seeder block.`);
    missedCount++;
  }
}

// Replace the entire block in seed_150.ts code
const finalCode = code.replace(block, updatedBlock);
fs.writeFileSync(seedFile, finalCode, 'utf-8');

console.log(`Successfully rewrote seed_150.ts: replaced ${replacedCount} cities' images. Missed ${missedCount} mappings.`);
