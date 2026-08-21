// ============================================================
// ESPN SCORING RULES - this league's exact point values per raw
// stat category (statId), extracted from the league's own saved
// settings. Validated against a known-correct real total (Ezekiel
// Elliott's actual 2020 223.7 points reconstructed EXACTLY from his
// raw stat line using this same formula). Used to compute fantasy
// points for ESPN-era players who got dropped mid-season and so
// have no season total saved anywhere - reconstructed live from
// their raw stats instead. Same across all 3 ESPN seasons.
// Only covers skill-position-relevant stats (passing/rushing/
// receiving) since K/DEF don't get VORP calculated anyway.
// ============================================================
const ESPN_SCORING_RULES = {
  "25": 6.0,
  "53": 1.0,
  "72": -2.0,
  "19": 2.0,
  "43": 6.0,
  "20": -2.0,
  "4": 4.0,
  "24": 0.1,
  "63": 6.0,
  "80": 3.0,
  "26": 2.0,
  "77": 4.0,
  "85": -1.0,
  "3": 0.04,
  "86": 1.0,
  "42": 0.1,
  "44": 2.0
};
