// ============================================================
// ESPN DRAFT DATA - static picks for 2020-2022 (frozen history).
// Player names/positions are resolved LIVE via ESPN's public
// athlete lookup API (site.web.api.espn.com), since ESPN player IDs
// aren't in any file we have saved. Note: that endpoint returns each
// player's CURRENT team, not their team during that historical season -
// so team logos on these boards may not match what they wore that year.
// ============================================================
const ESPN_DRAFT_PICKS = {
  "2022": [
    {
      "round": 1,
      "pickInRound": 1,
      "overallPick": 1,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4242335
    },
    {
      "round": 1,
      "pickInRound": 2,
      "overallPick": 2,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 2977187
    },
    {
      "round": 1,
      "pickInRound": 3,
      "overallPick": 3,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3117251
    },
    {
      "round": 1,
      "pickInRound": 4,
      "overallPick": 4,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4262921
    },
    {
      "round": 1,
      "pickInRound": 5,
      "overallPick": 5,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 3068267
    },
    {
      "round": 1,
      "pickInRound": 6,
      "overallPick": 6,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3043078
    },
    {
      "round": 1,
      "pickInRound": 7,
      "overallPick": 7,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4241457
    },
    {
      "round": 1,
      "pickInRound": 8,
      "overallPick": 8,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 16800
    },
    {
      "round": 1,
      "pickInRound": 9,
      "overallPick": 9,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 3116593
    },
    {
      "round": 1,
      "pickInRound": 10,
      "overallPick": 10,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4362628
    },
    {
      "round": 1,
      "pickInRound": 11,
      "overallPick": 11,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4259545
    },
    {
      "round": 1,
      "pickInRound": 12,
      "overallPick": 12,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3054850
    },
    {
      "round": 2,
      "pickInRound": 1,
      "overallPick": 13,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3042519
    },
    {
      "round": 2,
      "pickInRound": 2,
      "overallPick": 14,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3116385
    },
    {
      "round": 2,
      "pickInRound": 3,
      "overallPick": 15,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3115364
    },
    {
      "round": 2,
      "pickInRound": 4,
      "overallPick": 16,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 2976212
    },
    {
      "round": 2,
      "pickInRound": 5,
      "overallPick": 17,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3126486
    },
    {
      "round": 2,
      "pickInRound": 6,
      "overallPick": 18,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 15847
    },
    {
      "round": 2,
      "pickInRound": 7,
      "overallPick": 19,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3116406
    },
    {
      "round": 2,
      "pickInRound": 8,
      "overallPick": 20,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4241389
    },
    {
      "round": 2,
      "pickInRound": 9,
      "overallPick": 21,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 3128720
    },
    {
      "round": 2,
      "pickInRound": 10,
      "overallPick": 22,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4361579
    },
    {
      "round": 2,
      "pickInRound": 11,
      "overallPick": 23,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 3929630
    },
    {
      "round": 2,
      "pickInRound": 12,
      "overallPick": 24,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 3116365
    },
    {
      "round": 3,
      "pickInRound": 1,
      "overallPick": 25,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 3045147
    },
    {
      "round": 3,
      "pickInRound": 2,
      "overallPick": 26,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 3918298
    },
    {
      "round": 3,
      "pickInRound": 3,
      "overallPick": 27,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 16737
    },
    {
      "round": 3,
      "pickInRound": 4,
      "overallPick": 28,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4035687
    },
    {
      "round": 3,
      "pickInRound": 5,
      "overallPick": 29,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4239993
    },
    {
      "round": 3,
      "pickInRound": 6,
      "overallPick": 30,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 15818
    },
    {
      "round": 3,
      "pickInRound": 7,
      "overallPick": 31,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3915416
    },
    {
      "round": 3,
      "pickInRound": 8,
      "overallPick": 32,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4360248
    },
    {
      "round": 3,
      "pickInRound": 9,
      "overallPick": 33,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4047646
    },
    {
      "round": 3,
      "pickInRound": 10,
      "overallPick": 34,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3932905
    },
    {
      "round": 3,
      "pickInRound": 11,
      "overallPick": 35,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3128429
    },
    {
      "round": 3,
      "pickInRound": 12,
      "overallPick": 36,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4372016
    },
    {
      "round": 4,
      "pickInRound": 1,
      "overallPick": 37,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4241372
    },
    {
      "round": 4,
      "pickInRound": 2,
      "overallPick": 38,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 16731
    },
    {
      "round": 4,
      "pickInRound": 3,
      "overallPick": 39,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4035538
    },
    {
      "round": 4,
      "pickInRound": 4,
      "overallPick": 40,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4427366
    },
    {
      "round": 4,
      "pickInRound": 5,
      "overallPick": 41,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3045138
    },
    {
      "round": 4,
      "pickInRound": 6,
      "overallPick": 42,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3051392
    },
    {
      "round": 4,
      "pickInRound": 7,
      "overallPick": 43,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 4240021
    },
    {
      "round": 4,
      "pickInRound": 8,
      "overallPick": 44,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4239996
    },
    {
      "round": 4,
      "pickInRound": 9,
      "overallPick": 45,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4242214
    },
    {
      "round": 4,
      "pickInRound": 10,
      "overallPick": 46,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3121422
    },
    {
      "round": 4,
      "pickInRound": 11,
      "overallPick": 47,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 4047365
    },
    {
      "round": 4,
      "pickInRound": 12,
      "overallPick": 48,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4047650
    },
    {
      "round": 5,
      "pickInRound": 1,
      "overallPick": 49,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4241463
    },
    {
      "round": 5,
      "pickInRound": 2,
      "overallPick": 50,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 3040151
    },
    {
      "round": 5,
      "pickInRound": 3,
      "overallPick": 51,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4243537
    },
    {
      "round": 5,
      "pickInRound": 4,
      "overallPick": 52,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4040655
    },
    {
      "round": 5,
      "pickInRound": 5,
      "overallPick": 53,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4038941
    },
    {
      "round": 5,
      "pickInRound": 6,
      "overallPick": 54,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3139477
    },
    {
      "round": 5,
      "pickInRound": 7,
      "overallPick": 55,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4374302
    },
    {
      "round": 5,
      "pickInRound": 8,
      "overallPick": 56,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4040715
    },
    {
      "round": 5,
      "pickInRound": 9,
      "overallPick": 57,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4045163
    },
    {
      "round": 5,
      "pickInRound": 10,
      "overallPick": 58,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3116165
    },
    {
      "round": 5,
      "pickInRound": 11,
      "overallPick": 59,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 2576925
    },
    {
      "round": 5,
      "pickInRound": 12,
      "overallPick": 60,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3059915
    },
    {
      "round": 6,
      "pickInRound": 1,
      "overallPick": 61,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3917315
    },
    {
      "round": 6,
      "pickInRound": 2,
      "overallPick": 62,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 14881
    },
    {
      "round": 6,
      "pickInRound": 3,
      "overallPick": 63,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3916387
    },
    {
      "round": 6,
      "pickInRound": 4,
      "overallPick": 64,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4360238
    },
    {
      "round": 6,
      "pickInRound": 5,
      "overallPick": 65,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3119195
    },
    {
      "round": 6,
      "pickInRound": 6,
      "overallPick": 66,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4241985
    },
    {
      "round": 6,
      "pickInRound": 7,
      "overallPick": 67,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3117256
    },
    {
      "round": 6,
      "pickInRound": 8,
      "overallPick": 68,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4241555
    },
    {
      "round": 6,
      "pickInRound": 9,
      "overallPick": 69,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4036133
    },
    {
      "round": 6,
      "pickInRound": 10,
      "overallPick": 70,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2577417
    },
    {
      "round": 6,
      "pickInRound": 11,
      "overallPick": 71,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 2976499
    },
    {
      "round": 6,
      "pickInRound": 12,
      "overallPick": 72,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4040761
    },
    {
      "round": 7,
      "pickInRound": 1,
      "overallPick": 73,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 2976316
    },
    {
      "round": 7,
      "pickInRound": 2,
      "overallPick": 74,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 16460
    },
    {
      "round": 7,
      "pickInRound": 3,
      "overallPick": 75,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3135321
    },
    {
      "round": 7,
      "pickInRound": 4,
      "overallPick": 76,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 15807
    },
    {
      "round": 7,
      "pickInRound": 5,
      "overallPick": 77,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 16799
    },
    {
      "round": 7,
      "pickInRound": 6,
      "overallPick": 78,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3895856
    },
    {
      "round": 7,
      "pickInRound": 7,
      "overallPick": 79,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4360939
    },
    {
      "round": 7,
      "pickInRound": 8,
      "overallPick": 80,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4239934
    },
    {
      "round": 7,
      "pickInRound": 9,
      "overallPick": 81,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 15835
    },
    {
      "round": 7,
      "pickInRound": 10,
      "overallPick": 82,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3120348
    },
    {
      "round": 7,
      "pickInRound": 11,
      "overallPick": 83,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3925347
    },
    {
      "round": 7,
      "pickInRound": 12,
      "overallPick": 84,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4372414
    },
    {
      "round": 8,
      "pickInRound": 1,
      "overallPick": 85,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3916148
    },
    {
      "round": 8,
      "pickInRound": 2,
      "overallPick": 86,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4360438
    },
    {
      "round": 8,
      "pickInRound": 3,
      "overallPick": 87,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3121023
    },
    {
      "round": 8,
      "pickInRound": 4,
      "overallPick": 88,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 15880
    },
    {
      "round": 8,
      "pickInRound": 5,
      "overallPick": 89,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4569173
    },
    {
      "round": 8,
      "pickInRound": 6,
      "overallPick": 90,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3915511
    },
    {
      "round": 8,
      "pickInRound": 7,
      "overallPick": 91,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 8439
    },
    {
      "round": 8,
      "pickInRound": 8,
      "overallPick": 92,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 15795
    },
    {
      "round": 8,
      "pickInRound": 9,
      "overallPick": 93,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4360294
    },
    {
      "round": 8,
      "pickInRound": 10,
      "overallPick": 94,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2577327
    },
    {
      "round": 8,
      "pickInRound": 11,
      "overallPick": 95,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 4046692
    },
    {
      "round": 8,
      "pickInRound": 12,
      "overallPick": 96,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 2330
    },
    {
      "round": 9,
      "pickInRound": 1,
      "overallPick": 97,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4426502
    },
    {
      "round": 9,
      "pickInRound": 2,
      "overallPick": 98,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 15683
    },
    {
      "round": 9,
      "pickInRound": 3,
      "overallPick": 99,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3128390
    },
    {
      "round": 9,
      "pickInRound": 4,
      "overallPick": 100,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 12483
    },
    {
      "round": 9,
      "pickInRound": 5,
      "overallPick": 101,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 3139925
    },
    {
      "round": 9,
      "pickInRound": 6,
      "overallPick": 102,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 4360234
    },
    {
      "round": 9,
      "pickInRound": 7,
      "overallPick": 103,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4241478
    },
    {
      "round": 9,
      "pickInRound": 8,
      "overallPick": 104,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4361370
    },
    {
      "round": 9,
      "pickInRound": 9,
      "overallPick": 105,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 16757
    },
    {
      "round": 9,
      "pickInRound": 10,
      "overallPick": 106,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 2576434
    },
    {
      "round": 9,
      "pickInRound": 11,
      "overallPick": 107,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4569618
    },
    {
      "round": 9,
      "pickInRound": 12,
      "overallPick": 108,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3930086
    },
    {
      "round": 10,
      "pickInRound": 1,
      "overallPick": 109,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3051738
    },
    {
      "round": 10,
      "pickInRound": 2,
      "overallPick": 110,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4052042
    },
    {
      "round": 10,
      "pickInRound": 3,
      "overallPick": 111,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4258595
    },
    {
      "round": 10,
      "pickInRound": 4,
      "overallPick": 112,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4048244
    },
    {
      "round": 10,
      "pickInRound": 5,
      "overallPick": 113,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4240657
    },
    {
      "round": 10,
      "pickInRound": 6,
      "overallPick": 114,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": -16002
    },
    {
      "round": 10,
      "pickInRound": 7,
      "overallPick": 115,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3046439
    },
    {
      "round": 10,
      "pickInRound": 8,
      "overallPick": 116,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4240600
    },
    {
      "round": 10,
      "pickInRound": 9,
      "overallPick": 117,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 3045144
    },
    {
      "round": 10,
      "pickInRound": 10,
      "overallPick": 118,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4361411
    },
    {
      "round": 10,
      "pickInRound": 11,
      "overallPick": 119,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 3916430
    },
    {
      "round": 10,
      "pickInRound": 12,
      "overallPick": 120,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4383351
    },
    {
      "round": 11,
      "pickInRound": 1,
      "overallPick": 121,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 3916433
    },
    {
      "round": 11,
      "pickInRound": 2,
      "overallPick": 122,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": -16018
    },
    {
      "round": 11,
      "pickInRound": 3,
      "overallPick": 123,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3115394
    },
    {
      "round": 11,
      "pickInRound": 4,
      "overallPick": 124,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 2576414
    },
    {
      "round": 11,
      "pickInRound": 5,
      "overallPick": 125,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4040980
    },
    {
      "round": 11,
      "pickInRound": 6,
      "overallPick": 126,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 4036348
    },
    {
      "round": 11,
      "pickInRound": 7,
      "overallPick": 127,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4567048
    },
    {
      "round": 11,
      "pickInRound": 8,
      "overallPick": 128,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4241479
    },
    {
      "round": 11,
      "pickInRound": 9,
      "overallPick": 129,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 3115378
    },
    {
      "round": 11,
      "pickInRound": 10,
      "overallPick": 130,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4379399
    },
    {
      "round": 11,
      "pickInRound": 11,
      "overallPick": 131,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4430191
    },
    {
      "round": 11,
      "pickInRound": 12,
      "overallPick": 132,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 2969939
    },
    {
      "round": 12,
      "pickInRound": 1,
      "overallPick": 133,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3116164
    },
    {
      "round": 12,
      "pickInRound": 2,
      "overallPick": 134,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 15072
    },
    {
      "round": 12,
      "pickInRound": 3,
      "overallPick": 135,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": -16009
    },
    {
      "round": 12,
      "pickInRound": 4,
      "overallPick": 136,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4039359
    },
    {
      "round": 12,
      "pickInRound": 5,
      "overallPick": 137,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3051876
    },
    {
      "round": 12,
      "pickInRound": 6,
      "overallPick": 138,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4249087
    },
    {
      "round": 12,
      "pickInRound": 7,
      "overallPick": 139,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": -16011
    },
    {
      "round": 12,
      "pickInRound": 8,
      "overallPick": 140,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4426354
    },
    {
      "round": 12,
      "pickInRound": 9,
      "overallPick": 141,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4361409
    },
    {
      "round": 12,
      "pickInRound": 10,
      "overallPick": 142,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 14880
    },
    {
      "round": 12,
      "pickInRound": 11,
      "overallPick": 143,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 2572861
    },
    {
      "round": 12,
      "pickInRound": 12,
      "overallPick": 144,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": -16027
    },
    {
      "round": 13,
      "pickInRound": 1,
      "overallPick": 145,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4360310
    },
    {
      "round": 13,
      "pickInRound": 2,
      "overallPick": 146,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 2573401
    },
    {
      "round": 13,
      "pickInRound": 3,
      "overallPick": 147,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 16790
    },
    {
      "round": 13,
      "pickInRound": 4,
      "overallPick": 148,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 4567156
    },
    {
      "round": 13,
      "pickInRound": 5,
      "overallPick": 149,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4697815
    },
    {
      "round": 13,
      "pickInRound": 6,
      "overallPick": 150,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 15971
    },
    {
      "round": 13,
      "pickInRound": 7,
      "overallPick": 151,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 2574808
    },
    {
      "round": 13,
      "pickInRound": 8,
      "overallPick": 152,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3128724
    },
    {
      "round": 13,
      "pickInRound": 9,
      "overallPick": 153,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": -16033
    },
    {
      "round": 13,
      "pickInRound": 10,
      "overallPick": 154,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 2576623
    },
    {
      "round": 13,
      "pickInRound": 11,
      "overallPick": 155,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": -16025
    },
    {
      "round": 13,
      "pickInRound": 12,
      "overallPick": 156,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": -16006
    },
    {
      "round": 14,
      "pickInRound": 1,
      "overallPick": 157,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4249417
    },
    {
      "round": 14,
      "pickInRound": 2,
      "overallPick": 158,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4035004
    },
    {
      "round": 14,
      "pickInRound": 3,
      "overallPick": 159,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3055899
    },
    {
      "round": 14,
      "pickInRound": 4,
      "overallPick": 160,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4362887
    },
    {
      "round": 14,
      "pickInRound": 5,
      "overallPick": 161,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4426891
    },
    {
      "round": 14,
      "pickInRound": 6,
      "overallPick": 162,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4258173
    },
    {
      "round": 14,
      "pickInRound": 7,
      "overallPick": 163,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3975763
    },
    {
      "round": 14,
      "pickInRound": 8,
      "overallPick": 164,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 3917232
    },
    {
      "round": 14,
      "pickInRound": 9,
      "overallPick": 165,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 13982
    },
    {
      "round": 14,
      "pickInRound": 10,
      "overallPick": 166,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 16339
    },
    {
      "round": 14,
      "pickInRound": 11,
      "overallPick": 167,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 14876
    },
    {
      "round": 14,
      "pickInRound": 12,
      "overallPick": 168,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 4242433
    },
    {
      "round": 15,
      "pickInRound": 1,
      "overallPick": 169,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 3051909
    },
    {
      "round": 15,
      "pickInRound": 2,
      "overallPick": 170,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": 15864
    },
    {
      "round": 15,
      "pickInRound": 3,
      "overallPick": 171,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4371733
    },
    {
      "round": 15,
      "pickInRound": 4,
      "overallPick": 172,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": 10621
    },
    {
      "round": 15,
      "pickInRound": 5,
      "overallPick": 173,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": 4035115
    },
    {
      "round": 15,
      "pickInRound": 6,
      "overallPick": 174,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 3043275
    },
    {
      "round": 15,
      "pickInRound": 7,
      "overallPick": 175,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3917792
    },
    {
      "round": 15,
      "pickInRound": 8,
      "overallPick": 176,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": -16014
    },
    {
      "round": 15,
      "pickInRound": 9,
      "overallPick": 177,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 4036131
    },
    {
      "round": 15,
      "pickInRound": 10,
      "overallPick": 178,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 2980453
    },
    {
      "round": 15,
      "pickInRound": 11,
      "overallPick": 179,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4241474
    },
    {
      "round": 15,
      "pickInRound": 12,
      "overallPick": 180,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 17359
    },
    {
      "round": 16,
      "pickInRound": 1,
      "overallPick": 181,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 11122
    },
    {
      "round": 16,
      "pickInRound": 2,
      "overallPick": 182,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 15965
    },
    {
      "round": 16,
      "pickInRound": 3,
      "overallPick": 183,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3121427
    },
    {
      "round": 16,
      "pickInRound": 4,
      "overallPick": 184,
      "teamId": 5,
      "owner": "Shivam Patel",
      "espnPlayerId": 12460
    },
    {
      "round": 16,
      "pickInRound": 5,
      "overallPick": 185,
      "teamId": 10,
      "owner": "Alvin Pokel",
      "espnPlayerId": 12731
    },
    {
      "round": 16,
      "pickInRound": 6,
      "overallPick": 186,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": -16007
    },
    {
      "round": 16,
      "pickInRound": 7,
      "overallPick": 187,
      "teamId": 3,
      "owner": "Sydney & Olivia",
      "espnPlayerId": 4035886
    },
    {
      "round": 16,
      "pickInRound": 8,
      "overallPick": 188,
      "teamId": 12,
      "owner": "Austin Farris",
      "espnPlayerId": -16005
    },
    {
      "round": 16,
      "pickInRound": 9,
      "overallPick": 189,
      "teamId": 9,
      "owner": "Rohan Shani",
      "espnPlayerId": -16024
    },
    {
      "round": 16,
      "pickInRound": 10,
      "overallPick": 190,
      "teamId": 6,
      "owner": "Zach Sullivan",
      "espnPlayerId": -16023
    },
    {
      "round": 16,
      "pickInRound": 11,
      "overallPick": 191,
      "teamId": 8,
      "owner": "Colin Lenseigne",
      "espnPlayerId": -16015
    },
    {
      "round": 16,
      "pickInRound": 12,
      "overallPick": 192,
      "teamId": 11,
      "owner": "Megan Gelber",
      "espnPlayerId": 3123076
    }
  ],
  "2021": [
    {
      "round": 1,
      "pickInRound": 1,
      "overallPick": 1,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3117251
    },
    {
      "round": 1,
      "pickInRound": 2,
      "overallPick": 2,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3116593
    },
    {
      "round": 1,
      "pickInRound": 3,
      "overallPick": 3,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 3054850
    },
    {
      "round": 1,
      "pickInRound": 4,
      "overallPick": 4,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 3043078
    },
    {
      "round": 1,
      "pickInRound": 5,
      "overallPick": 5,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 15847
    },
    {
      "round": 1,
      "pickInRound": 6,
      "overallPick": 6,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 16800
    },
    {
      "round": 1,
      "pickInRound": 7,
      "overallPick": 7,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3929630
    },
    {
      "round": 1,
      "pickInRound": 8,
      "overallPick": 8,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 4242335
    },
    {
      "round": 1,
      "pickInRound": 9,
      "overallPick": 9,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3051392
    },
    {
      "round": 1,
      "pickInRound": 10,
      "overallPick": 10,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3042519
    },
    {
      "round": 2,
      "pickInRound": 1,
      "overallPick": 11,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3116406
    },
    {
      "round": 2,
      "pickInRound": 2,
      "overallPick": 12,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4047650
    },
    {
      "round": 2,
      "pickInRound": 3,
      "overallPick": 13,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3128720
    },
    {
      "round": 2,
      "pickInRound": 4,
      "overallPick": 14,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4241457
    },
    {
      "round": 2,
      "pickInRound": 5,
      "overallPick": 15,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 3068267
    },
    {
      "round": 2,
      "pickInRound": 6,
      "overallPick": 16,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 2976212
    },
    {
      "round": 2,
      "pickInRound": 7,
      "overallPick": 17,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 4360294
    },
    {
      "round": 2,
      "pickInRound": 8,
      "overallPick": 18,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 15795
    },
    {
      "round": 2,
      "pickInRound": 9,
      "overallPick": 19,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3925357
    },
    {
      "round": 2,
      "pickInRound": 10,
      "overallPick": 20,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4262921
    },
    {
      "round": 3,
      "pickInRound": 1,
      "overallPick": 21,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4047646
    },
    {
      "round": 3,
      "pickInRound": 2,
      "overallPick": 22,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4242214
    },
    {
      "round": 3,
      "pickInRound": 3,
      "overallPick": 23,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 2576925
    },
    {
      "round": 3,
      "pickInRound": 4,
      "overallPick": 24,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 15818
    },
    {
      "round": 3,
      "pickInRound": 5,
      "overallPick": 25,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3116385
    },
    {
      "round": 3,
      "pickInRound": 6,
      "overallPick": 26,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4052042
    },
    {
      "round": 3,
      "pickInRound": 7,
      "overallPick": 27,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3040151
    },
    {
      "round": 3,
      "pickInRound": 8,
      "overallPick": 28,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3121422
    },
    {
      "round": 3,
      "pickInRound": 9,
      "overallPick": 29,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 16799
    },
    {
      "round": 3,
      "pickInRound": 10,
      "overallPick": 30,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4035538
    },
    {
      "round": 4,
      "pickInRound": 1,
      "overallPick": 31,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3139477
    },
    {
      "round": 4,
      "pickInRound": 2,
      "overallPick": 32,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3918298
    },
    {
      "round": 4,
      "pickInRound": 3,
      "overallPick": 33,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 16737
    },
    {
      "round": 4,
      "pickInRound": 4,
      "overallPick": 34,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3916387
    },
    {
      "round": 4,
      "pickInRound": 5,
      "overallPick": 35,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4241389
    },
    {
      "round": 4,
      "pickInRound": 6,
      "overallPick": 36,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3919596
    },
    {
      "round": 4,
      "pickInRound": 7,
      "overallPick": 37,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 2976499
    },
    {
      "round": 4,
      "pickInRound": 8,
      "overallPick": 38,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 4045163
    },
    {
      "round": 4,
      "pickInRound": 9,
      "overallPick": 39,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3915416
    },
    {
      "round": 4,
      "pickInRound": 10,
      "overallPick": 40,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4259545
    },
    {
      "round": 5,
      "pickInRound": 1,
      "overallPick": 41,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 2577327
    },
    {
      "round": 5,
      "pickInRound": 2,
      "overallPick": 42,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 15880
    },
    {
      "round": 5,
      "pickInRound": 3,
      "overallPick": 43,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 16460
    },
    {
      "round": 5,
      "pickInRound": 4,
      "overallPick": 44,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 2977187
    },
    {
      "round": 5,
      "pickInRound": 5,
      "overallPick": 45,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4047365
    },
    {
      "round": 5,
      "pickInRound": 6,
      "overallPick": 46,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 3886818
    },
    {
      "round": 5,
      "pickInRound": 7,
      "overallPick": 47,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3116165
    },
    {
      "round": 5,
      "pickInRound": 8,
      "overallPick": 48,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3120348
    },
    {
      "round": 5,
      "pickInRound": 9,
      "overallPick": 49,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3119195
    },
    {
      "round": 5,
      "pickInRound": 10,
      "overallPick": 50,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4239993
    },
    {
      "round": 6,
      "pickInRound": 1,
      "overallPick": 51,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3116365
    },
    {
      "round": 6,
      "pickInRound": 2,
      "overallPick": 52,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 2574808
    },
    {
      "round": 6,
      "pickInRound": 3,
      "overallPick": 53,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 13982
    },
    {
      "round": 6,
      "pickInRound": 4,
      "overallPick": 54,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3128429
    },
    {
      "round": 6,
      "pickInRound": 5,
      "overallPick": 55,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4036133
    },
    {
      "round": 6,
      "pickInRound": 6,
      "overallPick": 56,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3932905
    },
    {
      "round": 6,
      "pickInRound": 7,
      "overallPick": 57,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 3051926
    },
    {
      "round": 6,
      "pickInRound": 8,
      "overallPick": 58,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 4360438
    },
    {
      "round": 6,
      "pickInRound": 9,
      "overallPick": 59,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3059915
    },
    {
      "round": 6,
      "pickInRound": 10,
      "overallPick": 60,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3917315
    },
    {
      "round": 7,
      "pickInRound": 1,
      "overallPick": 61,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4360248
    },
    {
      "round": 7,
      "pickInRound": 2,
      "overallPick": 62,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3025433
    },
    {
      "round": 7,
      "pickInRound": 3,
      "overallPick": 63,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 2577417
    },
    {
      "round": 7,
      "pickInRound": 4,
      "overallPick": 64,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 4361579
    },
    {
      "round": 7,
      "pickInRound": 5,
      "overallPick": 65,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4046692
    },
    {
      "round": 7,
      "pickInRound": 6,
      "overallPick": 66,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4241463
    },
    {
      "round": 7,
      "pickInRound": 7,
      "overallPick": 67,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4039359
    },
    {
      "round": 7,
      "pickInRound": 8,
      "overallPick": 68,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 14881
    },
    {
      "round": 7,
      "pickInRound": 9,
      "overallPick": 69,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3042778
    },
    {
      "round": 7,
      "pickInRound": 10,
      "overallPick": 70,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4036348
    },
    {
      "round": 8,
      "pickInRound": 1,
      "overallPick": 71,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 16731
    },
    {
      "round": 8,
      "pickInRound": 2,
      "overallPick": 72,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 16813
    },
    {
      "round": 8,
      "pickInRound": 3,
      "overallPick": 73,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 4036131
    },
    {
      "round": 8,
      "pickInRound": 4,
      "overallPick": 74,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 4362628
    },
    {
      "round": 8,
      "pickInRound": 5,
      "overallPick": 75,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 8439
    },
    {
      "round": 8,
      "pickInRound": 6,
      "overallPick": 76,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 2330
    },
    {
      "round": 8,
      "pickInRound": 7,
      "overallPick": 77,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 2974858
    },
    {
      "round": 8,
      "pickInRound": 8,
      "overallPick": 78,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 4243160
    },
    {
      "round": 8,
      "pickInRound": 9,
      "overallPick": 79,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3045144
    },
    {
      "round": 8,
      "pickInRound": 10,
      "overallPick": 80,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 2576414
    },
    {
      "round": 9,
      "pickInRound": 1,
      "overallPick": 81,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 16733
    },
    {
      "round": 9,
      "pickInRound": 2,
      "overallPick": 82,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4038941
    },
    {
      "round": 9,
      "pickInRound": 3,
      "overallPick": 83,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 3925347
    },
    {
      "round": 9,
      "pickInRound": 4,
      "overallPick": 84,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 2976316
    },
    {
      "round": 9,
      "pickInRound": 5,
      "overallPick": 85,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4241478
    },
    {
      "round": 9,
      "pickInRound": 6,
      "overallPick": 86,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 3126486
    },
    {
      "round": 9,
      "pickInRound": 7,
      "overallPick": 87,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 16790
    },
    {
      "round": 9,
      "pickInRound": 8,
      "overallPick": 88,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3052876
    },
    {
      "round": 9,
      "pickInRound": 9,
      "overallPick": 89,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4241372
    },
    {
      "round": 9,
      "pickInRound": 10,
      "overallPick": 90,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 2979843
    },
    {
      "round": 10,
      "pickInRound": 1,
      "overallPick": 91,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3045138
    },
    {
      "round": 10,
      "pickInRound": 2,
      "overallPick": 92,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3916430
    },
    {
      "round": 10,
      "pickInRound": 3,
      "overallPick": 93,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3045147
    },
    {
      "round": 10,
      "pickInRound": 4,
      "overallPick": 94,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3128721
    },
    {
      "round": 10,
      "pickInRound": 5,
      "overallPick": 95,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4372016
    },
    {
      "round": 10,
      "pickInRound": 6,
      "overallPick": 96,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 13934
    },
    {
      "round": 10,
      "pickInRound": 7,
      "overallPick": 97,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 4239934
    },
    {
      "round": 10,
      "pickInRound": 8,
      "overallPick": 98,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 3115364
    },
    {
      "round": 10,
      "pickInRound": 9,
      "overallPick": 99,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3121023
    },
    {
      "round": 10,
      "pickInRound": 10,
      "overallPick": 100,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 15072
    },
    {
      "round": 11,
      "pickInRound": 1,
      "overallPick": 101,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4241401
    },
    {
      "round": 11,
      "pickInRound": 2,
      "overallPick": 102,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4040715
    },
    {
      "round": 11,
      "pickInRound": 3,
      "overallPick": 103,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 4241475
    },
    {
      "round": 11,
      "pickInRound": 4,
      "overallPick": 104,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 12483
    },
    {
      "round": 11,
      "pickInRound": 5,
      "overallPick": 105,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 2576434
    },
    {
      "round": 11,
      "pickInRound": 6,
      "overallPick": 106,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4035676
    },
    {
      "round": 11,
      "pickInRound": 7,
      "overallPick": 107,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2980453
    },
    {
      "round": 11,
      "pickInRound": 8,
      "overallPick": 108,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3054212
    },
    {
      "round": 11,
      "pickInRound": 9,
      "overallPick": 109,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4035004
    },
    {
      "round": 11,
      "pickInRound": 10,
      "overallPick": 110,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 14876
    },
    {
      "round": 12,
      "pickInRound": 1,
      "overallPick": 111,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 15349
    },
    {
      "round": 12,
      "pickInRound": 2,
      "overallPick": 112,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 3116164
    },
    {
      "round": 12,
      "pickInRound": 3,
      "overallPick": 113,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 3912550
    },
    {
      "round": 12,
      "pickInRound": 4,
      "overallPick": 114,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2975674
    },
    {
      "round": 12,
      "pickInRound": 5,
      "overallPick": 115,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4240657
    },
    {
      "round": 12,
      "pickInRound": 6,
      "overallPick": 116,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 4040761
    },
    {
      "round": 12,
      "pickInRound": 7,
      "overallPick": 117,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 2573401
    },
    {
      "round": 12,
      "pickInRound": 8,
      "overallPick": 118,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 2576623
    },
    {
      "round": 12,
      "pickInRound": 9,
      "overallPick": 119,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3918639
    },
    {
      "round": 12,
      "pickInRound": 10,
      "overallPick": 120,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4035687
    },
    {
      "round": 13,
      "pickInRound": 1,
      "overallPick": 121,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3049899
    },
    {
      "round": 13,
      "pickInRound": 2,
      "overallPick": 122,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3115394
    },
    {
      "round": 13,
      "pickInRound": 3,
      "overallPick": 123,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 4035170
    },
    {
      "round": 13,
      "pickInRound": 4,
      "overallPick": 124,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 3051876
    },
    {
      "round": 13,
      "pickInRound": 5,
      "overallPick": 125,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": -16028
    },
    {
      "round": 13,
      "pickInRound": 6,
      "overallPick": 126,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 3121427
    },
    {
      "round": 13,
      "pickInRound": 7,
      "overallPick": 127,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3916433
    },
    {
      "round": 13,
      "pickInRound": 8,
      "overallPick": 128,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 4241479
    },
    {
      "round": 13,
      "pickInRound": 9,
      "overallPick": 129,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 4360310
    },
    {
      "round": 13,
      "pickInRound": 10,
      "overallPick": 130,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": -16027
    },
    {
      "round": 14,
      "pickInRound": 1,
      "overallPick": 131,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 4241802
    },
    {
      "round": 14,
      "pickInRound": 2,
      "overallPick": 132,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": -16033
    },
    {
      "round": 14,
      "pickInRound": 3,
      "overallPick": 133,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 2508176
    },
    {
      "round": 14,
      "pickInRound": 4,
      "overallPick": 134,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 16913
    },
    {
      "round": 14,
      "pickInRound": 5,
      "overallPick": 135,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": -16025
    },
    {
      "round": 14,
      "pickInRound": 6,
      "overallPick": 136,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": -16023
    },
    {
      "round": 14,
      "pickInRound": 7,
      "overallPick": 137,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 15683
    },
    {
      "round": 14,
      "pickInRound": 8,
      "overallPick": 138,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 3052117
    },
    {
      "round": 14,
      "pickInRound": 9,
      "overallPick": 139,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 2572861
    },
    {
      "round": 14,
      "pickInRound": 10,
      "overallPick": 140,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": -16014
    },
    {
      "round": 15,
      "pickInRound": 1,
      "overallPick": 141,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4040655
    },
    {
      "round": 15,
      "pickInRound": 2,
      "overallPick": 142,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": -16005
    },
    {
      "round": 15,
      "pickInRound": 3,
      "overallPick": 143,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": -16011
    },
    {
      "round": 15,
      "pickInRound": 4,
      "overallPick": 144,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": 4372414
    },
    {
      "round": 15,
      "pickInRound": 5,
      "overallPick": 145,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3055899
    },
    {
      "round": 15,
      "pickInRound": 6,
      "overallPick": 146,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4048244
    },
    {
      "round": 15,
      "pickInRound": 7,
      "overallPick": 147,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": -16002
    },
    {
      "round": 15,
      "pickInRound": 8,
      "overallPick": 148,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": -16007
    },
    {
      "round": 15,
      "pickInRound": 9,
      "overallPick": 149,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 16339
    },
    {
      "round": 15,
      "pickInRound": 10,
      "overallPick": 150,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 12460
    },
    {
      "round": 16,
      "pickInRound": 1,
      "overallPick": 151,
      "teamId": 7,
      "owner": "Braden Galvan",
      "espnPlayerId": 3115378
    },
    {
      "round": 16,
      "pickInRound": 2,
      "overallPick": 152,
      "teamId": 4,
      "owner": "Seth Hendrickson",
      "espnPlayerId": 2570986
    },
    {
      "round": 16,
      "pickInRound": 3,
      "overallPick": 153,
      "teamId": 11,
      "owner": "Matthew Jensen",
      "espnPlayerId": 2473037
    },
    {
      "round": 16,
      "pickInRound": 4,
      "overallPick": 154,
      "teamId": 3,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3124679
    },
    {
      "round": 16,
      "pickInRound": 5,
      "overallPick": 155,
      "teamId": 12,
      "owner": "Shivam Patel",
      "espnPlayerId": 4249087
    },
    {
      "round": 16,
      "pickInRound": 6,
      "overallPick": 156,
      "teamId": 2,
      "owner": "Tyler Armstrong",
      "espnPlayerId": 3915511
    },
    {
      "round": 16,
      "pickInRound": 7,
      "overallPick": 157,
      "teamId": 10,
      "owner": "Austin Farris",
      "espnPlayerId": -16017
    },
    {
      "round": 16,
      "pickInRound": 8,
      "overallPick": 158,
      "teamId": 6,
      "owner": "James McNeal",
      "espnPlayerId": 3917232
    },
    {
      "round": 16,
      "pickInRound": 9,
      "overallPick": 159,
      "teamId": 5,
      "owner": "Alvin Pokel",
      "espnPlayerId": 14993
    },
    {
      "round": 16,
      "pickInRound": 10,
      "overallPick": 160,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4043016
    }
  ],
  "2020": [
    {
      "round": 1,
      "pickInRound": 1,
      "overallPick": 1,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3117251
    },
    {
      "round": 1,
      "pickInRound": 2,
      "overallPick": 2,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 3929630
    },
    {
      "round": 1,
      "pickInRound": 3,
      "overallPick": 3,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3051392
    },
    {
      "round": 1,
      "pickInRound": 4,
      "overallPick": 4,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 2976316
    },
    {
      "round": 1,
      "pickInRound": 5,
      "overallPick": 5,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3116593
    },
    {
      "round": 1,
      "pickInRound": 6,
      "overallPick": 6,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3054850
    },
    {
      "round": 1,
      "pickInRound": 7,
      "overallPick": 7,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 4242214
    },
    {
      "round": 1,
      "pickInRound": 8,
      "overallPick": 8,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3043078
    },
    {
      "round": 1,
      "pickInRound": 9,
      "overallPick": 9,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 4045163
    },
    {
      "round": 1,
      "pickInRound": 10,
      "overallPick": 10,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 2979843
    },
    {
      "round": 2,
      "pickInRound": 1,
      "overallPick": 11,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 3917315
    },
    {
      "round": 2,
      "pickInRound": 2,
      "overallPick": 12,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 3139477
    },
    {
      "round": 2,
      "pickInRound": 3,
      "overallPick": 13,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3128720
    },
    {
      "round": 2,
      "pickInRound": 4,
      "overallPick": 14,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 4047365
    },
    {
      "round": 2,
      "pickInRound": 5,
      "overallPick": 15,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 13982
    },
    {
      "round": 2,
      "pickInRound": 6,
      "overallPick": 16,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3042519
    },
    {
      "round": 2,
      "pickInRound": 7,
      "overallPick": 17,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 15795
    },
    {
      "round": 2,
      "pickInRound": 8,
      "overallPick": 18,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 15847
    },
    {
      "round": 2,
      "pickInRound": 9,
      "overallPick": 19,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 3916387
    },
    {
      "round": 2,
      "pickInRound": 10,
      "overallPick": 20,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3116165
    },
    {
      "round": 3,
      "pickInRound": 1,
      "overallPick": 21,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3068267
    },
    {
      "round": 3,
      "pickInRound": 2,
      "overallPick": 22,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 16800
    },
    {
      "round": 3,
      "pickInRound": 3,
      "overallPick": 23,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 11237
    },
    {
      "round": 3,
      "pickInRound": 4,
      "overallPick": 24,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 2577417
    },
    {
      "round": 3,
      "pickInRound": 5,
      "overallPick": 25,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3116385
    },
    {
      "round": 3,
      "pickInRound": 6,
      "overallPick": 26,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3116406
    },
    {
      "round": 3,
      "pickInRound": 7,
      "overallPick": 27,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 2974858
    },
    {
      "round": 3,
      "pickInRound": 8,
      "overallPick": 28,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 14881
    },
    {
      "round": 3,
      "pickInRound": 9,
      "overallPick": 29,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 15880
    },
    {
      "round": 3,
      "pickInRound": 10,
      "overallPick": 30,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 16737
    },
    {
      "round": 4,
      "pickInRound": 1,
      "overallPick": 31,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 3040151
    },
    {
      "round": 4,
      "pickInRound": 2,
      "overallPick": 32,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 2577327
    },
    {
      "round": 4,
      "pickInRound": 3,
      "overallPick": 33,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3116365
    },
    {
      "round": 4,
      "pickInRound": 4,
      "overallPick": 34,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 16799
    },
    {
      "round": 4,
      "pickInRound": 5,
      "overallPick": 35,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3122840
    },
    {
      "round": 4,
      "pickInRound": 6,
      "overallPick": 36,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3915416
    },
    {
      "round": 4,
      "pickInRound": 7,
      "overallPick": 37,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 13983
    },
    {
      "round": 4,
      "pickInRound": 8,
      "overallPick": 38,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3919596
    },
    {
      "round": 4,
      "pickInRound": 9,
      "overallPick": 39,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 16460
    },
    {
      "round": 4,
      "pickInRound": 10,
      "overallPick": 40,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3120348
    },
    {
      "round": 5,
      "pickInRound": 1,
      "overallPick": 41,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 2976499
    },
    {
      "round": 5,
      "pickInRound": 2,
      "overallPick": 42,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 15835
    },
    {
      "round": 5,
      "pickInRound": 3,
      "overallPick": 43,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 2977644
    },
    {
      "round": 5,
      "pickInRound": 4,
      "overallPick": 44,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 4036348
    },
    {
      "round": 5,
      "pickInRound": 5,
      "overallPick": 45,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3128429
    },
    {
      "round": 5,
      "pickInRound": 6,
      "overallPick": 46,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 15825
    },
    {
      "round": 5,
      "pickInRound": 7,
      "overallPick": 47,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 4047646
    },
    {
      "round": 5,
      "pickInRound": 8,
      "overallPick": 48,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3925357
    },
    {
      "round": 5,
      "pickInRound": 9,
      "overallPick": 49,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 12537
    },
    {
      "round": 5,
      "pickInRound": 10,
      "overallPick": 50,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 2508176
    },
    {
      "round": 6,
      "pickInRound": 1,
      "overallPick": 51,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 2977187
    },
    {
      "round": 6,
      "pickInRound": 2,
      "overallPick": 52,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 4036131
    },
    {
      "round": 6,
      "pickInRound": 3,
      "overallPick": 53,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 14924
    },
    {
      "round": 6,
      "pickInRound": 4,
      "overallPick": 54,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 4242335
    },
    {
      "round": 6,
      "pickInRound": 5,
      "overallPick": 55,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 2576434
    },
    {
      "round": 6,
      "pickInRound": 6,
      "overallPick": 56,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 16733
    },
    {
      "round": 6,
      "pickInRound": 7,
      "overallPick": 57,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 2580
    },
    {
      "round": 6,
      "pickInRound": 8,
      "overallPick": 58,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4047650
    },
    {
      "round": 6,
      "pickInRound": 9,
      "overallPick": 59,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 3045147
    },
    {
      "round": 6,
      "pickInRound": 10,
      "overallPick": 60,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 4240021
    },
    {
      "round": 7,
      "pickInRound": 1,
      "overallPick": 61,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 4040761
    },
    {
      "round": 7,
      "pickInRound": 2,
      "overallPick": 62,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 15818
    },
    {
      "round": 7,
      "pickInRound": 3,
      "overallPick": 63,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3121422
    },
    {
      "round": 7,
      "pickInRound": 4,
      "overallPick": 64,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 4241389
    },
    {
      "round": 7,
      "pickInRound": 5,
      "overallPick": 65,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 2576925
    },
    {
      "round": 7,
      "pickInRound": 6,
      "overallPick": 66,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 3051876
    },
    {
      "round": 7,
      "pickInRound": 7,
      "overallPick": 67,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3115394
    },
    {
      "round": 7,
      "pickInRound": 8,
      "overallPick": 68,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2576623
    },
    {
      "round": 7,
      "pickInRound": 9,
      "overallPick": 69,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 13229
    },
    {
      "round": 7,
      "pickInRound": 10,
      "overallPick": 70,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 16790
    },
    {
      "round": 8,
      "pickInRound": 1,
      "overallPick": 71,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 2573401
    },
    {
      "round": 8,
      "pickInRound": 2,
      "overallPick": 72,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 3910544
    },
    {
      "round": 8,
      "pickInRound": 3,
      "overallPick": 73,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": -16002
    },
    {
      "round": 8,
      "pickInRound": 4,
      "overallPick": 74,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3045144
    },
    {
      "round": 8,
      "pickInRound": 5,
      "overallPick": 75,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 2576414
    },
    {
      "round": 8,
      "pickInRound": 6,
      "overallPick": 76,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3059915
    },
    {
      "round": 8,
      "pickInRound": 7,
      "overallPick": 77,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 8439
    },
    {
      "round": 8,
      "pickInRound": 8,
      "overallPick": 78,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 2330
    },
    {
      "round": 8,
      "pickInRound": 9,
      "overallPick": 79,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 3052876
    },
    {
      "round": 8,
      "pickInRound": 10,
      "overallPick": 80,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 4259545
    },
    {
      "round": 9,
      "pickInRound": 1,
      "overallPick": 81,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 4035538
    },
    {
      "round": 9,
      "pickInRound": 2,
      "overallPick": 82,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 15072
    },
    {
      "round": 9,
      "pickInRound": 3,
      "overallPick": 83,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 2976212
    },
    {
      "round": 9,
      "pickInRound": 4,
      "overallPick": 84,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 12649
    },
    {
      "round": 9,
      "pickInRound": 5,
      "overallPick": 85,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3115364
    },
    {
      "round": 9,
      "pickInRound": 6,
      "overallPick": 86,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4241372
    },
    {
      "round": 9,
      "pickInRound": 7,
      "overallPick": 87,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3924365
    },
    {
      "round": 9,
      "pickInRound": 8,
      "overallPick": 88,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 12483
    },
    {
      "round": 9,
      "pickInRound": 9,
      "overallPick": 89,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 3126486
    },
    {
      "round": 9,
      "pickInRound": 10,
      "overallPick": 90,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 3066158
    },
    {
      "round": 10,
      "pickInRound": 1,
      "overallPick": 91,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 13981
    },
    {
      "round": 10,
      "pickInRound": 2,
      "overallPick": 92,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 3916925
    },
    {
      "round": 10,
      "pickInRound": 3,
      "overallPick": 93,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 16913
    },
    {
      "round": 10,
      "pickInRound": 4,
      "overallPick": 94,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3918298
    },
    {
      "round": 10,
      "pickInRound": 5,
      "overallPick": 95,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 16731
    },
    {
      "round": 10,
      "pickInRound": 6,
      "overallPick": 96,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3932905
    },
    {
      "round": 10,
      "pickInRound": 7,
      "overallPick": 97,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 14053
    },
    {
      "round": 10,
      "pickInRound": 8,
      "overallPick": 98,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3060022
    },
    {
      "round": 10,
      "pickInRound": 9,
      "overallPick": 99,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 4360294
    },
    {
      "round": 10,
      "pickInRound": 10,
      "overallPick": 100,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 2576716
    },
    {
      "round": 11,
      "pickInRound": 1,
      "overallPick": 101,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3052117
    },
    {
      "round": 11,
      "pickInRound": 2,
      "overallPick": 102,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 2573079
    },
    {
      "round": 11,
      "pickInRound": 3,
      "overallPick": 103,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3046439
    },
    {
      "round": 11,
      "pickInRound": 4,
      "overallPick": 104,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 2976592
    },
    {
      "round": 11,
      "pickInRound": 5,
      "overallPick": 105,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3049916
    },
    {
      "round": 11,
      "pickInRound": 6,
      "overallPick": 106,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4241985
    },
    {
      "round": 11,
      "pickInRound": 7,
      "overallPick": 107,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3116164
    },
    {
      "round": 11,
      "pickInRound": 8,
      "overallPick": 108,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3895856
    },
    {
      "round": 11,
      "pickInRound": 9,
      "overallPick": 109,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 3912550
    },
    {
      "round": 11,
      "pickInRound": 10,
      "overallPick": 110,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 4039359
    },
    {
      "round": 12,
      "pickInRound": 1,
      "overallPick": 111,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 4035676
    },
    {
      "round": 12,
      "pickInRound": 2,
      "overallPick": 112,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 4048244
    },
    {
      "round": 12,
      "pickInRound": 3,
      "overallPick": 113,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3917792
    },
    {
      "round": 12,
      "pickInRound": 4,
      "overallPick": 114,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3916945
    },
    {
      "round": 12,
      "pickInRound": 5,
      "overallPick": 115,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4036133
    },
    {
      "round": 12,
      "pickInRound": 6,
      "overallPick": 116,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 3915399
    },
    {
      "round": 12,
      "pickInRound": 7,
      "overallPick": 117,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 3055899
    },
    {
      "round": 12,
      "pickInRound": 8,
      "overallPick": 118,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": -16025
    },
    {
      "round": 12,
      "pickInRound": 9,
      "overallPick": 119,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 3123050
    },
    {
      "round": 12,
      "pickInRound": 10,
      "overallPick": 120,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 13217
    },
    {
      "round": 13,
      "pickInRound": 1,
      "overallPick": 121,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3043275
    },
    {
      "round": 13,
      "pickInRound": 2,
      "overallPick": 122,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": -16023
    },
    {
      "round": 13,
      "pickInRound": 3,
      "overallPick": 123,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 16804
    },
    {
      "round": 13,
      "pickInRound": 4,
      "overallPick": 124,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 16504
    },
    {
      "round": 13,
      "pickInRound": 5,
      "overallPick": 125,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 2574808
    },
    {
      "round": 13,
      "pickInRound": 6,
      "overallPick": 126,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 13994
    },
    {
      "round": 13,
      "pickInRound": 7,
      "overallPick": 127,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 15920
    },
    {
      "round": 13,
      "pickInRound": 8,
      "overallPick": 128,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2979477
    },
    {
      "round": 13,
      "pickInRound": 9,
      "overallPick": 129,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 13295
    },
    {
      "round": 13,
      "pickInRound": 10,
      "overallPick": 130,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": -16033
    },
    {
      "round": 14,
      "pickInRound": 1,
      "overallPick": 131,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 15683
    },
    {
      "round": 14,
      "pickInRound": 2,
      "overallPick": 132,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 4241475
    },
    {
      "round": 14,
      "pickInRound": 3,
      "overallPick": 133,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 2985659
    },
    {
      "round": 14,
      "pickInRound": 4,
      "overallPick": 134,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 3931398
    },
    {
      "round": 14,
      "pickInRound": 5,
      "overallPick": 135,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 4241479
    },
    {
      "round": 14,
      "pickInRound": 6,
      "overallPick": 136,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 5536
    },
    {
      "round": 14,
      "pickInRound": 7,
      "overallPick": 137,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 2969962
    },
    {
      "round": 14,
      "pickInRound": 8,
      "overallPick": 138,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 4241463
    },
    {
      "round": 14,
      "pickInRound": 9,
      "overallPick": 139,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 11122
    },
    {
      "round": 14,
      "pickInRound": 10,
      "overallPick": 140,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 14876
    },
    {
      "round": 15,
      "pickInRound": 1,
      "overallPick": 141,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": -16017
    },
    {
      "round": 15,
      "pickInRound": 2,
      "overallPick": 142,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 3916148
    },
    {
      "round": 15,
      "pickInRound": 3,
      "overallPick": 143,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 9354
    },
    {
      "round": 15,
      "pickInRound": 4,
      "overallPick": 144,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": 3139605
    },
    {
      "round": 15,
      "pickInRound": 5,
      "overallPick": 145,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": -16011
    },
    {
      "round": 15,
      "pickInRound": 6,
      "overallPick": 146,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": -16027
    },
    {
      "round": 15,
      "pickInRound": 7,
      "overallPick": 147,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": 14993
    },
    {
      "round": 15,
      "pickInRound": 8,
      "overallPick": 148,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3916430
    },
    {
      "round": 15,
      "pickInRound": 9,
      "overallPick": 149,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": -16007
    },
    {
      "round": 15,
      "pickInRound": 10,
      "overallPick": 150,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 4035004
    },
    {
      "round": 16,
      "pickInRound": 1,
      "overallPick": 151,
      "teamId": 10,
      "owner": "Shivam Patel",
      "espnPlayerId": 11283
    },
    {
      "round": 16,
      "pickInRound": 2,
      "overallPick": 152,
      "teamId": 5,
      "owner": "Kiran Nevill",
      "espnPlayerId": 17372
    },
    {
      "round": 16,
      "pickInRound": 3,
      "overallPick": 153,
      "teamId": 4,
      "owner": "Zach Sullivan",
      "espnPlayerId": 3045138
    },
    {
      "round": 16,
      "pickInRound": 4,
      "overallPick": 154,
      "teamId": 8,
      "owner": "Austin Farris",
      "espnPlayerId": -16021
    },
    {
      "round": 16,
      "pickInRound": 5,
      "overallPick": 155,
      "teamId": 9,
      "owner": "Alvin Pokel",
      "espnPlayerId": 2971573
    },
    {
      "round": 16,
      "pickInRound": 6,
      "overallPick": 156,
      "teamId": 7,
      "owner": "Rayaan Vellani",
      "espnPlayerId": 4249087
    },
    {
      "round": 16,
      "pickInRound": 7,
      "overallPick": 157,
      "teamId": 6,
      "owner": "Braden Galvan",
      "espnPlayerId": -16006
    },
    {
      "round": 16,
      "pickInRound": 8,
      "overallPick": 158,
      "teamId": 1,
      "owner": "Tyler Ahrens",
      "espnPlayerId": 3050487
    },
    {
      "round": 16,
      "pickInRound": 9,
      "overallPick": 159,
      "teamId": 2,
      "owner": "James McNeal",
      "espnPlayerId": 13934
    },
    {
      "round": 16,
      "pickInRound": 10,
      "overallPick": 160,
      "teamId": 3,
      "owner": "Carson Waite",
      "espnPlayerId": 3043234
    }
  ]
};
