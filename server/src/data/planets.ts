export interface Planet {
  id: string;
  name: string;
  type: 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf_planet' | 'star';
  mass: number;
  massUnit: string;
  radius: number;
  distanceFromSun: number;
  distanceUnit: string;
  orbitalPeriod: number;
  rotationPeriod: number;
  moons: number;
  rings: boolean;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  surfaceGravity: number;
  escapeVelocity: number;
  atmosphere: string[];
  color: string;
  glowColor: string;
  description: string;
  funFacts: string[];
  composition: { element: string; percentage: number }[];
  missions: string[];
  discoveredBy?: string;
  discoveryYear?: number;
  obliquity: number;
  magneticField: boolean;
  orbitalRadius3D: number;
  size3D: number;
}

export const PLANETS: Planet[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    mass: 1.989e30,
    massUnit: 'kg',
    radius: 695700,
    distanceFromSun: 0,
    distanceUnit: 'AU',
    orbitalPeriod: 0,
    rotationPeriod: 25.38,
    moons: 0,
    rings: false,
    avgTemp: 5505,
    minTemp: 4200,
    maxTemp: 15000000,
    surfaceGravity: 274,
    escapeVelocity: 617.5,
    atmosphere: ['Hydrogen 73%', 'Helium 25%', 'Oxygen 0.8%', 'Carbon 0.3%'],
    color: '#FDB813',
    glowColor: '#FF8C00',
    description: 'The Sun is the star at the center of our solar system, a nearly perfect sphere of hot plasma generating energy through nuclear fusion. It accounts for 99.86% of the total mass of the Solar System.',
    funFacts: [
      'The Sun converts 600 million tons of hydrogen to helium every second',
      'Light from the Sun takes 8 minutes 20 seconds to reach Earth',
      'The Sun is 4.6 billion years old and halfway through its life',
      'The corona is 300× hotter than the surface',
      'The Sun\'s gravity holds the entire solar system together'
    ],
    composition: [
      { element: 'Hydrogen', percentage: 73 },
      { element: 'Helium', percentage: 25 },
      { element: 'Oxygen', percentage: 0.8 },
      { element: 'Carbon', percentage: 0.3 },
      { element: 'Other', percentage: 0.9 }
    ],
    missions: ['soho', 'stereo', 'parker-solar-probe', 'solar-orbiter'],
    obliquity: 7.25,
    magneticField: true,
    orbitalRadius3D: 0,
    size3D: 2.5
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'terrestrial',
    mass: 3.301e23,
    massUnit: 'kg',
    radius: 2439.7,
    distanceFromSun: 0.387,
    distanceUnit: 'AU',
    orbitalPeriod: 87.97,
    rotationPeriod: 58.65,
    moons: 0,
    rings: false,
    avgTemp: 167,
    minTemp: -180,
    maxTemp: 430,
    surfaceGravity: 3.7,
    escapeVelocity: 4.3,
    atmosphere: ['Oxygen', 'Sodium', 'Hydrogen', 'Helium'],
    color: '#B5B5B5',
    glowColor: '#888888',
    description: 'Mercury is the smallest planet in our Solar System and the closest to the Sun. It has extreme temperature variations and a heavily cratered surface similar to Earth\'s Moon.',
    funFacts: [
      'Mercury has the most eccentric orbit of any planet',
      'A day on Mercury lasts longer than its year',
      'Mercury has water ice in permanently shadowed polar craters',
      'Mercury is shrinking as its core cools',
      'The MESSENGER spacecraft discovered vast volcanic plains'
    ],
    composition: [
      { element: 'Iron', percentage: 70 },
      { element: 'Silicates', percentage: 28 },
      { element: 'Other', percentage: 2 }
    ],
    missions: ['mariner-10', 'messenger', 'bepicolombo'],
    obliquity: 0.03,
    magneticField: true,
    orbitalRadius3D: 3.8,
    size3D: 0.18
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'terrestrial',
    mass: 4.867e24,
    massUnit: 'kg',
    radius: 6051.8,
    distanceFromSun: 0.723,
    distanceUnit: 'AU',
    orbitalPeriod: 224.7,
    rotationPeriod: 243.02,
    moons: 0,
    rings: false,
    avgTemp: 465,
    minTemp: 462,
    maxTemp: 475,
    surfaceGravity: 8.87,
    escapeVelocity: 10.36,
    atmosphere: ['Carbon Dioxide 96.5%', 'Nitrogen 3.5%', 'Sulfuric Acid clouds'],
    color: '#E8CDA2',
    glowColor: '#C4A265',
    description: 'Venus is the second planet from the Sun and Earth\'s closest neighbor. It has a thick, toxic atmosphere and surface temperatures hot enough to melt lead, making it the hottest planet despite not being closest to the Sun.',
    funFacts: [
      'Venus rotates backwards compared to most planets',
      'A day on Venus is longer than its year',
      'Venus has the most volcanoes of any planet',
      'Atmospheric pressure on Venus is 90× that of Earth',
      'Venus and Earth are sometimes called twin planets due to similar size'
    ],
    composition: [
      { element: 'Iron', percentage: 65 },
      { element: 'Silicates', percentage: 30 },
      { element: 'Other', percentage: 5 }
    ],
    missions: ['mariner-2', 'venera-series', 'magellan', 'venus-express', 'akatsuki', 'bepicolombo'],
    obliquity: 177.4,
    magneticField: false,
    orbitalRadius3D: 5.5,
    size3D: 0.42
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'terrestrial',
    mass: 5.972e24,
    massUnit: 'kg',
    radius: 6371,
    distanceFromSun: 1.0,
    distanceUnit: 'AU',
    orbitalPeriod: 365.25,
    rotationPeriod: 1.0,
    moons: 1,
    rings: false,
    avgTemp: 15,
    minTemp: -89,
    maxTemp: 57,
    surfaceGravity: 9.81,
    escapeVelocity: 11.19,
    atmosphere: ['Nitrogen 78%', 'Oxygen 21%', 'Argon 0.9%', 'Carbon Dioxide 0.04%'],
    color: '#4B82E3',
    glowColor: '#2255CC',
    description: 'Earth is our home planet and the only known world harboring life. It has liquid water on its surface, a protective magnetic field, and the perfect conditions to support diverse ecosystems.',
    funFacts: [
      'Earth is the densest planet in the Solar System',
      '71% of Earth\'s surface is covered by water',
      'Earth has a powerful magnetic field that protects life from solar radiation',
      'Earth\'s Moon stabilizes our planet\'s tilt, enabling stable seasons',
      'Earth is the only planet not named after a Greek or Roman god'
    ],
    composition: [
      { element: 'Iron', percentage: 32 },
      { element: 'Oxygen', percentage: 30 },
      { element: 'Silicon', percentage: 15 },
      { element: 'Magnesium', percentage: 14 },
      { element: 'Other', percentage: 9 }
    ],
    missions: ['iss', 'hubble', 'jwst', 'terra', 'aqua', 'landsat'],
    obliquity: 23.44,
    magneticField: true,
    orbitalRadius3D: 7.5,
    size3D: 0.45
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'terrestrial',
    mass: 6.417e23,
    massUnit: 'kg',
    radius: 3389.5,
    distanceFromSun: 1.524,
    distanceUnit: 'AU',
    orbitalPeriod: 686.97,
    rotationPeriod: 1.026,
    moons: 2,
    rings: false,
    avgTemp: -65,
    minTemp: -125,
    maxTemp: 20,
    surfaceGravity: 3.72,
    escapeVelocity: 5.03,
    atmosphere: ['Carbon Dioxide 95.3%', 'Nitrogen 2.7%', 'Argon 1.6%'],
    color: '#C1440E',
    glowColor: '#8B2500',
    description: 'Mars, the Red Planet, is the fourth planet from the Sun and the most explored planet beyond Earth. Evidence of ancient rivers and lakes suggests Mars once had liquid water. It\'s the primary target for human colonization.',
    funFacts: [
      'Mars has the tallest volcano in the Solar System - Olympus Mons (21km)',
      'Mars has the largest canyon - Valles Marineris (4000km long)',
      'Sunsets on Mars are blue',
      'Mars has two tiny moons: Phobos and Deimos',
      'Perseverance rover is producing oxygen on Mars via MOXIE'
    ],
    composition: [
      { element: 'Iron Oxide', percentage: 47 },
      { element: 'Silicon Dioxide', percentage: 22 },
      { element: 'Magnesium', percentage: 10 },
      { element: 'Aluminum', percentage: 8 },
      { element: 'Other', percentage: 13 }
    ],
    missions: ['mariner-4', 'viking-1', 'viking-2', 'mars-pathfinder', 'mars-global-surveyor', 'mars-odyssey', 'spirit', 'opportunity', 'mars-express', 'maven', 'curiosity', 'insight', 'perseverance', 'hope', 'tianwen-1'],
    obliquity: 25.19,
    magneticField: false,
    orbitalRadius3D: 10.5,
    size3D: 0.3
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'gas_giant',
    mass: 1.898e27,
    massUnit: 'kg',
    radius: 69911,
    distanceFromSun: 5.203,
    distanceUnit: 'AU',
    orbitalPeriod: 4332.59,
    rotationPeriod: 0.414,
    moons: 95,
    rings: true,
    avgTemp: -110,
    minTemp: -160,
    maxTemp: -90,
    surfaceGravity: 24.79,
    escapeVelocity: 59.5,
    atmosphere: ['Hydrogen 90%', 'Helium 10%', 'Methane', 'Ammonia', 'Water'],
    color: '#C88B3A',
    glowColor: '#8B5A00',
    description: 'Jupiter is the largest planet in the Solar System, more than twice as massive as all other planets combined. Its iconic Great Red Spot is a storm that has raged for over 400 years. Jupiter acts as a gravitational shield protecting inner planets.',
    funFacts: [
      'Jupiter\'s Great Red Spot is a storm larger than Earth',
      'Jupiter has 95 known moons, including the four large Galilean moons',
      'Jupiter emits more heat than it receives from the Sun',
      'Jupiter\'s moon Europa may harbor a subsurface ocean with life',
      'Jupiter rotates faster than any other planet - one day is just 10 hours'
    ],
    composition: [
      { element: 'Hydrogen', percentage: 90 },
      { element: 'Helium', percentage: 10 }
    ],
    missions: ['pioneer-10', 'pioneer-11', 'voyager-1', 'voyager-2', 'galileo', 'cassini', 'new-horizons', 'juno', 'juice'],
    obliquity: 3.13,
    magneticField: true,
    orbitalRadius3D: 16,
    size3D: 1.2
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'gas_giant',
    mass: 5.683e26,
    massUnit: 'kg',
    radius: 58232,
    distanceFromSun: 9.537,
    distanceUnit: 'AU',
    orbitalPeriod: 10759.22,
    rotationPeriod: 0.444,
    moons: 146,
    rings: true,
    avgTemp: -140,
    minTemp: -185,
    maxTemp: -122,
    surfaceGravity: 10.44,
    escapeVelocity: 35.5,
    atmosphere: ['Hydrogen 96.3%', 'Helium 3.25%', 'Methane', 'Ammonia'],
    color: '#E4D191',
    glowColor: '#B8A040',
    description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System. Its stunning ring system, made of ice and rock particles, extends up to 282,000 km from Saturn and is only about 20 meters thick.',
    funFacts: [
      'Saturn is the least dense planet - it could float on water',
      'Saturn\'s rings are made of billions of ice and rock particles',
      'Saturn has 146 known moons - the most of any planet',
      'Titan, Saturn\'s largest moon, has lakes of liquid methane',
      'Cassini spacecraft orbited Saturn for 13 years'
    ],
    composition: [
      { element: 'Hydrogen', percentage: 96 },
      { element: 'Helium', percentage: 4 }
    ],
    missions: ['pioneer-11', 'voyager-1', 'voyager-2', 'cassini'],
    obliquity: 26.73,
    magneticField: true,
    orbitalRadius3D: 22,
    size3D: 1.0
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'ice_giant',
    mass: 8.681e25,
    massUnit: 'kg',
    radius: 25362,
    distanceFromSun: 19.191,
    distanceUnit: 'AU',
    orbitalPeriod: 30688.5,
    rotationPeriod: 0.718,
    moons: 28,
    rings: true,
    avgTemp: -195,
    minTemp: -224,
    maxTemp: -195,
    surfaceGravity: 8.87,
    escapeVelocity: 21.3,
    atmosphere: ['Hydrogen 83%', 'Helium 15%', 'Methane 2.3%'],
    color: '#7EABDE',
    glowColor: '#4080B0',
    description: 'Uranus is the seventh planet from the Sun and the first discovered with a telescope in 1781. Uniquely, Uranus rotates on its side with an axial tilt of 98°. It emits almost no internal heat, making it the coldest planetary atmosphere.',
    funFacts: [
      'Uranus rotates on its side - its axis tilts 98°',
      'Uranus is the coldest planet despite not being furthest from the Sun',
      'Uranus was the first planet discovered with a telescope',
      'Uranus has 13 known rings',
      'Uranus\'s moons are named after Shakespeare characters'
    ],
    composition: [
      { element: 'Water Ice', percentage: 60 },
      { element: 'Methane Ice', percentage: 20 },
      { element: 'Hydrogen', percentage: 15 },
      { element: 'Other', percentage: 5 }
    ],
    missions: ['voyager-2', 'uranus-orbiter-probe'],
    discoveredBy: 'William Herschel',
    discoveryYear: 1781,
    obliquity: 97.77,
    magneticField: true,
    orbitalRadius3D: 28,
    size3D: 0.7
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'ice_giant',
    mass: 1.024e26,
    massUnit: 'kg',
    radius: 24622,
    distanceFromSun: 30.069,
    distanceUnit: 'AU',
    orbitalPeriod: 60182,
    rotationPeriod: 0.671,
    moons: 16,
    rings: true,
    avgTemp: -200,
    minTemp: -220,
    maxTemp: -200,
    surfaceGravity: 11.15,
    escapeVelocity: 23.5,
    atmosphere: ['Hydrogen 80%', 'Helium 19%', 'Methane 1.5%'],
    color: '#3E54E8',
    glowColor: '#1A2FCC',
    description: 'Neptune is the eighth and most distant planet from the Sun. It has the strongest winds in the Solar System, reaching up to 2,100 km/h. Its moon Triton orbits backwards and is likely a captured Kuiper Belt object.',
    funFacts: [
      'Neptune has the strongest winds in the Solar System',
      'Neptune was predicted mathematically before it was observed',
      'Neptune\'s moon Triton orbits in the opposite direction',
      'One year on Neptune = 165 Earth years',
      'Voyager 2 is the only spacecraft to have visited Neptune'
    ],
    composition: [
      { element: 'Water Ice', percentage: 55 },
      { element: 'Methane Ice', percentage: 25 },
      { element: 'Hydrogen', percentage: 15 },
      { element: 'Other', percentage: 5 }
    ],
    missions: ['voyager-2'],
    discoveredBy: 'Johann Galle',
    discoveryYear: 1846,
    obliquity: 28.32,
    magneticField: true,
    orbitalRadius3D: 34,
    size3D: 0.65
  }
];
