const rfbKeyMap = {
  8: [
    65288,
    65288
  ],
  9: [
    65289,
    65289
  ],
  13: [
    65293,
    65293
  ],
  16: [
    65506,
    65506
  ],
  17: [
    65508,
    65508
  ],
  18: [
    65514,
    65514
  ],
  27: [
    65307,
    65307
  ],
  32: [
    32,
    32
  ],
  33: [
    65365,
    65365
  ],
  34: [
    65366,
    65366
  ],
  35: [
    65367,
    65367
  ],
  36: [
    65360,
    65360
  ],
  37: [
    65361,
    65361
  ],
  38: [
    65362,
    65362
  ],
  39: [
    65363,
    65363
  ],
  40: [
    65364,
    65364
  ],
  45: [
    65379,
    65379
  ],
  46: [
    65535,
    65535
  ],
  48: [
    48,
    41
  ],
  49: [
    49,
    33
  ],
  50: [
    50,
    64
  ],
  51: [
    51,
    35
  ],
  52: [
    52,
    36
  ],
  53: [
    53,
    37
  ],
  54: [
    54,
    94
  ],
  55: [
    55,
    38
  ],
  56: [
    56,
    42
  ],
  57: [
    57,
    40
  ],
  65: [
    97,
    65
  ],
  66: [
    98,
    66
  ],
  67: [
    99,
    67
  ],
  68: [
    100,
    68
  ],
  69: [
    101,
    69
  ],
  70: [
    102,
    70
  ],
  71: [
    103,
    71
  ],
  72: [
    104,
    72
  ],
  73: [
    105,
    73
  ],
  74: [
    106,
    74
  ],
  75: [
    107,
    75
  ],
  76: [
    108,
    76
  ],
  77: [
    109,
    77
  ],
  78: [
    110,
    78
  ],
  79: [
    111,
    79
  ],
  80: [
    112,
    80
  ],
  81: [
    113,
    81
  ],
  82: [
    114,
    82
  ],
  83: [
    115,
    83
  ],
  84: [
    116,
    84
  ],
  85: [
    117,
    85
  ],
  86: [
    118,
    86
  ],
  87: [
    119,
    87
  ],
  88: [
    120,
    88
  ],
  89: [
    121,
    89
  ],
  90: [
    122,
    90
  ],
  97: [
    49,
    49
  ],
  98: [
    50,
    50
  ],
  99: [
    51,
    51
  ],
  100: [
    52,
    52
  ],
  101: [
    53,
    53
  ],
  102: [
    54,
    54
  ],
  103: [
    55,
    55
  ],
  104: [
    56,
    56
  ],
  105: [
    57,
    57
  ],
  106: [
    42,
    42
  ],
  107: [
    61,
    61
  ],
  109: [
    45,
    45
  ],
  110: [
    46,
    46
  ],
  111: [
    47,
    47
  ],
  112: [
    65470,
    65470
  ],
  113: [
    65471,
    65471
  ],
  114: [
    65472,
    65472
  ],
  115: [
    65473,
    65473
  ],
  116: [
    65474,
    65474
  ],
  117: [
    65475,
    65475
  ],
  118: [
    65476,
    65476
  ],
  119: [
    65477,
    65477
  ],
  120: [
    65478,
    65478
  ],
  121: [
    65479,
    65479
  ],
  122: [
    65480,
    65480
  ],
  123: [
    65481,
    65481
  ],
  186: [
    59,
    58
  ],
  187: [
    61,
    43
  ],
  188: [
    44,
    60
  ],
  189: [
    45,
    95
  ],
  190: [
    46,
    62
  ],
  191: [
    47,
    63
  ],
  192: [
    96,
    126
  ],
  219: [
    91,
    123
  ],
  220: [
    92,
    124
  ],
  221: [
    93,
    125
  ],
  222: [
    39,
    34
  ]
};

var rdpKeyMap = {
  27: 0x0001,
  112: 0x003B,
  113: 0x003C,
  114: 0x003D,
  115: 0x003E,
  116: 0x003F,
  117: 0x0040,
  118: 0x0041,
  119: 0x0042,
  120: 0x0043,
  121: 0x0044,
  122: 0x0057,
  123: 0x0058,
  192: 0x0029,
  46: 0xE053,
  49: 0x0002,
  50: 0x0003,
  51: 0x0004,
  52: 0x0005,
  53: 0x0006,
  54: 0x0007,
  55: 0x0008,
  56: 0x0009,
  57: 0x000A,
  48: 0x000B,
  173: 0x000C,
  61: 0x000D,
  8: 0x000E,
  9: 0x000F,
  81: 0x0010,
  87: 0x0011,
  69: 0x0012,
  82: 0x0013,
  84: 0x0014,
  89: 0x0015,
  85: 0x0016,
  73: 0x0017,
  79: 0x0018,
  80: 0x0019,
  219: 0x001A,
  221: 0x001B,
  13: 0x001C,
  20: 0x003A,
  65: 0x001E,
  83: 0x001F,
  68: 0x0020,
  70: 0x0021,
  71: 0x0022,
  72: 0x0023,
  74: 0x0024,
  75: 0x0025,
  76: 0x0026,
  59: 0x0027,
  222: 0x0028,
  220: 0x002B,
  16: 0x002A,
  220: 0x0056,
  90: 0x002C,
  88: 0x002D,
  67: 0x002E,
  86: 0x002F,
  66: 0x0030,
  78: 0x0031,
  77: 0x0032,
  188: 0x0033,
  190: 0x0034,
  191: 0x0035,
  16: 0x0036,
  17: 0x001D,
  18: 0x0038,
  91: 0xE05B,
  32: 0x0039,
  18: 0xE038,
  91: 0xE05C,
  93: 0xE05D,
  17: 0xE01D,
  37: 0xE04B,
  38: 0xE048,
  40: 0xE050,
  39: 0xE04D,
  144: 0xE045,
  111: 0xE035,
  106: 0x0037,
  109: 0x004A,
  103: 0x0047,
  104: 0x0048,
  105: 0x0049,
  107: 0x004E,
  100: 0x004B,
  101: 0x004C,
  102: 0x004D,
  97: 0x004F,
  98: 0x0050,
  99: 0x0051,
  13: 0xE01C,
  96: 0x0052,
  110: 0x0053,
  162: 0x0029,
};