// ============================================================
// ESPN PLAYOFFS - static playoff-period matchups (weeks after that
// season's regular-season length) plus each owner's bracket
// classification (playoffs vs toilet bowl), derived from their final
// rank vs that season's playoffTeamCount setting. ESPN doesn't tag
// bracket type per game the way Sleeper does, so this is inferred
// from final standings rather than traced bracket-by-bracket.
// ============================================================
const ESPN_PLAYOFFS = {
  "2020": {
    "playoffTeamCount": 4,
    "matchups": [
      {
        "week": 14,
        "homeOwner": "Carson Waite",
        "homeScore": 266.44,
        "awayOwner": "Alvin Pokel",
        "awayScore": 246.48
      },
      {
        "week": 14,
        "homeOwner": "Austin Farris",
        "homeScore": 317.08,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 296.08
      },
      {
        "week": 14,
        "homeOwner": "James McNeal",
        "homeScore": 194.68,
        "awayOwner": "Braden Galvan",
        "awayScore": 255.72
      },
      {
        "week": 14,
        "homeOwner": "Rayaan Vellani",
        "homeScore": 256.66,
        "awayOwner": "Zach Sullivan",
        "awayScore": 256.38
      },
      {
        "week": 14,
        "homeOwner": "Shivam Patel",
        "homeScore": 172.8,
        "awayOwner": "Kiran Nevill",
        "awayScore": 140.84
      },
      {
        "week": 15,
        "homeOwner": "Carson Waite",
        "homeScore": 295.62,
        "awayOwner": "Austin Farris",
        "awayScore": 264.94
      },
      {
        "week": 15,
        "homeOwner": "Tyler Ahrens",
        "homeScore": 249.2,
        "awayOwner": "Alvin Pokel",
        "awayScore": 345.26
      },
      {
        "week": 15,
        "homeOwner": "Braden Galvan",
        "homeScore": 250.64,
        "awayOwner": "Rayaan Vellani",
        "awayScore": 211.16
      },
      {
        "week": 15,
        "homeOwner": "James McNeal",
        "homeScore": 255.44,
        "awayOwner": "Shivam Patel",
        "awayScore": 223.56
      },
      {
        "week": 15,
        "homeOwner": "Zach Sullivan",
        "homeScore": 252.74,
        "awayOwner": "Kiran Nevill",
        "awayScore": 146.86
      }
    ],
    "ownerBracket": {
      "Tyler Ahrens": "playoffs",
      "James McNeal": "toilet",
      "Carson Waite": "playoffs",
      "Zach Sullivan": "toilet",
      "Kiran Nevill": "toilet",
      "Braden Galvan": "toilet",
      "Rayaan Vellani": "toilet",
      "Austin Farris": "playoffs",
      "Alvin Pokel": "playoffs",
      "Shivam Patel": "toilet"
    }
  },
  "2021": {
    "playoffTeamCount": 6,
    "matchups": [
      {
        "week": 15,
        "homeOwner": "Tyler Ahrens",
        "homeScore": 82.48,
        "awayOwner": "Tyler Armstrong",
        "awayScore": 119.66
      },
      {
        "week": 15,
        "homeOwner": "Austin Farris",
        "homeScore": 139.86,
        "awayOwner": "Zach Sullivan",
        "awayScore": 64.26
      },
      {
        "week": 15,
        "homeOwner": "James McNeal",
        "homeScore": 67.88,
        "awayOwner": "Matthew Jensen",
        "awayScore": 90.98
      },
      {
        "week": 15,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 81.8,
        "awayOwner": "Alvin Pokel",
        "awayScore": 106.44
      },
      {
        "week": 16,
        "homeOwner": "Shivam Patel",
        "homeScore": 149.08,
        "awayOwner": "Tyler Armstrong",
        "awayScore": 155.78
      },
      {
        "week": 16,
        "homeOwner": "Braden Galvan",
        "homeScore": 133.42,
        "awayOwner": "Austin Farris",
        "awayScore": 83.58
      },
      {
        "week": 16,
        "homeOwner": "Tyler Ahrens",
        "homeScore": 127.0,
        "awayOwner": "Zach Sullivan",
        "awayScore": 68.6
      },
      {
        "week": 16,
        "homeOwner": "Matthew Jensen",
        "homeScore": 101.84,
        "awayOwner": "Alvin Pokel",
        "awayScore": 125.74
      },
      {
        "week": 16,
        "homeOwner": "James McNeal",
        "homeScore": 95.4,
        "awayOwner": "Seth Hendrickson",
        "awayScore": 135.46
      },
      {
        "week": 17,
        "homeOwner": "Braden Galvan",
        "homeScore": 133.36,
        "awayOwner": "Tyler Armstrong",
        "awayScore": 134.5
      },
      {
        "week": 17,
        "homeOwner": "Shivam Patel",
        "homeScore": 113.62,
        "awayOwner": "Austin Farris",
        "awayScore": 119.16
      },
      {
        "week": 17,
        "homeOwner": "Tyler Ahrens",
        "homeScore": 137.32,
        "awayOwner": "Zach Sullivan",
        "awayScore": 128.38
      },
      {
        "week": 17,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 119.7,
        "awayOwner": "Alvin Pokel",
        "awayScore": 106.28
      },
      {
        "week": 17,
        "homeOwner": "James McNeal",
        "homeScore": 95.54,
        "awayOwner": "Matthew Jensen",
        "awayScore": 123.94
      }
    ],
    "ownerBracket": {
      "Tyler Ahrens": "playoffs",
      "Tyler Armstrong": "playoffs",
      "Zach Sullivan": "playoffs",
      "Seth Hendrickson": "toilet",
      "Alvin Pokel": "toilet",
      "James McNeal": "toilet",
      "Braden Galvan": "playoffs",
      "Austin Farris": "playoffs",
      "Matthew Jensen": "toilet",
      "Shivam Patel": "playoffs"
    }
  },
  "2022": {
    "playoffTeamCount": 4,
    "matchups": [
      {
        "week": 14,
        "homeOwner": "Tyler Armstrong",
        "homeScore": 284.76,
        "awayOwner": "Austin Farris",
        "awayScore": 226.3
      },
      {
        "week": 14,
        "homeOwner": "Rohan Shani",
        "homeScore": 207.46,
        "awayOwner": "Colin Lenseigne",
        "awayScore": 257.74
      },
      {
        "week": 14,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 265.7,
        "awayOwner": "Alvin Pokel",
        "awayScore": 233.38
      },
      {
        "week": 14,
        "homeOwner": "Megan Gelber",
        "homeScore": 252.64,
        "awayOwner": "Shivam Patel",
        "awayScore": 232.58
      },
      {
        "week": 14,
        "homeOwner": "Braden Galvan",
        "homeScore": 222.54,
        "awayOwner": "Zach Sullivan",
        "awayScore": 256.4
      },
      {
        "week": 14,
        "homeOwner": "Sydney & Olivia",
        "homeScore": 281.52,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 216.38
      },
      {
        "week": 15,
        "homeOwner": "Tyler Armstrong",
        "homeScore": 295.8,
        "awayOwner": "Colin Lenseigne",
        "awayScore": 248.58
      },
      {
        "week": 15,
        "homeOwner": "Rohan Shani",
        "homeScore": 240.56,
        "awayOwner": "Austin Farris",
        "awayScore": 269.58
      },
      {
        "week": 15,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 213.26,
        "awayOwner": "Megan Gelber",
        "awayScore": 218.84
      },
      {
        "week": 15,
        "homeOwner": "Alvin Pokel",
        "homeScore": 170.2,
        "awayOwner": "Zach Sullivan",
        "awayScore": 257.56
      },
      {
        "week": 15,
        "homeOwner": "Shivam Patel",
        "homeScore": 196.76,
        "awayOwner": "Sydney & Olivia",
        "awayScore": 245.88
      },
      {
        "week": 15,
        "homeOwner": "Braden Galvan",
        "homeScore": 212.54,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 185.8
      }
    ],
    "ownerBracket": {
      "Tyler Ahrens": "toilet",
      "Tyler Armstrong": "playoffs",
      "Sydney & Olivia": "toilet",
      "Seth Hendrickson": "toilet",
      "Shivam Patel": "toilet",
      "Zach Sullivan": "toilet",
      "Braden Galvan": "toilet",
      "Colin Lenseigne": "playoffs",
      "Rohan Shani": "playoffs",
      "Alvin Pokel": "toilet",
      "Megan Gelber": "toilet",
      "Austin Farris": "playoffs"
    }
  }
};
