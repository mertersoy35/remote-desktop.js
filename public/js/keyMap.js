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
  "" : 0x0000,
  "Escape" : 0x0001,
  "Digit1" : 0x0002,
  "Digit2" : 0x0003,
  "Digit3" : 0x0004,
  "Digit4" : 0x0005,
  "Digit5" : 0x0006,
 "Digit6" : 0x0007,
  "Digit7" : 0x0008,
  "Digit8" : 0x0009,
  "Digit9" : 0x000A,
  "Digit0" : 0x000B,
  "Minus" : 0x000C,
  "Equal" : 0x000D,
   "Backspace" : 0x000E,
   "Tab" : 0x000F,
   "KeyQ" : 0x0010,
   "KeyW" : 0x0011,
   "KeyE" : 0x0012,
   "KeyR" : 0x0013,
   "KeyT" : 0x0014,
   "KeyY" : 0x0015,
   "KeyU" : 0x0016,
   "KeyI" : 0x0017,
   "KeyO" : 0x0018,
   "KeyP" : 0x0019,
   "BracketLeft" : 0x001A,
   "BracketRight" : 0x001B,
   "Enter" : 0x001C,
   "ControlLeft" : 0x001D,
   "KeyA" : 0x001E,
   "KeyS" : 0x001F,
   "KeyD" : 0x0020,
   "KeyF" : 0x0021,
   "KeyG" : 0x0022,
   "KeyH" : 0x0023,
   "KeyJ" : 0x0024,
   "KeyK" : 0x0025,
   "KeyL" : 0x0026,
   "Semicolon" : 0x0027,
   "Quote" : 0x0028,
   "Backquote" : 0x0029,
   "ShiftLeft" : 0x002A,
   "Backslash" : 0x002B,
   "KeyZ" : 0x002C,
   "KeyX" : 0x002D,
   "KeyC" : 0x002E,
   "KeyV" : 0x002F,
   "KeyB" : 0x0030,
   "KeyN" : 0x0031,
   "KeyM" : 0x0032,
   "Comma" : 0x0033,
   "Period" : 0x0034,
   "Slash" : 0x0035,
   "ShiftRight" : 0x0036,
   "NumpadMultiply" : 0x0037,
   "AltLeft" : 0x0038,
   "Space" : 0x0039,
   "CapsLock" : 0x003A,
   "F1" : 0x003B,
   "F2" : 0x003C,
   "F3" : 0x003D,
   "F4" : 0x003E,
   "F5" : 0x003F,
   "F6" : 0x0040,
   "F7" : 0x0041,
   "F8" : 0x0042,
   "F9" : 0x0043,
   "F10" : 0x0044,
   "Pause" : 0x0045,
   "ScrollLock" : 0x0046,
   "Numpad7" : 0x0047,
   "Numpad8" : 0x0048,
   "Numpad9" : 0x0049,
   "NumpadSubtract" : 0x004A,
   "Numpad4" : 0x004B,
   "Numpad5" : 0x004C,
   "Numpad6" : 0x004D,
   "NumpadAdd" : 0x004E,
   "Numpad1" : 0x004F,
   "Numpad2" : 0x0050,
   "Numpad3" : 0x0051,
   "Numpad0" : 0x0052,
   "NumpadDecimal" : 0x0053,
   "PrintScreen" : 0x0054,
   "IntlBackslash" : 0x0056,
   "F11" : 0x0057,
   "F12" : 0x0058,
   "NumpadEqual" : 0x0059,
   "F13" : 0x0064,
   "F14" : 0x0065,
   "F15" : 0x0066,
   "F16" : 0x0067,
   "F17" : 0x0068,
   "F18" : 0x0069,
   "F19" : 0x006A,
   "F20" : 0x006B,
   "F21" : 0x006C,
   "F22" : 0x006D,
   "F23" : 0x006E,
   "KanaMode" : 0x0070,
   "Lang2" : 0x0071,
   "Lang1" : 0x0072,
   "IntlRo" : 0x0073,
   "F24" : 0x0076,
   "Convert" : 0x0079,
   "NonConvert" : 0x007B,
   "IntlYen" : 0x007D,
   "NumpadComma" : 0x007E,
   "MediaTrackPrevious" : 0xE010,
   "MediaTrackNext" : 0xE019,
   "NumpadEnter" : 0xE01C,
   "ControlRight" : 0xE01D,
   "VolumeMute" : 0xE020,
   "LaunchApp2" : 0xE021,
   "MediaPlayPause" : 0xE022,
   "MediaStop" : 0xE024,
   "VolumeDown" : 0xE02E,
   "VolumeUp" : 0xE030,
   "BrowserHome" : 0xE032,
   "NumpadDivide" : 0xE035,
   "PrintScreen" : 0xE037,
   "AltRight" : 0xE038,
   "NumLock" : 0xE045,
   "Pause" : 0xE046,
   "Home" : 0xE047,
   "ArrowUp" : 0xE048,
   "PageUp" : 0xE049,
   "ArrowLeft" : 0xE04B,
   "ArrowRight" : 0xE04D,
   "End" : 0xE04F,
   "ArrowDown" : 0xE050,
   "PageDown" : 0xE051,
   "Insert" : 0xE052,
   "Delete" : 0xE053,
   "OSLeft" : 0xE05B,
   "OSRight" : 0xE05C,
   "ContextMenu" : 0xE05D,
   "Power" : 0xE05E,
   "BrowserSearch" : 0xE065,
   "BrowserFavorites" : 0xE066,
   "BrowserRefresh" : 0xE067,
   "BrowserStop" : 0xE068,
   "BrowserForward" : 0xE069,
   "BrowserBack" : 0xE06A,
   "LaunchApp1" : 0xE06B,
   "LaunchMail" : 0xE06C,
   "MediaSelect" : 0xE06D
};

