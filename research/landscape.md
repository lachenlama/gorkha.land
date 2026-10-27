# gorkha.land: Chowrasta (Darjeeling) landscape and grid research

Legend: **V** = coordinates taken from OpenStreetMap (Nominatim/Overpass query, 2026-10-27), so verified against OSM but not ground-truthed. **A** = approximate, from memory or general knowledge, not verified. Re-check every A before shipping.

## 1. Chowrasta geography

- **Plaza centre (V):** OSM `Chowrasta` park node 27.04469, 88.26774. Wikipedia gives 27.0448, 88.2677 (27°02'41"N 88°16'04"E), which agrees.
- **Elevation:** Wikipedia says 2,134 m (7,001 ft). Common tourism figures are about 2,050 m. Treat it as 2,050-2,134 m, which is a source discrepancy. Sample the DEM at the node before using a number in the UI.
- **Shape and size (A):** Roughly a rounded-rectangular, pedestrianised terrace on the Darjeeling ridge, about 60-80 m across. I could not find a published area. Measure it from OSM relation 14895297 (the "Chowrasta" pedestrian street/area) before relying on it. Ground falls away steeply on the east side (towards the valley) and rises to the west and north (Observatory Hill).
- **Vehicle-free:** Wikipedia states vehicles are banned on the square. The Mall roads around it are mostly pedestrian too.
- **Features:**
  - Bhanubhakta Acharya statue, on the far north side. A bust was erected 17 June 1949 and a golden full-figure statue was reinstalled 13 July 1996, commissioned by the Nepali Sahitya Sammelan. OSM has `historic=memorial` at 27.04497, 88.26755 (V). Bhanubhakta is the "Adikavi" (first poet) of Nepali and a unifying cultural symbol for Nepali speakers.
  - Hawa Ghar: a roofed concrete stage on the east edge, used for cultural programmes and political speeches (Wikipedia). It is the practical "bandstand" today. The square was historically called "Band Stand", and an 1880 photo shows the bandstand.
  - Stepped concrete event platform behind the statue, converted from a park in 2014.
  - Fountain near the Nehru Road entrance, decorated with fish and pelicans. Not operational. OSM `amenity=fountain` at 27.04426, 88.26779 (V).
  - Benches, pigeon feeding, pony rides (kids' rides on the square), and photographers. I did not verify pony-ride spots, so mark them A.
  - Old shops around the square. The oldest is Oxford Book & Stationery.
- **View:** Clear mornings give Kanchenjunga and a dozen other peaks above 6,100 m (Wikipedia). The view is to the north-west. Cloud usually builds by mid-morning.
- **Roads meeting here:**
  - Nehru Road (Laden La Road) and Dr Zakir Hussain Road both end at Chowrasta.
  - Both ends of The Mall (Mall Road East and West) meet at Chowrasta from the north. They loop around Observatory Hill and Mahakal Temple.
  - Several narrow lanes and footpaths start or end here, including the climb to Observatory Hill and the steps down towards the bus/taxi stand.
  - Rajbhawan Road leaves the Mall area to the north-west. I did not verify the exact junction (A).
- **Mall (Chowrasta) area extent:** Within 150 m of the centre are the Mall Market, Tourist Information Centre, SBI ATM, UCO/Union Banks, the street-food stalls (27.04401, 88.26788 V), and the police booth (27.04436, 88.26786 V).

## 2. POIs within about 1.5 km

Distances are from the plaza centre. Lat/lon is V unless marked A. I ran out of reliable lookups for some of the larger landmarks and marked those A.

| # | Name | Category | Lat, Lon | Why it matters |
|---|------|----------|----------|----------------|
| 1 | Chowrasta (the Mall) | heritage / hub | 27.04469, 88.26774 V | The town's public living room and main rally site. |
| 2 | Bhanubhakta Acharya statue | heritage | 27.04497, 88.26755 V | Nepali "Adikavi" statue. The plaza's centrepiece. |
| 3 | Hawa Ghar (stage) | heritage / event | ~27.0446, 88.2679 A | Roofed stage used for speeches and cultural shows. |
| 4 | Observatory Hill / Mahakal Mandir | religious / viewpoint | 27.04777, 88.26798 V (mandir); 27.04787, 88.26803 V (hill) | Shared Hindu-Buddhist-Kirat shrine on the hill. Monkeys, prayer flags, the legend of the older Dorje Ling monastery on this hill. |
| 5 | Entrance to Observatory Hill | access | 27.04609, 88.26810 V | The steps up from the Mall. A natural game gateway. |
| 6 | Keventer's | food / heritage | 27.04219, 88.26664 V | Rooftop-terrace dairy and sausage-and-bacon deli, an institution since the Raj. |
| 7 | Glenary's | food / heritage | 27.04301, 88.26693 V | Bakery, restaurant, and live-music bar on Nehru Road. A colonial-era landmark. |
| 8 | Nathmull's Tea | shop | 27.04499, 88.26741 V (also 27.04450, 88.26793 V cafe node) | Long-running tea merchant on the plaza. OSM has two nodes, so pick one on-site. |
| 9 | Oxford Book & Stationery | shop / heritage | ~27.0448, 88.2672 A | Oldest shop on the square. My lookup failed, so confirm the point. |
| 10 | Das Studio | shop / heritage | ~27.0437, 88.2662 A | Old photographic studio. It is on Nehru Road per tourist sources, but I did not verify the node. |
| 11 | Habeli / old shops on Nehru Road | heritage | ~27.0415, 88.2662 A | Old curio, Tibetan, and wooden-front shops along Nehru Road. Check for the actual "Habeli" shop name before using it. |
| 12 | Planters' Club | heritage | 27.04233, 88.26712 V | 1868 club, tied to the tea-planter era. Listed as `tourism=hotel` in OSM. |
| 13 | Darjeeling Gymkhana Club | heritage | ~27.0455, 88.2625 A | Colonial sports club (skating rink, billiards). Not looked up. |
| 14 | The Mall Market | shop / attraction | 27.04515, 88.26737 V | The pedestrian shopping core. |
| 15 | Mahakal Market | shop | 27.04019, 88.26498 V | Multi-storey market block near the bus stand. |
| 16 | Tourist Information Centre | info | 27.04613, 88.26714 V | WB tourism office on the Mall. |
| 17 | St Andrew's Church | religious / heritage | 27.04790, 88.26668 V | Old Anglican church (1843, rebuilt) near the Mall. |
| 18 | Raj Bhawan (Governor's Darjeeling residence) | heritage | ~27.0495, 88.2610 A | Nominatim found nothing, so mark A. Not publicly open. |
| 19 | Darjeeling railway station (DHR, "toy train") | transport / heritage | 27.03802, 88.26316 V | Starting point for the DHR (UNESCO World Heritage, 1999). About 800 m south-west of the plaza. |
| 20 | Bus and taxi stand (Motor Stand) | transport | 27.04461, 88.26547 V | Just west of the plaza. Taxis to Siliguri, Ghoom, Tiger Hill. |
| 21 | Chowk Bazaar | shop / transport | ~27.0395, 88.2640 A | Lower market area. Verify. |
| 22 | Batasia Loop and War Memorial | transport / heritage | 27.01670, 88.24712 V | DHR spiral loop and Gorkha war memorial. About 3.4 km south-west, outside the 1.5 km study area (the "direction" POI). |
| 23 | Loreto Convent | school / heritage | ~27.0400, 88.2570 A | Lookup failed. Mark A. |
| 24 | St Paul's School | school / heritage | ~27.0310, 88.2530 A | Lookup failed. Also likely outside 1.5 km. |
| 25 | Bhanu Bhawan (Bhanubhakta's birthplace-linked site / Nepali Sahitya Sammelan site) | heritage | ~27.0440, 88.2640 A | I could not confirm the exact location or what it houses. Verify before use. |
| 26 | Himalayan Mountaineering Institute (HMI) | heritage / education | 27.05877, 88.25331 V | Founded 1954 after the first Everest ascent. Tenzing Norgay's samadhi is nearby. About 2 km NW, slightly outside 1.5 km. |
| 27 | Padmaja Naidu Himalayan Zoological Park | nature | ~27.0585, 88.2535 A | Shares the compound with HMI. Home of the red panda and snow leopard breeding programmes. |
| 28 | Darjeeling Ropeway | transport / tourism | 27.07143, 88.25483 V | At North Point, about 3 km north. Outside the study area. Mention only as a distant node. |
| 29 | Lloyd Botanical Garden | nature | 27.04435, 88.26262 V | West of the plaza, about 400 m. Himalayan flora. Nominatim gave the same point as Fulbari. |
| 30 | Happy Valley Tea Estate | nature / tea | 27.05110, 88.25853 V | Dating from 1854, one of the oldest estates. Walkable from town. |
| 31 | Glenburn Tea Estate | nature / tea | ~27.0000, 88.3000 A | Far outside the study area (below Darjeeling). Not verified. |
| 32 | Bhutia Busty Monastery | religious | 27.05026, 88.26995 V | Nyingma monastery; Tibetan Book of the Dead tradition. About 700 m north. |
| 33 | Dorje Ling monastery sites | religious / lore | see #4 | The "Dorje Ling" (thunderbolt place) monastery on Observatory Hill gave the town its name. Exact site is local lore; OSM does not carry a separate point. |
| 34 | Sherpa Monastery (Mall area) | religious | 27.04088, 88.26791 V | Small Buddhist shrine on the Mall. |
| 35 | Union Church / CNI Upasna Kendra | religious | 27.03755, 88.26495 V | Church complex near Hotel Pradhan. |
| 36 | Diocesan Pastoral Center | religious | 27.04574, 88.26501 V | Catholic diocese office on the Mall. |
| 37 | Deshbandu Museum | museum | 27.04663, 88.26874 V | C. R. Das's memorial house, now a small museum. |
| 38 | Himalayan Tibet Museum | museum | 27.03944, 88.26589 V | Small private museum on Nehru Road. |
| 39 | Tomb of Alexander Csoma de Koros | heritage | 27.05228, 88.25903 V | Hungarian Tibetologist's tomb in the Lloyd Road cemetery. Memorial carving at 27.04854, 88.26587 V. |
| 40 | Tomb of General Lloyd | heritage | 27.05268, 88.25868 V | Founder of the early hill station. |
| 41 | Tibetan Refugee Self Help Centre | shop / community | 27.05297, 88.26703 V | Tibetan handicraft and carpet centre (1959). Outer edge of the study area. |
| 42 | Joey's Pub | food / nightlife | 27.03968, 88.26554 V (second node 27.03947, 88.26509) | A famous small pub on Nehru Road. |
| 43 | Kunga Restaurant | food | 27.04172, 88.26658 V | Tibetan food (thukpa, momos). Duplicate node at 27.04178, 88.26635. |
| 44 | Sonam's Kitchen | food | 27.04251, 88.26792 V | Popular backpacker restaurant. |
| 45 | Frank Ross Cafe | food | 27.04280, 88.26691 V | Old-world cafe. |
| 46 | Himalayan Java Coffee | cafe | 27.04246, 88.26688 V | Chain cafe on Nehru Road. |
| 47 | Goodricke House of Tea | shop | 27.04241, 88.26649 V | Tea shop. |
| 48 | Tom and Jerry | cafe | 27.04282, 88.26793 V | Casual cafe. |
| 49 | NERDvana Bookstore and Cafe | cafe / books | 27.04274, 88.26795 V | Younger book-cafe. |
| 50 | Capitol Hall clock | landmark | 27.04066, 88.26600 V | Clock building near Municipality. "Capitol Hill" is a nearby local name (A, unverified). |
| 51 | Darjeeling Municipality | civic | 27.04054, 88.26594 V | Town hall area on Nehru Road. |
| 52 | GPO (post office) | civic | 27.03985, 88.26519 V | Main post office. A second at 27.04272, 88.26522. |
| 53 | Gorkha Rangamanch Bhawan | civic / culture | A, not found | A hill-community theatre/auditorium. Lookup returned nothing. Verify with the DGHC/GTA office. |
| 54 | Popular viewpoint (OSM "Stunning views!") | viewpoint | 27.05363, 88.25769 V | Viewpoint on the Lloyd Road area. |
| 55 | Dekeling / Hotel Siddharth etc. | hotels | cluster | Dozens of hotels cluster along Nehru Road and Mall Road, with Windamere (27.04611, 88.26783 V) as a heritage hotel. |

Notes: OSM returns roughly 200 named features within 1.5 km, so POI density is not a problem for the game. The overpass server returned 502 on the second batch, so large landmarks (Raj Bhawan, Gymkhana, Loreto, Bhanu Bhawan, Rangamanch) need a fresh Overpass pass.

## 3. Hills history and Gorkhaland movement

Report factually and neutrally.

- **Phases:** 1986-88 (GNLF, Subhash Ghising, ended by the 1988 Darjeeling Gorkha Hill Council accord); 2007-2011 (GJM, Bimal Gurung; ended with the Gorkhaland Territorial Administration, 2011); 2017 (a roughly 105-day shutdown after a June 2017 Bengali-language school policy dispute, with GJM leadership resigning from the GTA).
- **Deaths:** Estimates for 1986-88 exceed 1,200 (one cited estimate, unofficial figures higher). In 2017, reports name three people killed in police firing in June (Bimal Sashanker of Gok Bustee, Sunil Rai of Kainjaley, Mahesh Gurung of Relling).
- **Gathering places:**
  - Chowrasta: hosts "cultural and political activities", and its stage speeches are documented (Wikipedia). The generic role as a rally ground is well established, but I did not find a source tying a specific named event to it, so say "rally site" without dating particular events.
  - Hawa Ghar stage and the Bhanubhakta statue, as the focal points of the plaza.
  - Government offices, police stations, and the railway station were targets of damage in 2017 (Scroll, Hindustan Times).
  - Specific memorial sites (martyrs' memorials): not found. Do not invent coordinates. Ask local contacts.
- **Sensitivity:**
  - The movement is politically live. Hill politics changed again in 2026 (a Kathmandu-based news piece of 5 June 2026 discusses revived hopes after a BJP victory in West Bengal). Do not make in-game factions out of political parties.
  - The population is cross-community: Nepali/Gorkha, Lepcha, Bhutia, Tibetan, Sherpa, Bengali, Marwari, and others. Not all share the same politics.
  - Do not gamify deaths or violence. No "capture" mechanics on memorials. Treat them as quiet, no-PvP sites.
  - Avoid using the word "Gorkhaland" as a game faction. The site brand "gorkha.land" has its own history, so confirm positioning with local advisers.

## 4. Terrain and walkability

- **Slopes:** The town sits on a ridge with 20-40% slopes common. Staircases connect most levels (for example the steps from the Mall down to the Motor Stand). Expect a straight-line 100 m to be 3-5 minutes walking uphill.
- **Mall:** Pedestrian-only, flat for roughly 200 m, which is good for slow play. Nehru Road is open to traffic in parts and is busy. Warn players about road safety.
- **Weather:** Monsoon June-September means heavy rain, frequent fog, and landslides. Peak seasons are spring (March-May) and autumn (October-November), when views are clearest and crowds are largest. Winter is cold with occasional snow.
- **GPS:** Expect 10-30 m error in narrow, steep lanes and in fog or under tin roofs. Valley edges cause multipath reflection. Plan for cell sizes no smaller than ~25 m for gameplay-relevant effects, and use hysteresis.
- **Mobile network:** I did not verify coverage. Generally 4G from Jio/Airtel/BSNL covers the town centre with spotty drops in the valleys and fog. Design for offline-tolerant sync (see section 7).
- **Altitude:** GPS vertical error is large. Do not rely on altitude for anti-spoofing.

## 5. Map data sources

- **OSM coverage (V, by query):** The area around the Mall is densely tagged with named hotels, banks, shops, and cafes (200 results in a 1.5 km query). Paths, stairs, and building footprints were not audited. Check `highway=steps` and `building=*` counts via Overpass before committing to an OSM-driven look. Some POIs are duplicated (for example Kunga, Joey's, Nathmull's), so deduplicate before using.
- **Vector tiles (A, from general knowledge, not fetched):** Protomaps (PMTiles, a single static file readable by range requests, ideal for a PWA with no tile server), OpenMapTiles schema (self-hosted or via MapTiler, free tier with attribution), Overture Maps. Extract just the bounding box with `pmtiles extract`, which yields a few MB.
- **Elevation (A):** SRTM and Copernicus GLO-30 DEM are 30 m, which is too coarse for lanes. Fine for a hillshade backdrop. For sub-30 m terrain, use the polygon edges or hand-authored data.
- **Imagery:** Google and Bing imagery cannot be traced into OSM or redistributed. Use Esri/Maxar licensed terms only as agreed. Mapbox/Maxar need paid plans. Hand-drawing from imagery for your own illustrated tiles is a grey area, so confirm terms.
- **Overture Maps places (A):** CC BY 4.0 for most themes, with some sources under other licenses. Includes Meta/Microsoft-sourced places. Quality in Darjeeling is unverified.
- **Licenses:** OSM is ODbL 1.0 and requires visible "(c) OpenStreetMap contributors" attribution. Derived databases must be shared under ODbL, but pure rendered map images are produced works. Nominatim's public service has a usage policy of 1 request/second and no bulk use. Self-host for production.

## 6. Grid recommendation

H3 average values (from the H3 spec, general knowledge, not fetched; the ClickHouse and PingCAP docs confirm edge lengths and that values are averages):

| Res | Edge | Cell area | Cells in 1.5 km radius (7.07 km2) |
|-----|------|-----------|------------------------------------|
| 7 | 1.22 km | 5.16 km2 | ~2 |
| 8 | 461 m | 0.74 km2 | ~10 |
| 9 | 174 m | 0.105 km2 | ~67 |
| 10 | 66 m | 0.0150 km2 | ~470 |
| 11 | 24.9 m | 2,150 m2 | ~3,300 |
| 12 | 9.4 m | 307 m2 | ~23,000 |

Counts are flat-area estimates (7.07 km2 divided by cell area). Real steep terrain has more surface, but GPS grids are 2D, so use the flat numbers.

Comparison:
- **H3:** Uniform neighbour distance (all 6 neighbours equidistant), so range, adjacency, and movement rules are simple and fair. Hierarchical, with `h3-pg` for PostGIS. Pentagons are irrelevant near Darjeeling. Child cells do not tile exactly with parents (aperture 7), so "region contains tiles" is approximate.
- **S2:** Square-ish cells, exact hierarchy, used by Niantic (Pokemon GO uses level 17 for gyms/stops, level 14 for spawn/region areas). Better for strict nesting. The library is less friendly in the browser and in PostGIS.
- **Geohash:** Rectangles that distort with latitude and have edge discontinuities. Avoid for a game.
- **Plain squares:** Simplest to draw and reason about, but diagonal neighbours differ, which skews range games. Fine for a small custom map if you hand-author.

Recommendation:
- **(a) Territory tiles:** H3 res 11 (edge ~25 m, ~3,300 cells in the study area). This is above GPS noise in the Mall (10-30 m error), so a player will not flicker between tiles too often. If you want coarser, bigger "capturable plots" for slow play, use res 10 (~470 cells, ~66 m edge). My pick: res 11 as the storage grain, rendered as res 10 groups on screen. Do not use res 12 (9 m is below GPS accuracy; spoofing and jitter become indistinguishable).
- **(b) Spawn/encounter cells:** H3 res 10 for spawn points, with a res 9 parent for rate limits (about 67 cells). Anchor named POIs to a single res 11 cell and give each a radius of 1 ring.
- **(c) Region shards:** H3 res 7 or 8 for DB partitioning and realtime rooms. The whole study area fits in 2-10 res-8 cells. Res 7 cells are bigger than the town. Use res 8 as the channel/shard key so a later expansion to Ghoom or Kurseong needs no remap.
- **Anti-spoof:** Check max speed between cells (walking on stairs is slow). Reject jumps over a few cells per second, ignore altitude, cross-check network location against GPS, and require a device-attested location where possible. Server-side adjacency via `h3_grid_disk`. Store `h3index` as a bigint with a B-tree index plus `h3_cell_to_parent` for roll-ups.
- Mark POI cells with the memorial-site exclusion list from section 3.

## 7. Rendering approach

- **MapLibre GL JS with a custom style:** Pros: real geodata, pan/zoom/tilt, PMTiles works offline, WebGL vector tiles are light, H3 cells can be drawn as a GeoJSON fill layer. Cons: WebGL on low-end Android can stutter, and a "stylized" painterly look needs custom sprites and layers.
- **Hand-illustrated or isometric 2.5D map (the existing painted Chowrasta art):** Pros: strongest brand identity, tiny runtime (an image plus an SVG/canvas overlay), works on any phone, and no licensing issue with OSM tiles for the picture itself. Cons: manual work per area, no free pan/zoom, and the illustration must be georeferenced to the H3 grid (affine or homography calibration, with drift in steep terrain).
- **three.js or deck.gl:** Pros: 3D terrain and effects. Cons: heavy for low-end Android, with larger bundles and thermal throttling. Not recommended for the first release.
- **Pragmatic hybrid:** Use MapLibre with a very reduced style (water, roads, buildings as flat colours, a hillshade raster) plus the painted Chowrasta illustration as a georeferenced image source at high zoom. Overlay H3 cells as a MapLibre fill layer. Everything is static, offline-cacheable via a service worker, and the PMTiles file for the bounding box is a few MB.
- Mobile-first notes: cap the device pixel ratio at 2, avoid per-frame full-layer updates, update only changed cells, and throttle GPS handling.

## 8. Sources

- https://en.wikipedia.org/wiki/Chowrasta (Chowrasta; coordinates, elevation, statue, Hawa Ghar, roads)
- https://en.wikipedia.org/wiki/Chowrasta_(Darjeeling)
- https://darjeeling.gov.in/tourist-place/chowrasta-mall/
- https://www.elginhotels.com/mall-chowrasta-darjeeling/
- https://nominatim.openstreetmap.org/ (queries for Chowrasta, Keventers, Glenary's, Mahakal Mandir, Darjeeling Railway Station, HMI, St Andrew's, Ropeway, Lloyd Botanical Garden, Batasia Loop, Happy Valley Tea Estate)
- https://overpass-api.de/ (1.5 km POI query around 27.04469, 88.26773)
- https://scroll.in/article/844660/darjeeling-2017-is-eerily-similar-to-subhash-ghisings-violent-gorkhaland-movement-in-1986
- https://www.clearias.com/gorkhaland/
- https://journalsofindia.com/gorkhaland-movement/
- https://www.thequint.com/amp/story/news/india/darjeeling-protest-gjm-mamata-banerjee
- https://en.wikipedia.org/wiki/Bimal_Gurung
- https://ekantipur.com/feature/2026/06/05/en/gorkhaland-hope-rekindled-the-road-blocked-again-34-24.html
- https://clickhouse.com/docs/sql-reference/functions/geo/h3 (H3 edge length functions)
- https://docs.pingcap.com/tidbcloudlake/h3-edge-length-km/
- https://h3geo.org/docs/core-library/restable (H3 resolution table; cited from memory, not fetched)
- https://docs.protomaps.com/pmtiles/ (not fetched)
- https://openstreetmap.org/copyright (ODbL attribution)

Gaps to close: Overpass re-run for Raj Bhawan, Gymkhana, Loreto, St Paul's, Bhanu Bhawan, Rangamanch, Oxford Book, Das Studio, Chowk Bazaar; audit OSM stairs/paths/buildings counts; confirm named memorials with local contacts; check mobile coverage on site.
