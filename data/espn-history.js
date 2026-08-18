// ============================================================
// ESPN HISTORY - static data for 2020-2022, before the league moved to Sleeper.
// This data is frozen (seasons are long over) so it's hardcoded rather than
// live-fetched like the Sleeper seasons. Source: ESPN Fantasy API, mTeam view.
// finalRank is ESPN's own computed final standing (1 = champion), used for trophies.
// ============================================================
const ESPN_HISTORY = {
  "2022": [
    {
      "owner": "Tyler Armstrong",
      "teamName": "Broncos Country Lets Ride",
      "wins": 10,
      "losses": 3,
      "ties": 0,
      "pointsFor": 1841.1,
      "pointsAgainst": 1549.9,
      "finalRank": 1
    },
    {
      "owner": "Colin Lenseigne",
      "teamName": "Taiwan  Freedom Fighter",
      "wins": 10,
      "losses": 3,
      "ties": 0,
      "pointsFor": 1754.7,
      "pointsAgainst": 1604.1,
      "finalRank": 2
    },
    {
      "owner": "Austin Farris",
      "teamName": "Watsonder My Towel",
      "wins": 9,
      "losses": 4,
      "ties": 0,
      "pointsFor": 1665.0,
      "pointsAgainst": 1488.7,
      "finalRank": 3
    },
    {
      "owner": "Rohan Shani",
      "teamName": "Texans Country Lets Ride",
      "wins": 8,
      "losses": 5,
      "ties": 0,
      "pointsFor": 1557.1,
      "pointsAgainst": 1490.3,
      "finalRank": 4
    },
    {
      "owner": "Megan Gelber",
      "teamName": "Team Gelber",
      "wins": 6,
      "losses": 7,
      "ties": 0,
      "pointsFor": 1530.6,
      "pointsAgainst": 1623.9,
      "finalRank": 5
    },
    {
      "owner": "Seth Hendrickson",
      "teamName": "Houston  Happy Endings",
      "wins": 7,
      "losses": 6,
      "ties": 0,
      "pointsFor": 1648.7,
      "pointsAgainst": 1525.6,
      "finalRank": 6
    },
    {
      "owner": "Zach Sullivan",
      "teamName": "What's Poppin Zud",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1534.6,
      "pointsAgainst": 1687.2,
      "finalRank": 7
    },
    {
      "owner": "Alvin Pokel",
      "teamName": "Team Aa Batteries",
      "wins": 6,
      "losses": 7,
      "ties": 0,
      "pointsFor": 1640.6,
      "pointsAgainst": 1643.7,
      "finalRank": 8
    },
    {
      "owner": "Sydney & Olivia",
      "teamName": "Team MooreCok",
      "wins": 4,
      "losses": 9,
      "ties": 0,
      "pointsFor": 1514.3,
      "pointsAgainst": 1716.1,
      "finalRank": 9
    },
    {
      "owner": "Shivam Patel",
      "teamName": "Team Patel",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1696.2,
      "pointsAgainst": 1701.7,
      "finalRank": 10
    },
    {
      "owner": "Braden Galvan",
      "teamName": "Ceedee's Nuts",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1539.9,
      "pointsAgainst": 1692.0,
      "finalRank": 11
    },
    {
      "owner": "Tyler Ahrens",
      "teamName": "Big \ud83d\udc13 Brock",
      "wins": 3,
      "losses": 10,
      "ties": 0,
      "pointsFor": 1444.6,
      "pointsAgainst": 1644.4,
      "finalRank": 12
    }
  ],
  "2021": [
    {
      "owner": "Tyler Armstrong",
      "teamName": "Mile High",
      "wins": 7,
      "losses": 7,
      "ties": 0,
      "pointsFor": 1743.3,
      "pointsAgainst": 1653.2,
      "finalRank": 1
    },
    {
      "owner": "Braden Galvan",
      "teamName": "Weedee Lamb",
      "wins": 8,
      "losses": 6,
      "ties": 0,
      "pointsFor": 1761.7,
      "pointsAgainst": 1797.4,
      "finalRank": 2
    },
    {
      "owner": "Austin Farris",
      "teamName": "EDP's Cupcake Factory",
      "wins": 8,
      "losses": 6,
      "ties": 0,
      "pointsFor": 1830.3,
      "pointsAgainst": 1721.3,
      "finalRank": 3
    },
    {
      "owner": "Shivam Patel",
      "teamName": "Team Shivam  Shivam",
      "wins": 12,
      "losses": 2,
      "ties": 0,
      "pointsFor": 1921.9,
      "pointsAgainst": 1700.6,
      "finalRank": 4
    },
    {
      "owner": "Tyler Ahrens",
      "teamName": "Lance in my Pants",
      "wins": 7,
      "losses": 7,
      "ties": 0,
      "pointsFor": 1774.3,
      "pointsAgainst": 1832.9,
      "finalRank": 5
    },
    {
      "owner": "Zach Sullivan",
      "teamName": "Team Zach's_Snacks",
      "wins": 7,
      "losses": 7,
      "ties": 0,
      "pointsFor": 1694.0,
      "pointsAgainst": 1764.2,
      "finalRank": 6
    },
    {
      "owner": "Seth Hendrickson",
      "teamName": "Hide and Zeke",
      "wins": 6,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1566.0,
      "pointsAgainst": 1735.2,
      "finalRank": 7
    },
    {
      "owner": "Alvin Pokel",
      "teamName": "Aa Batteries",
      "wins": 3,
      "losses": 11,
      "ties": 0,
      "pointsFor": 1525.3,
      "pointsAgainst": 1690.1,
      "finalRank": 8
    },
    {
      "owner": "Matthew Jensen",
      "teamName": "Team Matthew",
      "wins": 6,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1596.5,
      "pointsAgainst": 1655.9,
      "finalRank": 9
    },
    {
      "owner": "James McNeal",
      "teamName": "Admiral Dakbar",
      "wins": 6,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1698.0,
      "pointsAgainst": 1560.8,
      "finalRank": 10
    }
  ],
  "2020": [
    {
      "owner": "Carson Waite",
      "teamName": "Andrew's 3rd Leg",
      "wins": 9,
      "losses": 4,
      "ties": 0,
      "pointsFor": 1560.3,
      "pointsAgainst": 1494.8,
      "finalRank": 1
    },
    {
      "owner": "Austin Farris",
      "teamName": "Rayne Prescott",
      "wins": 7,
      "losses": 6,
      "ties": 0,
      "pointsFor": 1667.4,
      "pointsAgainst": 1563.1,
      "finalRank": 2
    },
    {
      "owner": "Alvin Pokel",
      "teamName": "Armed Rodgery",
      "wins": 8,
      "losses": 5,
      "ties": 0,
      "pointsFor": 1645.7,
      "pointsAgainst": 1553.9,
      "finalRank": 3
    },
    {
      "owner": "Tyler Ahrens",
      "teamName": "JaMycal Hasty\ud83d\udc3b",
      "wins": 8,
      "losses": 5,
      "ties": 0,
      "pointsFor": 1675.4,
      "pointsAgainst": 1632.5,
      "finalRank": 4
    },
    {
      "owner": "Braden Galvan",
      "teamName": "braden .",
      "wins": 6,
      "losses": 7,
      "ties": 0,
      "pointsFor": 1525.6,
      "pointsAgainst": 1507.6,
      "finalRank": 5
    },
    {
      "owner": "Rayaan Vellani",
      "teamName": "Watson your Wallet",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1613.5,
      "pointsAgainst": 1600.9,
      "finalRank": 6
    },
    {
      "owner": "James McNeal",
      "teamName": "Discount Belicheck",
      "wins": 7,
      "losses": 6,
      "ties": 0,
      "pointsFor": 1659.2,
      "pointsAgainst": 1609.1,
      "finalRank": 7
    },
    {
      "owner": "Shivam Patel",
      "teamName": "Team Humidifier",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1491.4,
      "pointsAgainst": 1518.8,
      "finalRank": 8
    },
    {
      "owner": "Zach Sullivan",
      "teamName": "Zudz Zud",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1564.5,
      "pointsAgainst": 1559.0,
      "finalRank": 9
    },
    {
      "owner": "Kiran Nevill",
      "teamName": "Malachi Kai",
      "wins": 5,
      "losses": 8,
      "ties": 0,
      "pointsFor": 1260.2,
      "pointsAgainst": 1623.4,
      "finalRank": 10
    }
  ]
};