var rdpUnicode = {
  27 : "Escape",
  112 : "F1",
  113 : "F2",
  114 : "F3",
  115 : "F4",
  116 : "F5",
  117 : "F6",
  118 : "F7",
  119 : "F8",
  120 : "F9",
  121 : "F10",
  122 : "F11",
  123 : "F12",
  192 : "Backquote",
  49 : "Digit1",
  50 : "Digit2",
  51 : "Digit3",
  52 : "Digit4",
  53 : "Digit5",
  54 : "Digit6",
  55 : "Digit7",
  56 : "Digit8",
  57 : "Digit9",
  48 : "Digit0",
  173 : "Minus",
  61 : "Equal",
  8 : "Backspace",
  9 : "Tab",
  81 : "KeyQ",
  87 : "KeyW",
  69 : "KeyE",
  82 : "KeyR",
  84 : "KeyT",
  89 : "KeyY",
  85 : "KeyU",
  73 : "KeyI",
  79 : "KeyO",
  80 : "KeyP",
  219 : "BracketLeft",
  221 : "BracketRight",
  13 : "Enter",
  20 : "CapsLock",
  65 : "KeyA",
  83 : "KeyS",
  68 : "KeyD",
  70 : "KeyF",
  71 : "KeyG",
  72 : "KeyH",
  74 : "KeyJ",
  75 : "KeyK",
  76 : "KeyL",
  59 : "Semicolon",
  222 : "Quote",
  220 : "Backslash",
  16 : "ShiftLeft",
  220 : "IntlBackslash",
  90 : "KeyZ",
  88 : "KeyX",
  67 : "KeyC",
  86 : "KeyV",
  66 : "KeyB",
  78 : "KeyN",
  77 : "KeyM",
  188 : "Comma",
  190 : "Period",
  191 : "Slash",
  16 : "ShiftRight",
  17 : "ControlLeft",
  18 : "AltLeft",
  91 : "OSLeft",
  32 : "Space",
  18 : "AltRight",
  91 : "OSRight",
  93 : "ContextMenu",
  17 : "ControlRight",
  37 : "ArrowLeft",
  38 : "ArrowUp",
  40 : "ArrowDown",
  39 : "ArrowRight",
  144 : "NumLock",
  144 : "NumLock",
  111 : "NumpadDivide",
  106 : "NumpadMultiply",
  109 : "NumpadSubtract",
  103 : "Numpad7",
  104 : "Numpad8",
  105 : "Numpad9",
  107 : "NumpadAdd",
  100 : "Numpad4",
  101 : "Numpad5",
  102 : "Numpad6",
  97 : "Numpad1",
  98 : "Numpad2",
  99 : "Numpad3",
  13 : "NumpadEnter",
  96 : "Numpad0",
  110 : "NumpadDecimal",
  17 : "ControlLeft"	
};