// ============================================================
// ESPN PLAYOFFS - static playoff-period data for 2020-2022.
// weeklyMatchups: one row per ACTUAL NFL week (from pointsByScoringPeriod) -
// use this for points-for/against and per-week averages.
// roundMatchups: one row per bracket round using the REAL combined-total
// result (a round can span multiple weeks) - use this for win/loss only.
// ownerBracket: playoffs vs toilet bowl, derived from final rank vs
// that season's playoffTeamCount (ESPN doesn't tag bracket type per game).
// ============================================================
const ESPN_PLAYOFFS = {
  "2020": {
    "playoffTeamCount": 4,
    "weeklyMatchups": [
      {
        "week": 14,
        "homeOwner": "Carson Waite",
        "homeScore": 134.04,
        "awayOwner": "Alvin Pokel",
        "awayScore": 135.36
      },
      {
        "week": 15,
        "homeOwner": "Carson Waite",
        "homeScore": 132.4,
        "awayOwner": "Alvin Pokel",
        "awayScore": 111.12
      },
      {
        "week": 14,
        "homeOwner": "Austin Farris",
        "homeScore": 156.12,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 152.12
      },
      {
        "week": 15,
        "homeOwner": "Austin Farris",
        "homeScore": 160.96,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 143.96
      },
      {
        "week": 14,
        "homeOwner": "James McNeal",
        "homeScore": 118.94,
        "awayOwner": "Braden Galvan",
        "awayScore": 114.8
      },
      {
        "week": 15,
        "homeOwner": "James McNeal",
        "homeScore": 75.74,
        "awayOwner": "Braden Galvan",
        "awayScore": 140.92
      },
      {
        "week": 14,
        "homeOwner": "Rayaan Vellani",
        "homeScore": 100.14,
        "awayOwner": "Zach Sullivan",
        "awayScore": 107.86
      },
      {
        "week": 15,
        "homeOwner": "Rayaan Vellani",
        "homeScore": 156.52,
        "awayOwner": "Zach Sullivan",
        "awayScore": 148.52
      },
      {
        "week": 14,
        "homeOwner": "Shivam Patel",
        "homeScore": 78.76,
        "awayOwner": "Kiran Nevill",
        "awayScore": 79.28
      },
      {
        "week": 15,
        "homeOwner": "Shivam Patel",
        "homeScore": 94.04,
        "awayOwner": "Kiran Nevill",
        "awayScore": 61.56
      },
      {
        "week": 16,
        "homeOwner": "Carson Waite",
        "homeScore": 154.12,
        "awayOwner": "Austin Farris",
        "awayScore": 134.8
      },
      {
        "week": 17,
        "homeOwner": "Carson Waite",
        "homeScore": 141.5,
        "awayOwner": "Austin Farris",
        "awayScore": 130.14
      },
      {
        "week": 16,
        "homeOwner": "Tyler Ahrens",
        "homeScore": 137.12,
        "awayOwner": "Alvin Pokel",
        "awayScore": 172.56
      },
      {
        "week": 17,
        "homeOwner": "Tyler Ahrens",
        "homeScore": 112.08,
        "awayOwner": "Alvin Pokel",
        "awayScore": 172.7
      },
      {
        "week": 16,
        "homeOwner": "Braden Galvan",
        "homeScore": 111.24,
        "awayOwner": "Rayaan Vellani",
        "awayScore": 102.08
      },
      {
        "week": 17,
        "homeOwner": "Braden Galvan",
        "homeScore": 139.4,
        "awayOwner": "Rayaan Vellani",
        "awayScore": 109.08
      },
      {
        "week": 16,
        "homeOwner": "James McNeal",
        "homeScore": 171.5,
        "awayOwner": "Shivam Patel",
        "awayScore": 147.68
      },
      {
        "week": 17,
        "homeOwner": "James McNeal",
        "homeScore": 83.94,
        "awayOwner": "Shivam Patel",
        "awayScore": 75.88
      },
      {
        "week": 16,
        "homeOwner": "Zach Sullivan",
        "homeScore": 98.52,
        "awayOwner": "Kiran Nevill",
        "awayScore": 61.26
      },
      {
        "week": 17,
        "homeOwner": "Zach Sullivan",
        "homeScore": 154.22,
        "awayOwner": "Kiran Nevill",
        "awayScore": 85.6
      }
    ],
    "roundMatchups": [
      {
        "round": 14,
        "homeOwner": "Carson Waite",
        "homeTotal": 266.44,
        "awayOwner": "Alvin Pokel",
        "awayTotal": 246.48,
        "winner": "HOME"
      },
      {
        "round": 14,
        "homeOwner": "Austin Farris",
        "homeTotal": 317.08,
        "awayOwner": "Tyler Ahrens",
        "awayTotal": 296.08,
        "winner": "HOME"
      },
      {
        "round": 14,
        "homeOwner": "James McNeal",
        "homeTotal": 194.68,
        "awayOwner": "Braden Galvan",
        "awayTotal": 255.72,
        "winner": "AWAY"
      },
      {
        "round": 14,
        "homeOwner": "Rayaan Vellani",
        "homeTotal": 256.66,
        "awayOwner": "Zach Sullivan",
        "awayTotal": 256.38,
        "winner": "HOME"
      },
      {
        "round": 14,
        "homeOwner": "Shivam Patel",
        "homeTotal": 172.8,
        "awayOwner": "Kiran Nevill",
        "awayTotal": 140.84,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "Carson Waite",
        "homeTotal": 295.62,
        "awayOwner": "Austin Farris",
        "awayTotal": 264.94,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "Tyler Ahrens",
        "homeTotal": 249.2,
        "awayOwner": "Alvin Pokel",
        "awayTotal": 345.26,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Braden Galvan",
        "homeTotal": 250.64,
        "awayOwner": "Rayaan Vellani",
        "awayTotal": 211.16,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "James McNeal",
        "homeTotal": 255.44,
        "awayOwner": "Shivam Patel",
        "awayTotal": 223.56,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "Zach Sullivan",
        "homeTotal": 252.74,
        "awayOwner": "Kiran Nevill",
        "awayTotal": 146.86,
        "winner": "HOME"
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
    "weeklyMatchups": [
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
    "roundMatchups": [
      {
        "round": 15,
        "homeOwner": "Tyler Ahrens",
        "homeTotal": 82.48,
        "awayOwner": "Tyler Armstrong",
        "awayTotal": 119.66,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Austin Farris",
        "homeTotal": 139.86,
        "awayOwner": "Zach Sullivan",
        "awayTotal": 64.26,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "James McNeal",
        "homeTotal": 67.88,
        "awayOwner": "Matthew Jensen",
        "awayTotal": 90.98,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Seth Hendrickson",
        "homeTotal": 81.8,
        "awayOwner": "Alvin Pokel",
        "awayTotal": 106.44,
        "winner": "AWAY"
      },
      {
        "round": 16,
        "homeOwner": "Shivam Patel",
        "homeTotal": 149.08,
        "awayOwner": "Tyler Armstrong",
        "awayTotal": 155.78,
        "winner": "AWAY"
      },
      {
        "round": 16,
        "homeOwner": "Braden Galvan",
        "homeTotal": 133.42,
        "awayOwner": "Austin Farris",
        "awayTotal": 83.58,
        "winner": "HOME"
      },
      {
        "round": 16,
        "homeOwner": "Tyler Ahrens",
        "homeTotal": 127.0,
        "awayOwner": "Zach Sullivan",
        "awayTotal": 68.6,
        "winner": "HOME"
      },
      {
        "round": 16,
        "homeOwner": "Matthew Jensen",
        "homeTotal": 101.84,
        "awayOwner": "Alvin Pokel",
        "awayTotal": 125.74,
        "winner": "AWAY"
      },
      {
        "round": 16,
        "homeOwner": "James McNeal",
        "homeTotal": 95.4,
        "awayOwner": "Seth Hendrickson",
        "awayTotal": 135.46,
        "winner": "AWAY"
      },
      {
        "round": 17,
        "homeOwner": "Braden Galvan",
        "homeTotal": 133.36,
        "awayOwner": "Tyler Armstrong",
        "awayTotal": 134.5,
        "winner": "AWAY"
      },
      {
        "round": 17,
        "homeOwner": "Shivam Patel",
        "homeTotal": 113.62,
        "awayOwner": "Austin Farris",
        "awayTotal": 119.16,
        "winner": "AWAY"
      },
      {
        "round": 17,
        "homeOwner": "Tyler Ahrens",
        "homeTotal": 137.32,
        "awayOwner": "Zach Sullivan",
        "awayTotal": 128.38,
        "winner": "HOME"
      },
      {
        "round": 17,
        "homeOwner": "Seth Hendrickson",
        "homeTotal": 119.7,
        "awayOwner": "Alvin Pokel",
        "awayTotal": 106.28,
        "winner": "HOME"
      },
      {
        "round": 17,
        "homeOwner": "James McNeal",
        "homeTotal": 95.54,
        "awayOwner": "Matthew Jensen",
        "awayTotal": 123.94,
        "winner": "AWAY"
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
    "weeklyMatchups": [
      {
        "week": 14,
        "homeOwner": "Tyler Armstrong",
        "homeScore": 117.76,
        "awayOwner": "Austin Farris",
        "awayScore": 110.38
      },
      {
        "week": 15,
        "homeOwner": "Tyler Armstrong",
        "homeScore": 167.0,
        "awayOwner": "Austin Farris",
        "awayScore": 115.92
      },
      {
        "week": 14,
        "homeOwner": "Rohan Shani",
        "homeScore": 95.16,
        "awayOwner": "Colin Lenseigne",
        "awayScore": 108.18
      },
      {
        "week": 15,
        "homeOwner": "Rohan Shani",
        "homeScore": 112.3,
        "awayOwner": "Colin Lenseigne",
        "awayScore": 149.56
      },
      {
        "week": 14,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 109.02,
        "awayOwner": "Alvin Pokel",
        "awayScore": 84.48
      },
      {
        "week": 15,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 156.68,
        "awayOwner": "Alvin Pokel",
        "awayScore": 148.9
      },
      {
        "week": 14,
        "homeOwner": "Megan Gelber",
        "homeScore": 136.92,
        "awayOwner": "Shivam Patel",
        "awayScore": 114.74
      },
      {
        "week": 15,
        "homeOwner": "Megan Gelber",
        "homeScore": 115.72,
        "awayOwner": "Shivam Patel",
        "awayScore": 117.84
      },
      {
        "week": 14,
        "homeOwner": "Braden Galvan",
        "homeScore": 86.76,
        "awayOwner": "Zach Sullivan",
        "awayScore": 119.0
      },
      {
        "week": 15,
        "homeOwner": "Braden Galvan",
        "homeScore": 135.78,
        "awayOwner": "Zach Sullivan",
        "awayScore": 137.4
      },
      {
        "week": 14,
        "homeOwner": "Sydney & Olivia",
        "homeScore": 142.38,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 126.1
      },
      {
        "week": 15,
        "homeOwner": "Sydney & Olivia",
        "homeScore": 139.14,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 90.28
      },
      {
        "week": 16,
        "homeOwner": "Tyler Armstrong",
        "homeScore": 162.2,
        "awayOwner": "Colin Lenseigne",
        "awayScore": 147.48
      },
      {
        "week": 17,
        "homeOwner": "Tyler Armstrong",
        "homeScore": 133.6,
        "awayOwner": "Colin Lenseigne",
        "awayScore": 101.1
      },
      {
        "week": 16,
        "homeOwner": "Rohan Shani",
        "homeScore": 120.4,
        "awayOwner": "Austin Farris",
        "awayScore": 142.2
      },
      {
        "week": 17,
        "homeOwner": "Rohan Shani",
        "homeScore": 120.16,
        "awayOwner": "Austin Farris",
        "awayScore": 127.38
      },
      {
        "week": 16,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 123.46,
        "awayOwner": "Megan Gelber",
        "awayScore": 146.36
      },
      {
        "week": 17,
        "homeOwner": "Seth Hendrickson",
        "homeScore": 89.8,
        "awayOwner": "Megan Gelber",
        "awayScore": 72.48
      },
      {
        "week": 16,
        "homeOwner": "Alvin Pokel",
        "homeScore": 74.7,
        "awayOwner": "Zach Sullivan",
        "awayScore": 127.46
      },
      {
        "week": 17,
        "homeOwner": "Alvin Pokel",
        "homeScore": 95.5,
        "awayOwner": "Zach Sullivan",
        "awayScore": 130.1
      },
      {
        "week": 16,
        "homeOwner": "Shivam Patel",
        "homeScore": 100.7,
        "awayOwner": "Sydney & Olivia",
        "awayScore": 139.66
      },
      {
        "week": 17,
        "homeOwner": "Shivam Patel",
        "homeScore": 96.06,
        "awayOwner": "Sydney & Olivia",
        "awayScore": 106.22
      },
      {
        "week": 16,
        "homeOwner": "Braden Galvan",
        "homeScore": 124.06,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 97.1
      },
      {
        "week": 17,
        "homeOwner": "Braden Galvan",
        "homeScore": 88.48,
        "awayOwner": "Tyler Ahrens",
        "awayScore": 88.7
      }
    ],
    "roundMatchups": [
      {
        "round": 14,
        "homeOwner": "Tyler Armstrong",
        "homeTotal": 284.76,
        "awayOwner": "Austin Farris",
        "awayTotal": 226.3,
        "winner": "HOME"
      },
      {
        "round": 14,
        "homeOwner": "Rohan Shani",
        "homeTotal": 207.46,
        "awayOwner": "Colin Lenseigne",
        "awayTotal": 257.74,
        "winner": "AWAY"
      },
      {
        "round": 14,
        "homeOwner": "Seth Hendrickson",
        "homeTotal": 265.7,
        "awayOwner": "Alvin Pokel",
        "awayTotal": 233.38,
        "winner": "HOME"
      },
      {
        "round": 14,
        "homeOwner": "Megan Gelber",
        "homeTotal": 252.64,
        "awayOwner": "Shivam Patel",
        "awayTotal": 232.58,
        "winner": "HOME"
      },
      {
        "round": 14,
        "homeOwner": "Braden Galvan",
        "homeTotal": 222.54,
        "awayOwner": "Zach Sullivan",
        "awayTotal": 256.4,
        "winner": "AWAY"
      },
      {
        "round": 14,
        "homeOwner": "Sydney & Olivia",
        "homeTotal": 281.52,
        "awayOwner": "Tyler Ahrens",
        "awayTotal": 216.38,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "Tyler Armstrong",
        "homeTotal": 295.8,
        "awayOwner": "Colin Lenseigne",
        "awayTotal": 248.58,
        "winner": "HOME"
      },
      {
        "round": 15,
        "homeOwner": "Rohan Shani",
        "homeTotal": 240.56,
        "awayOwner": "Austin Farris",
        "awayTotal": 269.58,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Seth Hendrickson",
        "homeTotal": 213.26,
        "awayOwner": "Megan Gelber",
        "awayTotal": 218.84,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Alvin Pokel",
        "homeTotal": 170.2,
        "awayOwner": "Zach Sullivan",
        "awayTotal": 257.56,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Shivam Patel",
        "homeTotal": 196.76,
        "awayOwner": "Sydney & Olivia",
        "awayTotal": 245.88,
        "winner": "AWAY"
      },
      {
        "round": 15,
        "homeOwner": "Braden Galvan",
        "homeTotal": 212.54,
        "awayOwner": "Tyler Ahrens",
        "awayTotal": 185.8,
        "winner": "HOME"
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
