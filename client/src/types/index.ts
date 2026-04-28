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

export interface Mission {
  id: string;
  name: string;
  agency: string;
  launchDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'failed' | 'upcoming' | 'extended';
  type: 'orbiter' | 'lander' | 'rover' | 'flyby' | 'telescope' | 'crewed' | 'probe' | 'sample_return' | 'impactor';
  target: string;
  targetType: 'planet' | 'moon' | 'asteroid' | 'comet' | 'star' | 'space_station' | 'deep_space';
  description: string;
  achievements: string[];
  image?: string;
  distanceTraveled?: string;
  cost?: string;
  notableDiscoveries?: string[];
}

export interface APOD {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
}

export interface NEO {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    miss_distance: { kilometers: string; lunar: string };
    relative_velocity: { kilometers_per_hour: string };
  }>;
  absolute_magnitude_h: number;
  nasa_jpl_url: string;
}

export interface SpaceWeatherEvent {
  activityID: string;
  catalog: string;
  startTime: string;
  endTime?: string;
  note: string;
  link: string;
}

export interface MarsPhoto {
  id: number;
  sol: number;
  img_src: string;
  earth_date: string;
  rover: { name: string; status: string };
  camera: { full_name: string };
}

export interface Exoplanet {
  pl_name: string;
  hostname: string;
  pl_orbper: number;
  pl_rade: number;
  pl_masse: number;
  disc_year: number;
  discoverymethod: string;
}

export interface LiveData {
  neo?: {
    timestamp: string;
    totalCount: number;
    closest: NEO[];
    hazardous: number;
  };
  iss?: {
    timestamp: string;
    position: { latitude: string; longitude: string };
  };
}
