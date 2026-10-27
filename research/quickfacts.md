# gorkha.land quick facts

Status key: **[OK]** confirmed in a source, **[EST]** estimate or third-party figure, **[UNK]** not found.
Prices come from third-party trackers (Cloud Mercato, WHTOP), not vendor pricing pages. Re-check before buying.

## 1. Darjeeling tourism and demographics

- **Annual footfall (district):** [UNK] No official total for 2024 or 2025. A Rajya Sabha answer (Mar 2025) gives Darjeeling foreign visits for 2023 as 46,083 and says 2024/2025 weren't included. Source: https://rsdebate.nic.in/bitstream/123456789/759551/1/PQ_267_20032025_U2380_p512_p513.pdf
- **Unverified blog figures:** about 750,000 domestic and 42,000 foreign visitors, undated, not official. [EST] Treat as unconfirmed; the search index result did not give a URL that clearly carries this number.
- **Data gap:** A 2020 Lok Sabha answer said the Ministry keeps no district-wise domestic/international arrival data. Ask the West Bengal tourism department for district totals. Source: https://tourism.gov.in/sites/default/files/2020-03/usq%201281%20for%2010022020.pdf
- **Toy train (not total footfall):** DHR passengers rose from 1.74 lakh (2024-25) to 2.08 lakh (2025-26). [OK, narrow metric] Source: via News Arena tag page, https://newsarenaindia.com/tag/darjeeling-tourists
- **Peak months:** Most guides name March to May and October to November as peaks. Some put the peak from September to November. June to September is monsoon (heaviest July-August, landslide risk, fewer tourists). Winter is quiet. Sources disagree on the peak start, so treat this as [EST]. Sources: https://www.sotc.in/tourism/darjeeling-tourism/best-time-to-visit-darjeeling , https://championtraveler.com/dates/best-time-to-visit-darjeeling-in/
- **Domestic vs foreign share:** [UNK] No reliable split found. Only the 2023 foreign figure above is official.
- **Town population:** [OK] Darjeeling municipality, 2011 census: 118,805 (2001: 107,197; 1991: 73,062). Darjeeling UA (different boundary): 132,016. Source: https://en.wikipedia.org/wiki/Demographics_of_Darjeeling and https://www.citypopulation.de/en/india/westbengal/darjiling/1940102000__dārjiling/
- **Mobile coverage:** [OK, dated] 652 5G BTSs operational in Darjeeling district as of 30 Jun 2025 (Lok Sabha answer, no operator split). Source: https://eparlib.sansad.in/bitstream/123456789/2997048/1/AU473_syuAMs.pdf
- **4G coverage (TRAI, Jul 2024, [EST] mapping from messy table):** Jio about 94%, Airtel about 91%, Vodafone Idea about 73%, BSNL 3G about 21%. Check the PDF: https://trai.gov.in/sites/default/files/Darjeeling_26072024.pdf
- **Airtel claim:** 5G across all 23 West Bengal districts (company claim, Nov 2023). Source: https://www.airtel.in/press-release/11-2023/airtel-extends-5g-coverage-to-all-23-districts-of-west-bengal

## 2. VPS options (4 vCPU / 8 GB, approx. USD/month)

| Provider | India region | ~Price | Status |
|---|---|---|---|
| DigitalOcean | Bangalore (blr1) | $48 standard (S-4vCPU-8GB, 160 GB SSD); $56 premium Intel/AMD | [EST] third-party (Cloud Mercato). https://pcr.cloud-mercato.com/providers/digitalocean/flavors/s-4vcpu-8gb |
| Vultr | Mumbai, Bangalore, Delhi | $40 (VC2), $48 (VHP High Perf), $80 (VOC-C compute) | [EST] conflicting: one aggregator says $58. https://pcr.cloud-mercato.com/providers/vultr/flavors/vc2-4c-8gb , https://pcr.cloud-mercato.com/providers/vultr/flavors/vhp-4c-8gb-intel |
| Hetzner | **No India DC** | Singapore cloud region only (cloud products; no dedicated in SG). Price not checked. | [OK] location. https://docs.hetzner.com/cloud/general/locations/ |
| Linode/Akamai | Mumbai (ap-west), Chennai (in-maa) | Not found for 4 vCPU/8 GB. USD billing; backups % of plan. | [UNK] https://techdocs.akamai.com/cloud-computing/docs/choose-a-data-center |
| AWS Lightsail | Mumbai | Not found for 4 vCPU/8 GB. A possible 8 GB bundle at $168 has no vCPU count or region. | [UNK] https://aws.amazon.com/de/lightsail/pricing/ |
| E2E Networks | India (Mumbai/Chennai likely) | Not found. A 4 vCPU/16 GB plan listed at INR 2,459/mo (not 8 GB). | [UNK] https://www.whtop.com/plans/e2enetworks.com/91727 |
| OVHcloud | No Mumbai DC per OVH India page | Third-party B3-16 about $78/mo (region unclear) | [UNK/conflict] https://www.ovhcloud.com/en-in/vps/vps-india/ |

Takeaway: DigitalOcean Bangalore and Vultr India are the cleanest candidates at about $40-58/mo. Get exact current prices from each vendor page. E2E Networks is the likely INR-billed option for a local team, but its plan is unverified.

## Latency (Kolkata/Darjeeling to India vs Singapore)

- Kolkata to Mumbai RTT: [UNK] No direct measurement found. Estimate: tens of ms (domestic). Measure with `ping`/`mtr` to each provider's endpoint.
- India to Singapore RTT: [EST] roughly 30-60 ms (one 2026 guide) or 50-80 ms from Mumbai users (a hosting blog). Source: https://www.techplained.com/india-cloud-latency
- Practical read: Kolkata-hosted or India-hosted should beat Singapore by roughly 20-60 ms RTT. Measure before deciding.

## 3. Domain and Cloudflare

- **.land restrictions:** [EST] Registrar sources say open registration (first-come, first-served) with standard character rules, and the registry reportedly screens against OFAC sanctions. Some names are reserved. Rules conflict across sources (length 1-63 vs 3-63, hyphen rules). Check the Identity Digital .LAND policy directly. Sources: https://www.godaddy.com/en-uk/help/about-land-domains-8958 , https://wiki.hexonet.net/wiki/LAND
- **Cloudflare WebSockets on Free:** [OK per docs and blog, but see conflict] Cloudflare docs list WebSockets as available on Free with a "Low" concurrent-connection allowance. Enable under Network settings. Source: https://blog.cloudflare.com/everybody-gets-websockets (2016 announcement). Conflict: a WebFetch of https://www.cloudflare.com/plans/ did not mention WebSockets for Free. Verify on the live docs page before relying on it for multiplayer.

## 4. Existing Darjeeling apps (Play Store)

- **Discover Darjeeling** (official, West Bengal Tourism): launched Siliguri, reported 16 Oct 2026. Install count not found. https://www.uniindia.com/east-india/tourism-wb-darjeeling-app/216720
- **Darjeeling** by Sachin Prakash: older (2015 archive). Install count not found. https://ffapps.danielherr.software/app/darjeeling
- **Darjeeling Travel Guide** (Ideaxecution): unclear whether it has a Play app. https://m.indiamart.com/idea-xecution/aboutus.html
- Install counts: [UNK] Check Play Store listings directly, or AppBrain.

## Gaps to close

- Official district arrivals (ask WB tourism department).
- Exact current VPS prices from vendor pages.
- Real Kolkata-to-Mumbai ping test.
- Play Store install counts for the apps above.
