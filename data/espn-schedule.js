// ============================================================
// ESPN SCHEDULE - static weekly regular-season matchup results for
// 2020-2022, extracted from the 'schedule' field already embedded
// in Austin's originally-uploaded league files (never used until now).
// Regular season only (playoff weeks excluded via matchupPeriodCount).
// Enables Head-to-Head, Luck Factor, and Consistency for ESPN years.
// ============================================================
const ESPN_SCHEDULE = {
  "2020": [
    {
      "week": 1,
      "homeOwner": "Carson Waite",
      "homeScore": 135.96,
      "awayOwner": "Shivam Patel",
      "awayScore": 117.3
    },
    {
      "week": 1,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 142.16,
      "awayOwner": "Alvin Pokel",
      "awayScore": 112.92
    },
    {
      "week": 1,
      "homeOwner": "Austin Farris",
      "homeScore": 132.38,
      "awayOwner": "James McNeal",
      "awayScore": 155.9
    },
    {
      "week": 1,
      "homeOwner": "Kiran Nevill",
      "homeScore": 102.64,
      "awayOwner": "Rayaan Vellani",
      "awayScore": 99.66
    },
    {
      "week": 1,
      "homeOwner": "Zach Sullivan",
      "homeScore": 148.18,
      "awayOwner": "Braden Galvan",
      "awayScore": 92.34
    },
    {
      "week": 2,
      "homeOwner": "Alvin Pokel",
      "homeScore": 142.7,
      "awayOwner": "James McNeal",
      "awayScore": 89.66
    },
    {
      "week": 2,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 182.44,
      "awayOwner": "Carson Waite",
      "awayScore": 119.36
    },
    {
      "week": 2,
      "homeOwner": "Braden Galvan",
      "homeScore": 111.3,
      "awayOwner": "Shivam Patel",
      "awayScore": 125.64
    },
    {
      "week": 2,
      "homeOwner": "Kiran Nevill",
      "homeScore": 98.48,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 143.28
    },
    {
      "week": 2,
      "homeOwner": "Zach Sullivan",
      "homeScore": 114.12,
      "awayOwner": "Austin Farris",
      "awayScore": 148.7
    },
    {
      "week": 3,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 120.48,
      "awayOwner": "Braden Galvan",
      "awayScore": 122.48
    },
    {
      "week": 3,
      "homeOwner": "Alvin Pokel",
      "homeScore": 120.68,
      "awayOwner": "Kiran Nevill",
      "awayScore": 142.4
    },
    {
      "week": 3,
      "homeOwner": "James McNeal",
      "homeScore": 146.08,
      "awayOwner": "Zach Sullivan",
      "awayScore": 142.8
    },
    {
      "week": 3,
      "homeOwner": "Carson Waite",
      "homeScore": 146.74,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 127.02
    },
    {
      "week": 3,
      "homeOwner": "Shivam Patel",
      "homeScore": 120.1,
      "awayOwner": "Austin Farris",
      "awayScore": 138.24
    },
    {
      "week": 4,
      "homeOwner": "Kiran Nevill",
      "homeScore": 78.24,
      "awayOwner": "Zach Sullivan",
      "awayScore": 70.3
    },
    {
      "week": 4,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 130.8,
      "awayOwner": "Rayaan Vellani",
      "awayScore": 191.7
    },
    {
      "week": 4,
      "homeOwner": "Austin Farris",
      "homeScore": 130.72,
      "awayOwner": "Braden Galvan",
      "awayScore": 112.98
    },
    {
      "week": 4,
      "homeOwner": "Carson Waite",
      "homeScore": 128.3,
      "awayOwner": "Alvin Pokel",
      "awayScore": 133.7
    },
    {
      "week": 4,
      "homeOwner": "Shivam Patel",
      "homeScore": 104.42,
      "awayOwner": "James McNeal",
      "awayScore": 115.32
    },
    {
      "week": 5,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 161.94,
      "awayOwner": "Austin Farris",
      "awayScore": 127.42
    },
    {
      "week": 5,
      "homeOwner": "Kiran Nevill",
      "homeScore": 114.4,
      "awayOwner": "Carson Waite",
      "awayScore": 118.92
    },
    {
      "week": 5,
      "homeOwner": "Zach Sullivan",
      "homeScore": 144.18,
      "awayOwner": "Shivam Patel",
      "awayScore": 142.7
    },
    {
      "week": 5,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 130.98,
      "awayOwner": "Alvin Pokel",
      "awayScore": 150.16
    },
    {
      "week": 5,
      "homeOwner": "Braden Galvan",
      "homeScore": 116.94,
      "awayOwner": "James McNeal",
      "awayScore": 115.5
    },
    {
      "week": 6,
      "homeOwner": "Shivam Patel",
      "homeScore": 141.32,
      "awayOwner": "Alvin Pokel",
      "awayScore": 114.5
    },
    {
      "week": 6,
      "homeOwner": "James McNeal",
      "homeScore": 135.84,
      "awayOwner": "Rayaan Vellani",
      "awayScore": 78.78
    },
    {
      "week": 6,
      "homeOwner": "Braden Galvan",
      "homeScore": 78.7,
      "awayOwner": "Kiran Nevill",
      "awayScore": 83.9
    },
    {
      "week": 6,
      "homeOwner": "Zach Sullivan",
      "homeScore": 123.32,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 100.74
    },
    {
      "week": 6,
      "homeOwner": "Austin Farris",
      "homeScore": 104.18,
      "awayOwner": "Carson Waite",
      "awayScore": 113.14
    },
    {
      "week": 7,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 111.42,
      "awayOwner": "Shivam Patel",
      "awayScore": 113.5
    },
    {
      "week": 7,
      "homeOwner": "Kiran Nevill",
      "homeScore": 121.4,
      "awayOwner": "James McNeal",
      "awayScore": 175.18
    },
    {
      "week": 7,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 98.12,
      "awayOwner": "Braden Galvan",
      "awayScore": 153.22
    },
    {
      "week": 7,
      "homeOwner": "Carson Waite",
      "homeScore": 118.44,
      "awayOwner": "Zach Sullivan",
      "awayScore": 111.06
    },
    {
      "week": 7,
      "homeOwner": "Alvin Pokel",
      "homeScore": 136.06,
      "awayOwner": "Austin Farris",
      "awayScore": 114.98
    },
    {
      "week": 8,
      "homeOwner": "Shivam Patel",
      "homeScore": 89.48,
      "awayOwner": "Kiran Nevill",
      "awayScore": 96.44
    },
    {
      "week": 8,
      "homeOwner": "James McNeal",
      "homeScore": 137.04,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 144.96
    },
    {
      "week": 8,
      "homeOwner": "Braden Galvan",
      "homeScore": 82.24,
      "awayOwner": "Carson Waite",
      "awayScore": 111.16
    },
    {
      "week": 8,
      "homeOwner": "Zach Sullivan",
      "homeScore": 102.52,
      "awayOwner": "Alvin Pokel",
      "awayScore": 134.66
    },
    {
      "week": 8,
      "homeOwner": "Austin Farris",
      "homeScore": 105.96,
      "awayOwner": "Rayaan Vellani",
      "awayScore": 89.42
    },
    {
      "week": 9,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 128.34,
      "awayOwner": "Shivam Patel",
      "awayScore": 107.42
    },
    {
      "week": 9,
      "homeOwner": "Carson Waite",
      "homeScore": 141.94,
      "awayOwner": "Kiran Nevill",
      "awayScore": 75.98
    },
    {
      "week": 9,
      "homeOwner": "James McNeal",
      "homeScore": 118.1,
      "awayOwner": "Austin Farris",
      "awayScore": 154.2
    },
    {
      "week": 9,
      "homeOwner": "Alvin Pokel",
      "homeScore": 127.04,
      "awayOwner": "Rayaan Vellani",
      "awayScore": 123.02
    },
    {
      "week": 9,
      "homeOwner": "Braden Galvan",
      "homeScore": 107.0,
      "awayOwner": "Zach Sullivan",
      "awayScore": 91.1
    },
    {
      "week": 10,
      "homeOwner": "Carson Waite",
      "homeScore": 95.82,
      "awayOwner": "James McNeal",
      "awayScore": 92.02
    },
    {
      "week": 10,
      "homeOwner": "Alvin Pokel",
      "homeScore": 79.92,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 111.28
    },
    {
      "week": 10,
      "homeOwner": "Shivam Patel",
      "homeScore": 99.9,
      "awayOwner": "Braden Galvan",
      "awayScore": 122.9
    },
    {
      "week": 10,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 112.98,
      "awayOwner": "Kiran Nevill",
      "awayScore": 82.18
    },
    {
      "week": 10,
      "homeOwner": "Austin Farris",
      "homeScore": 118.66,
      "awayOwner": "Zach Sullivan",
      "awayScore": 124.86
    },
    {
      "week": 11,
      "homeOwner": "Alvin Pokel",
      "homeScore": 139.46,
      "awayOwner": "Braden Galvan",
      "awayScore": 126.24
    },
    {
      "week": 11,
      "homeOwner": "Carson Waite",
      "homeScore": 97.78,
      "awayOwner": "Rayaan Vellani",
      "awayScore": 142.18
    },
    {
      "week": 11,
      "homeOwner": "Zach Sullivan",
      "homeScore": 101.84,
      "awayOwner": "James McNeal",
      "awayScore": 160.08
    },
    {
      "week": 11,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 151.9,
      "awayOwner": "Kiran Nevill",
      "awayScore": 118.04
    },
    {
      "week": 11,
      "homeOwner": "Austin Farris",
      "homeScore": 96.72,
      "awayOwner": "Shivam Patel",
      "awayScore": 120.36
    },
    {
      "week": 12,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 107.72,
      "awayOwner": "Zach Sullivan",
      "awayScore": 195.0
    },
    {
      "week": 12,
      "homeOwner": "Kiran Nevill",
      "homeScore": 81.92,
      "awayOwner": "Alvin Pokel",
      "awayScore": 158.32
    },
    {
      "week": 12,
      "homeOwner": "Braden Galvan",
      "homeScore": 131.94,
      "awayOwner": "Austin Farris",
      "awayScore": 133.18
    },
    {
      "week": 12,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 116.74,
      "awayOwner": "Carson Waite",
      "awayScore": 113.64
    },
    {
      "week": 12,
      "homeOwner": "James McNeal",
      "homeScore": 108.3,
      "awayOwner": "Shivam Patel",
      "awayScore": 105.6
    },
    {
      "week": 13,
      "homeOwner": "Kiran Nevill",
      "homeScore": 64.14,
      "awayOwner": "Austin Farris",
      "awayScore": 162.1
    },
    {
      "week": 13,
      "homeOwner": "Rayaan Vellani",
      "homeScore": 122.68,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 118.16
    },
    {
      "week": 13,
      "homeOwner": "Shivam Patel",
      "homeScore": 103.66,
      "awayOwner": "Zach Sullivan",
      "awayScore": 95.22
    },
    {
      "week": 13,
      "homeOwner": "Alvin Pokel",
      "homeScore": 95.54,
      "awayOwner": "Carson Waite",
      "awayScore": 119.1
    },
    {
      "week": 13,
      "homeOwner": "James McNeal",
      "homeScore": 110.22,
      "awayOwner": "Braden Galvan",
      "awayScore": 167.3
    }
  ],
  "2021": [
    {
      "week": 1,
      "homeOwner": "Braden Galvan",
      "homeScore": 119.78,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 95.9
    },
    {
      "week": 1,
      "homeOwner": "Zach Sullivan",
      "homeScore": 91.0,
      "awayOwner": "Alvin Pokel",
      "awayScore": 124.26
    },
    {
      "week": 1,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 148.96,
      "awayOwner": "Austin Farris",
      "awayScore": 158.34
    },
    {
      "week": 1,
      "homeOwner": "Matthew Jensen",
      "homeScore": 111.46,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 137.8
    },
    {
      "week": 1,
      "homeOwner": "James McNeal",
      "homeScore": 171.52,
      "awayOwner": "Shivam Patel",
      "awayScore": 112.72
    },
    {
      "week": 2,
      "homeOwner": "Alvin Pokel",
      "homeScore": 95.12,
      "awayOwner": "Austin Farris",
      "awayScore": 156.02
    },
    {
      "week": 2,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 145.5,
      "awayOwner": "Braden Galvan",
      "awayScore": 178.92
    },
    {
      "week": 2,
      "homeOwner": "Shivam Patel",
      "homeScore": 148.9,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 98.86
    },
    {
      "week": 2,
      "homeOwner": "Matthew Jensen",
      "homeScore": 145.32,
      "awayOwner": "Zach Sullivan",
      "awayScore": 106.26
    },
    {
      "week": 2,
      "homeOwner": "James McNeal",
      "homeScore": 100.58,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 126.54
    },
    {
      "week": 3,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 109.64,
      "awayOwner": "Shivam Patel",
      "awayScore": 131.04
    },
    {
      "week": 3,
      "homeOwner": "Alvin Pokel",
      "homeScore": 129.94,
      "awayOwner": "Matthew Jensen",
      "awayScore": 94.02
    },
    {
      "week": 3,
      "homeOwner": "Austin Farris",
      "homeScore": 158.52,
      "awayOwner": "James McNeal",
      "awayScore": 108.02
    },
    {
      "week": 3,
      "homeOwner": "Braden Galvan",
      "homeScore": 130.5,
      "awayOwner": "Zach Sullivan",
      "awayScore": 168.78
    },
    {
      "week": 3,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 126.54,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 113.78
    },
    {
      "week": 4,
      "homeOwner": "Matthew Jensen",
      "homeScore": 122.96,
      "awayOwner": "James McNeal",
      "awayScore": 121.62
    },
    {
      "week": 4,
      "homeOwner": "Zach Sullivan",
      "homeScore": 115.14,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 97.92
    },
    {
      "week": 4,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 110.96,
      "awayOwner": "Shivam Patel",
      "awayScore": 145.82
    },
    {
      "week": 4,
      "homeOwner": "Braden Galvan",
      "homeScore": 154.32,
      "awayOwner": "Alvin Pokel",
      "awayScore": 138.38
    },
    {
      "week": 4,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 96.12,
      "awayOwner": "Austin Farris",
      "awayScore": 123.0
    },
    {
      "week": 5,
      "homeOwner": "Zach Sullivan",
      "homeScore": 114.28,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 109.74
    },
    {
      "week": 5,
      "homeOwner": "Matthew Jensen",
      "homeScore": 114.48,
      "awayOwner": "Braden Galvan",
      "awayScore": 152.28
    },
    {
      "week": 5,
      "homeOwner": "James McNeal",
      "homeScore": 127.88,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 141.4
    },
    {
      "week": 5,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 166.16,
      "awayOwner": "Alvin Pokel",
      "awayScore": 135.72
    },
    {
      "week": 5,
      "homeOwner": "Shivam Patel",
      "homeScore": 166.06,
      "awayOwner": "Austin Farris",
      "awayScore": 127.0
    },
    {
      "week": 6,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 118.92,
      "awayOwner": "Alvin Pokel",
      "awayScore": 101.7
    },
    {
      "week": 6,
      "homeOwner": "Austin Farris",
      "homeScore": 146.34,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 134.26
    },
    {
      "week": 6,
      "homeOwner": "Shivam Patel",
      "homeScore": 137.1,
      "awayOwner": "Matthew Jensen",
      "awayScore": 96.98
    },
    {
      "week": 6,
      "homeOwner": "James McNeal",
      "homeScore": 162.7,
      "awayOwner": "Zach Sullivan",
      "awayScore": 132.38
    },
    {
      "week": 6,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 130.68,
      "awayOwner": "Braden Galvan",
      "awayScore": 117.08
    },
    {
      "week": 7,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 140.94,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 99.14
    },
    {
      "week": 7,
      "homeOwner": "Matthew Jensen",
      "homeScore": 120.58,
      "awayOwner": "Austin Farris",
      "awayScore": 105.36
    },
    {
      "week": 7,
      "homeOwner": "Zach Sullivan",
      "homeScore": 143.68,
      "awayOwner": "Shivam Patel",
      "awayScore": 152.86
    },
    {
      "week": 7,
      "homeOwner": "Braden Galvan",
      "homeScore": 99.14,
      "awayOwner": "James McNeal",
      "awayScore": 170.24
    },
    {
      "week": 7,
      "homeOwner": "Alvin Pokel",
      "homeScore": 106.04,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 110.84
    },
    {
      "week": 8,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 114.36,
      "awayOwner": "Matthew Jensen",
      "awayScore": 100.86
    },
    {
      "week": 8,
      "homeOwner": "Austin Farris",
      "homeScore": 127.3,
      "awayOwner": "Zach Sullivan",
      "awayScore": 133.88
    },
    {
      "week": 8,
      "homeOwner": "Shivam Patel",
      "homeScore": 127.06,
      "awayOwner": "Braden Galvan",
      "awayScore": 117.8
    },
    {
      "week": 8,
      "homeOwner": "James McNeal",
      "homeScore": 116.86,
      "awayOwner": "Alvin Pokel",
      "awayScore": 75.82
    },
    {
      "week": 8,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 158.8,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 71.36
    },
    {
      "week": 9,
      "homeOwner": "Zach Sullivan",
      "homeScore": 119.94,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 94.06
    },
    {
      "week": 9,
      "homeOwner": "Braden Galvan",
      "homeScore": 76.74,
      "awayOwner": "Matthew Jensen",
      "awayScore": 141.1
    },
    {
      "week": 9,
      "homeOwner": "Austin Farris",
      "homeScore": 93.46,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 116.38
    },
    {
      "week": 9,
      "homeOwner": "Alvin Pokel",
      "homeScore": 100.64,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 103.14
    },
    {
      "week": 9,
      "homeOwner": "Shivam Patel",
      "homeScore": 102.82,
      "awayOwner": "James McNeal",
      "awayScore": 85.48
    },
    {
      "week": 10,
      "homeOwner": "Braden Galvan",
      "homeScore": 127.44,
      "awayOwner": "Austin Farris",
      "awayScore": 100.42
    },
    {
      "week": 10,
      "homeOwner": "Alvin Pokel",
      "homeScore": 76.5,
      "awayOwner": "Zach Sullivan",
      "awayScore": 88.02
    },
    {
      "week": 10,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 110.0,
      "awayOwner": "Shivam Patel",
      "awayScore": 135.48
    },
    {
      "week": 10,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 141.44,
      "awayOwner": "Matthew Jensen",
      "awayScore": 109.44
    },
    {
      "week": 10,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 108.0,
      "awayOwner": "James McNeal",
      "awayScore": 108.84
    },
    {
      "week": 11,
      "homeOwner": "Alvin Pokel",
      "homeScore": 95.68,
      "awayOwner": "Shivam Patel",
      "awayScore": 150.2
    },
    {
      "week": 11,
      "homeOwner": "Braden Galvan",
      "homeScore": 99.9,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 131.6
    },
    {
      "week": 11,
      "homeOwner": "James McNeal",
      "homeScore": 103.84,
      "awayOwner": "Austin Farris",
      "awayScore": 105.52
    },
    {
      "week": 11,
      "homeOwner": "Zach Sullivan",
      "homeScore": 105.3,
      "awayOwner": "Matthew Jensen",
      "awayScore": 132.58
    },
    {
      "week": 11,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 147.28,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 106.46
    },
    {
      "week": 12,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 72.74,
      "awayOwner": "James McNeal",
      "awayScore": 142.0
    },
    {
      "week": 12,
      "homeOwner": "Matthew Jensen",
      "homeScore": 81.52,
      "awayOwner": "Alvin Pokel",
      "awayScore": 107.26
    },
    {
      "week": 12,
      "homeOwner": "Shivam Patel",
      "homeScore": 151.58,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 124.94
    },
    {
      "week": 12,
      "homeOwner": "Zach Sullivan",
      "homeScore": 84.6,
      "awayOwner": "Braden Galvan",
      "awayScore": 116.82
    },
    {
      "week": 12,
      "homeOwner": "Austin Farris",
      "homeScore": 116.78,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 130.3
    },
    {
      "week": 13,
      "homeOwner": "Matthew Jensen",
      "homeScore": 117.4,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 124.42
    },
    {
      "week": 13,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 181.62,
      "awayOwner": "Zach Sullivan",
      "awayScore": 155.32
    },
    {
      "week": 13,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 94.4,
      "awayOwner": "James McNeal",
      "awayScore": 82.42
    },
    {
      "week": 13,
      "homeOwner": "Alvin Pokel",
      "homeScore": 109.18,
      "awayOwner": "Braden Galvan",
      "awayScore": 114.56
    },
    {
      "week": 13,
      "homeOwner": "Austin Farris",
      "homeScore": 167.8,
      "awayOwner": "Shivam Patel",
      "awayScore": 111.26
    },
    {
      "week": 14,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 139.52,
      "awayOwner": "Braden Galvan",
      "awayScore": 156.42
    },
    {
      "week": 14,
      "homeOwner": "Austin Farris",
      "homeScore": 144.48,
      "awayOwner": "Alvin Pokel",
      "awayScore": 129.1
    },
    {
      "week": 14,
      "homeOwner": "Shivam Patel",
      "homeScore": 149.04,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 140.22
    },
    {
      "week": 14,
      "homeOwner": "James McNeal",
      "homeScore": 96.04,
      "awayOwner": "Matthew Jensen",
      "awayScore": 107.84
    },
    {
      "week": 14,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 112.02,
      "awayOwner": "Zach Sullivan",
      "awayScore": 135.38
    }
  ],
  "2022": [
    {
      "week": 1,
      "homeOwner": "Braden Galvan",
      "homeScore": 110.22,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 130.6
    },
    {
      "week": 1,
      "homeOwner": "Rohan Shani",
      "homeScore": 154.6,
      "awayOwner": "Shivam Patel",
      "awayScore": 126.4
    },
    {
      "week": 1,
      "homeOwner": "Megan Gelber",
      "homeScore": 145.28,
      "awayOwner": "Sydney & Olivia",
      "awayScore": 120.6
    },
    {
      "week": 1,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 134.68,
      "awayOwner": "Zach Sullivan",
      "awayScore": 140.26
    },
    {
      "week": 1,
      "homeOwner": "Alvin Pokel",
      "homeScore": 126.52,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 116.12
    },
    {
      "week": 1,
      "homeOwner": "Austin Farris",
      "homeScore": 74.86,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 117.12
    },
    {
      "week": 2,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 131.26,
      "awayOwner": "Shivam Patel",
      "awayScore": 145.98
    },
    {
      "week": 2,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 114.3,
      "awayOwner": "Braden Galvan",
      "awayScore": 164.58
    },
    {
      "week": 2,
      "homeOwner": "Megan Gelber",
      "homeScore": 119.8,
      "awayOwner": "Rohan Shani",
      "awayScore": 95.88
    },
    {
      "week": 2,
      "homeOwner": "Zach Sullivan",
      "homeScore": 102.84,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 139.16
    },
    {
      "week": 2,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 147.22,
      "awayOwner": "Colin Lenseigne",
      "awayScore": 153.38
    },
    {
      "week": 2,
      "homeOwner": "Austin Farris",
      "homeScore": 105.66,
      "awayOwner": "Alvin Pokel",
      "awayScore": 129.92
    },
    {
      "week": 3,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 99.68,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 85.96
    },
    {
      "week": 3,
      "homeOwner": "Shivam Patel",
      "homeScore": 144.82,
      "awayOwner": "Megan Gelber",
      "awayScore": 146.24
    },
    {
      "week": 3,
      "homeOwner": "Braden Galvan",
      "homeScore": 117.96,
      "awayOwner": "Rohan Shani",
      "awayScore": 90.76
    },
    {
      "week": 3,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 131.22,
      "awayOwner": "Zach Sullivan",
      "awayScore": 105.5
    },
    {
      "week": 3,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 135.6,
      "awayOwner": "Austin Farris",
      "awayScore": 101.48
    },
    {
      "week": 3,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 143.0,
      "awayOwner": "Alvin Pokel",
      "awayScore": 120.4
    },
    {
      "week": 4,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 132.58,
      "awayOwner": "Megan Gelber",
      "awayScore": 88.66
    },
    {
      "week": 4,
      "homeOwner": "Rohan Shani",
      "homeScore": 163.46,
      "awayOwner": "Sydney & Olivia",
      "awayScore": 115.06
    },
    {
      "week": 4,
      "homeOwner": "Braden Galvan",
      "homeScore": 107.38,
      "awayOwner": "Shivam Patel",
      "awayScore": 144.22
    },
    {
      "week": 4,
      "homeOwner": "Zach Sullivan",
      "homeScore": 126.82,
      "awayOwner": "Austin Farris",
      "awayScore": 177.8
    },
    {
      "week": 4,
      "homeOwner": "Alvin Pokel",
      "homeScore": 128.66,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 115.56
    },
    {
      "week": 4,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 141.02,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 136.68
    },
    {
      "week": 5,
      "homeOwner": "Rohan Shani",
      "homeScore": 115.74,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 68.16
    },
    {
      "week": 5,
      "homeOwner": "Megan Gelber",
      "homeScore": 118.54,
      "awayOwner": "Braden Galvan",
      "awayScore": 122.5
    },
    {
      "week": 5,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 106.98,
      "awayOwner": "Shivam Patel",
      "awayScore": 134.64
    },
    {
      "week": 5,
      "homeOwner": "Alvin Pokel",
      "homeScore": 138.96,
      "awayOwner": "Zach Sullivan",
      "awayScore": 112.06
    },
    {
      "week": 5,
      "homeOwner": "Austin Farris",
      "homeScore": 117.52,
      "awayOwner": "Colin Lenseigne",
      "awayScore": 172.56
    },
    {
      "week": 5,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 140.56,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 146.18
    },
    {
      "week": 6,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 74.28,
      "awayOwner": "Zach Sullivan",
      "awayScore": 120.9
    },
    {
      "week": 6,
      "homeOwner": "Braden Galvan",
      "homeScore": 109.28,
      "awayOwner": "Colin Lenseigne",
      "awayScore": 123.56
    },
    {
      "week": 6,
      "homeOwner": "Shivam Patel",
      "homeScore": 128.9,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 140.2
    },
    {
      "week": 6,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 120.42,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 116.5
    },
    {
      "week": 6,
      "homeOwner": "Megan Gelber",
      "homeScore": 103.92,
      "awayOwner": "Austin Farris",
      "awayScore": 107.52
    },
    {
      "week": 6,
      "homeOwner": "Rohan Shani",
      "homeScore": 112.52,
      "awayOwner": "Alvin Pokel",
      "awayScore": 104.9
    },
    {
      "week": 7,
      "homeOwner": "Zach Sullivan",
      "homeScore": 125.38,
      "awayOwner": "Braden Galvan",
      "awayScore": 127.76
    },
    {
      "week": 7,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 148.1,
      "awayOwner": "Shivam Patel",
      "awayScore": 128.34
    },
    {
      "week": 7,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 153.34,
      "awayOwner": "Sydney & Olivia",
      "awayScore": 108.92
    },
    {
      "week": 7,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 126.0,
      "awayOwner": "Megan Gelber",
      "awayScore": 70.7
    },
    {
      "week": 7,
      "homeOwner": "Austin Farris",
      "homeScore": 152.12,
      "awayOwner": "Rohan Shani",
      "awayScore": 85.42
    },
    {
      "week": 7,
      "homeOwner": "Alvin Pokel",
      "homeScore": 110.84,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 111.34
    },
    {
      "week": 8,
      "homeOwner": "Shivam Patel",
      "homeScore": 160.84,
      "awayOwner": "Zach Sullivan",
      "awayScore": 123.74
    },
    {
      "week": 8,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 131.52,
      "awayOwner": "Colin Lenseigne",
      "awayScore": 136.32
    },
    {
      "week": 8,
      "homeOwner": "Megan Gelber",
      "homeScore": 114.3,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 148.34
    },
    {
      "week": 8,
      "homeOwner": "Rohan Shani",
      "homeScore": 151.08,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 135.22
    },
    {
      "week": 8,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 113.4,
      "awayOwner": "Austin Farris",
      "awayScore": 155.66
    },
    {
      "week": 8,
      "homeOwner": "Braden Galvan",
      "homeScore": 179.74,
      "awayOwner": "Alvin Pokel",
      "awayScore": 131.6
    },
    {
      "week": 9,
      "homeOwner": "Zach Sullivan",
      "homeScore": 100.3,
      "awayOwner": "Sydney & Olivia",
      "awayScore": 151.04
    },
    {
      "week": 9,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 114.6,
      "awayOwner": "Megan Gelber",
      "awayScore": 80.9
    },
    {
      "week": 9,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 108.54,
      "awayOwner": "Rohan Shani",
      "awayScore": 108.8
    },
    {
      "week": 9,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 136.82,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 135.28
    },
    {
      "week": 9,
      "homeOwner": "Austin Farris",
      "homeScore": 128.6,
      "awayOwner": "Braden Galvan",
      "awayScore": 76.5
    },
    {
      "week": 9,
      "homeOwner": "Alvin Pokel",
      "homeScore": 126.62,
      "awayOwner": "Shivam Patel",
      "awayScore": 123.26
    },
    {
      "week": 10,
      "homeOwner": "Megan Gelber",
      "homeScore": 127.42,
      "awayOwner": "Zach Sullivan",
      "awayScore": 90.68
    },
    {
      "week": 10,
      "homeOwner": "Rohan Shani",
      "homeScore": 143.76,
      "awayOwner": "Colin Lenseigne",
      "awayScore": 98.5
    },
    {
      "week": 10,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 115.84,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 149.1
    },
    {
      "week": 10,
      "homeOwner": "Braden Galvan",
      "homeScore": 109.4,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 129.58
    },
    {
      "week": 10,
      "homeOwner": "Shivam Patel",
      "homeScore": 122.42,
      "awayOwner": "Austin Farris",
      "awayScore": 143.64
    },
    {
      "week": 10,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 121.94,
      "awayOwner": "Alvin Pokel",
      "awayScore": 91.5
    },
    {
      "week": 11,
      "homeOwner": "Zach Sullivan",
      "homeScore": 123.7,
      "awayOwner": "Rohan Shani",
      "awayScore": 118.08
    },
    {
      "week": 11,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 122.88,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 118.44
    },
    {
      "week": 11,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 157.6,
      "awayOwner": "Braden Galvan",
      "awayScore": 121.44
    },
    {
      "week": 11,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 116.82,
      "awayOwner": "Shivam Patel",
      "awayScore": 81.48
    },
    {
      "week": 11,
      "homeOwner": "Austin Farris",
      "homeScore": 139.4,
      "awayOwner": "Sydney & Olivia",
      "awayScore": 96.02
    },
    {
      "week": 11,
      "homeOwner": "Alvin Pokel",
      "homeScore": 140.8,
      "awayOwner": "Megan Gelber",
      "awayScore": 152.12
    },
    {
      "week": 12,
      "homeOwner": "Zach Sullivan",
      "homeScore": 117.86,
      "awayOwner": "Tyler Ahrens",
      "awayScore": 110.06
    },
    {
      "week": 12,
      "homeOwner": "Colin Lenseigne",
      "homeScore": 152.62,
      "awayOwner": "Braden Galvan",
      "awayScore": 97.22
    },
    {
      "week": 12,
      "homeOwner": "Tyler Armstrong",
      "homeScore": 142.6,
      "awayOwner": "Shivam Patel",
      "awayScore": 122.4
    },
    {
      "week": 12,
      "homeOwner": "Seth Hendrickson",
      "homeScore": 117.16,
      "awayOwner": "Sydney & Olivia",
      "awayScore": 110.9
    },
    {
      "week": 12,
      "homeOwner": "Austin Farris",
      "homeScore": 160.66,
      "awayOwner": "Megan Gelber",
      "awayScore": 124.94
    },
    {
      "week": 12,
      "homeOwner": "Alvin Pokel",
      "homeScore": 119.82,
      "awayOwner": "Rohan Shani",
      "awayScore": 132.94
    },
    {
      "week": 13,
      "homeOwner": "Braden Galvan",
      "homeScore": 95.9,
      "awayOwner": "Zach Sullivan",
      "awayScore": 144.6
    },
    {
      "week": 13,
      "homeOwner": "Shivam Patel",
      "homeScore": 132.54,
      "awayOwner": "Colin Lenseigne",
      "awayScore": 113.52
    },
    {
      "week": 13,
      "homeOwner": "Sydney & Olivia",
      "homeScore": 116.92,
      "awayOwner": "Tyler Armstrong",
      "awayScore": 167.64
    },
    {
      "week": 13,
      "homeOwner": "Megan Gelber",
      "homeScore": 137.76,
      "awayOwner": "Seth Hendrickson",
      "awayScore": 118.96
    },
    {
      "week": 13,
      "homeOwner": "Rohan Shani",
      "homeScore": 84.08,
      "awayOwner": "Austin Farris",
      "awayScore": 100.1
    },
    {
      "week": 13,
      "homeOwner": "Tyler Ahrens",
      "homeScore": 117.4,
      "awayOwner": "Alvin Pokel",
      "awayScore": 170.1
    }
  ]
};
