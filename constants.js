
let player;
let obstacles = [];
let platforms = [];
let groundY;
let gameOver = false;
let score = 0;
let spawnTimer = -10;
let nextSpawn = 60;

let startPlatformY;
let lastPlatformY;

let scrollX = 0;
let spawnQueue = [];
let nextPatternX = 300;

let gameSpeed = 6;
const MAX_SPEED = 8.5;
const BASE_SPEED = 6;

let tileSize = 20;

let spawnTimer_pl = 0;
let nextSpawn_pl = 60;

let PLATFORM_MIN_Y;
let PLATFORM_MAX_Y;

let particles = [];

let deathDelay = 0;
const DEATH_DELAY_FRAMES = 20;

let platform;
let highScore = 0;
let backObstacleHeight = 0;
let gameStarted = false;

let slimeColors = [
  { name: 'Pyro',    color: '#FF4500' },
  { name: 'Hydro',   color: '#1E90FF' },
  { name: 'Cryo',    color: '#A8E4F0' },
  { name: 'Dendro',  color: '#4CAF50' },
  { name: 'Electro', color: '#9B59B6' },
  { name: 'Geo',     color: '#C8A84B' }
];

let selectedColor = 0;
let gamePhase = 'select';

const JUMP_FORCE = -12;
const JUMP_HOLD_FORCE = -0.9;
const JUMP_HOLD_MAX = 10;

let jumpKeyHold = false;
let jumpHoldFrames = 0;

let coyoteFrames = 0;
const COYOTE_MAX = 6;

let isBump = false;

let bgX = 0;
const BG_SPEED = 1.5;

let bgImages = {};
let currentBiome = 'desert';
let lastLevel = 0;

let slimeImages = [];

let nextBiome = null;
let biomeAlpha = 255;
let biomeTransitioning = false;

const BIOME_COLORS = {
  desert:     { fill: [210, 180, 80],  stroke: [160, 130, 40],  highlight: [240, 210, 100] },
  snow:       { fill: [180, 220, 240], stroke: [120, 170, 200], highlight: [220, 245, 255] },
  jungle:     { fill: [80, 160, 50],   stroke: [30, 100, 30],   highlight: [80, 200, 80]   },
  underworld: { fill: [230, 70, 40],   stroke: [80, 20, 10],    highlight: [200, 80, 20]   },
  ocean:      { fill: [80, 140, 220],  stroke: [20, 60, 120],   highlight: [60, 140, 210]  },
  hallow:     { fill: [160, 120, 210], stroke: [110, 70, 160],  highlight: [200, 160, 240] }
};

const SLIME_BIOME = ['underworld', 'ocean', 'snow', 'jungle', 'hallow', 'desert'];

const PATTERNS = [
  {
    name: 'flat',
    gap: 250,
    platforms: [
      { dx: 0,   dy:  0,  w: 240 },
      { dx: 280, dy: 10,  w: 200 },
    ]
  },
  {
    name: 'ascending',
    gap: 280,
    platforms: [
      { dx: 0,   dy:  0,  w: 180 },
      { dx: 220, dy: -50, w: 160 },
      { dx: 420, dy: -50, w: 140 },
    ]
  },
  {
    name: 'descending',
    gap: 280,
    platforms: [
      { dx: 0,   dy:  0,  w: 180 },
      { dx: 220, dy: 50,  w: 160 },
      { dx: 420, dy: 50,  w: 140 },
    ]
  },
  {
    name: 'zigzag',
    gap: 320,
    platforms: [
      { dx: 0,   dy:  0,  w: 140 },
      { dx: 180, dy: -70, w: 120 },
      { dx: 340, dy:  70, w: 140 },
      { dx: 520, dy: -70, w: 120 },
    ]
  },
  {
    name: 'vertical_stack',
    gap: 300,
    platforms: [
      { dx: 0,   dy:  0,   w: 100 },
      { dx: 0,   dy: -90,  w: 80  },
      { dx: 220, dy: -45,  w: 120 },
    ]
  },
  {
    name: 'hard',
    gap: 350,
    platforms: [
      { dx: 0,   dy:  0,  w: 100 },
      { dx: 160, dy: -80, w: 80  },
      { dx: 300, dy:  60, w: 90  },
      { dx: 440, dy: -70, w: 80  },
    ]
  },
  {
    name: 'staircase_up',
    gap: 300,
    platforms: [
      { dx: 0,   dy:  0,   w: 120 },
      { dx: 150, dy: -40,  w: 100 },
      { dx: 290, dy: -40,  w: 100 },
      { dx: 430, dy: -40,  w: 120 },
    ]
  },
  {
    name: 'staircase_down',
    gap: 300,
    platforms: [
      { dx: 0,   dy:  0,   w: 120 },
      { dx: 150, dy:  40,  w: 100 },
      { dx: 290, dy:  40,  w: 100 },
      { dx: 430, dy:  40,  w: 120 },
    ]
  },
  {
    name: 'island',
    gap: 320,
    platforms: [
      { dx: 0,   dy:  0,   w: 120 },
      { dx: 150, dy: -80,  w: 160 },
      { dx: 340, dy:  80,  w: 120 },
    ]
  },
  {
    name: 'double_stack',
    gap: 350,
    platforms: [
      { dx: 0,   dy:  0,   w: 100 },
      { dx: 0,   dy: -80,  w: 80  },
      { dx: 180, dy: -40,  w: 140 },
      { dx: 360, dy:  40,  w: 120 },
    ]
  },
  {
    name: 'long_gap',
    gap: 400,
    platforms: [
      { dx: 0,   dy:  0,   w: 180 },
      { dx: 320, dy: -20,  w: 180 },
    ]
  },
  {
    name: 'rhythm',
    gap: 280,
    platforms: [
      { dx: 0,   dy:  0,   w: 100 },
      { dx: 150, dy:  0,   w: 100 },
      { dx: 300, dy:  0,   w: 100 },
      { dx: 450, dy:  0,   w: 100 },
    ]
  },
  {
    name: 'wave',
    gap: 350,
    platforms: [
      { dx: 0,   dy:  0,   w: 120 },
      { dx: 160, dy: -60,  w: 100 },
      { dx: 300, dy:  60,  w: 100 },
      { dx: 440, dy: -60,  w: 120 },
      { dx: 580, dy:  60,  w: 100 },
    ]
  },
  {
    name: 'cliff',
    gap: 300,
    platforms: [
      { dx: 0,   dy:  0,   w: 200 },
      { dx: 240, dy: 120,  w: 160 },
      { dx: 430, dy: -40,  w: 140 },
    ]
  },
];