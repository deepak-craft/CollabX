export interface DepartmentCapability {
  id: string;
  departmentName: string;
  universityId: string;
  universityName: string;
  domains: string[];
  capabilities: string[];
  skills: string[];
  technologies: string[];
  keywords: string[];
}

export interface UniversityData {
  id: string;
  name: string;
  shortName: string;
  location: string;
  departments: DepartmentCapability[];
}

export const UNIVERSITIES: UniversityData[] = [
  {
    id: 'bit-mesra',
    name: 'Birla Institute of Technology (BIT) Mesra',
    shortName: 'BIT Mesra',
    location: 'Ranchi, Jharkhand',
    departments: [
      {
        id: 'bit-cse',
        departmentName: 'Computer Science & Engineering',
        universityId: 'bit-mesra',
        universityName: 'Birla Institute of Technology (BIT) Mesra',
        domains: ['Artificial Intelligence', 'Data Science', 'Waste Management', 'Cybersecurity', 'Smart City IT'],
        capabilities: ['AI/ML Algorithms', 'Software Development', 'Data Science', 'IoT Systems', 'Cybersecurity', 'Civic Route Optimization'],
        skills: ['Python', 'Cloud Computing', 'Computer Vision', 'Data Analytics', 'Mobile Applications', 'Predictive Modeling'],
        technologies: ['TensorFlow', 'React', 'FastAPI', 'GIS Mapping', 'Edge Computing', 'Sensor Telemetry'],
        keywords: ['waste', 'garbage', 'ai', 'software', 'app', 'cybersecurity', 'smart city', 'camera', 'detection', 'collection', 'route', 'analytics', 'data', 'cloud', 'portal']
      },
      {
        id: 'bit-ece',
        departmentName: 'Electronics & Communication Engineering',
        universityId: 'bit-mesra',
        universityName: 'Birla Institute of Technology (BIT) Mesra',
        domains: ['Telemetry', 'Embedded Systems', 'Signal Processing', 'Wireless Sensor Networks'],
        capabilities: ['Signal Processing', 'Embedded Systems', 'Communication Systems', 'Telemetry Transmitters', 'RF Microelectronics'],
        skills: ['Embedded C', 'FPGA Design', 'RF Design', 'Wireless Protocols', 'Sensor Interfacing'],
        technologies: ['LoRaWAN', 'ZigBee', 'Microcontrollers', 'DSP Processors', 'Cellular IoT'],
        keywords: ['telemetry', 'signal', 'wireless', 'communication', 'sensor network', 'rf', 'transmitter', 'lora', 'hardware', 'embedded']
      },
      {
        id: 'bit-civil',
        departmentName: 'Civil Engineering',
        universityId: 'bit-mesra',
        universityName: 'Birla Institute of Technology (BIT) Mesra',
        domains: ['Urban Infrastructure', 'Hydraulics & Drainage', 'Structural Engineering', 'Smart Cities', 'Transportation'],
        capabilities: ['Roads & Highways', 'Stormwater Drainage', 'Hydraulic Modeling', 'Structural Engineering', 'Smart Cities'],
        skills: ['Hydraulic Design', 'Structural Analysis', 'Pavement Engineering', 'Drainage Siphoning', 'Surveying'],
        technologies: ['AutoCAD Civil 3D', 'HEC-RAS', 'GIS Spatial Analysis', 'STAAD.Pro', 'Geotextiles'],
        keywords: ['waterlogging', 'drain', 'drainage', 'flood', 'culvert', 'siphon', 'nullah', 'road', 'stormwater', 'monsoon', 'inundation', 'structural', 'urban infrastructure']
      },
      {
        id: 'bit-eee',
        departmentName: 'Electrical & Electronics Engineering',
        universityId: 'bit-mesra',
        universityName: 'Birla Institute of Technology (BIT) Mesra',
        domains: ['Power Distribution', 'Renewable Energy', 'Smart Grids', 'Electrical Safety'],
        capabilities: ['Power Distribution', 'Smart Grid Technology', 'Renewable Integration', 'Electrical Safety Audits'],
        skills: ['Grid Automation', 'Substation Protection', 'Solar Power Modeling', 'Energy Auditing'],
        technologies: ['SCADA Systems', 'Inverter Control', 'Microgrid Controllers', 'Power Quality Analyzers'],
        keywords: ['electricity', 'power', 'grid', 'transformer', 'voltage', 'outage', 'solar', 'substation', 'energy', 'electrical safety', 'wire']
      }
    ]
  },
  {
    id: 'iit-ism-dhanbad',
    name: 'IIT (ISM) Dhanbad',
    shortName: 'IIT (ISM) Dhanbad',
    location: 'Dhanbad, Jharkhand',
    departments: [
      {
        id: 'iit-cse',
        departmentName: 'Computer Science & Engineering',
        universityId: 'iit-ism-dhanbad',
        universityName: 'IIT (ISM) Dhanbad',
        domains: ['High-Performance Computing', 'Geospatial AI', 'Data Mining', 'Industrial Automation Systems'],
        capabilities: ['Distributed Computing', 'Geospatial Analytics', 'Deep Learning', 'Real-Time Edge Analytics'],
        skills: ['Distributed Systems', 'GPU Computing', 'Spatial Query Optimization', 'Image Classification'],
        technologies: ['PyTorch', 'Apache Spark', 'Geospatial Rasters', 'Docker', 'Kubernetes'],
        keywords: ['hpc', 'geospatial', 'high performance computing', 'deep learning', 'cloud pipeline', 'industrial ai']
      },
      {
        id: 'iit-mining',
        departmentName: 'Mining Engineering',
        universityId: 'iit-ism-dhanbad',
        universityName: 'IIT (ISM) Dhanbad',
        domains: ['Mining Safety', 'Mine Monitoring', 'Dust Control', 'Industrial Automation', 'Subterranean Mechanics'],
        capabilities: ['Mining Safety Audits', 'Mine Tailings Monitoring', 'Dust Control Suppression', 'Slope Stability', 'Industrial Hazard Control'],
        skills: ['Geotechnical Analysis', 'Mine Ventilation Modeling', 'Seismic Sensor Deployment', 'Blasting Safety'],
        technologies: ['Seismic Sensors', 'Dust Suppression Mist Cannons', 'Slope Inclinometers', 'Rock Mechanics Testing'],
        keywords: ['mining', 'mine', 'coal', 'dust', 'overburden', 'quarry', 'blasting', 'excavation', 'tailings', 'slope collapse', 'industrial safety', 'subterranean']
      },
      {
        id: 'iit-env',
        departmentName: 'Environmental Science & Engineering',
        universityId: 'iit-ism-dhanbad',
        universityName: 'IIT (ISM) Dhanbad',
        domains: ['Water Quality', 'Pollution Monitoring', 'Air Quality', 'Environmental Engineering', 'Hydrology & Groundwater'],
        capabilities: ['Water Quality Testing', 'Pollution Remediation', 'Continuous Air Monitoring', 'Groundwater Contamination Assessment', 'Effluent Management'],
        skills: ['Water Quality Sampling', 'Chemical Analysis', 'Spectrophotometry', 'Environmental Impact Assessment', 'Microbiological Testing'],
        technologies: ['Multi-Parameter Water Probes', 'Spectrophotometer', 'PM2.5/PM10 Air Monitors', 'Ion Chromatography', 'Bio-filtration'],
        keywords: ['water', 'drinking water', 'contamination', 'contaminate', 'pollute', 'pollution', 'arsenic', 'fluoride', 'air quality', 'effluent', 'toxic', 'clean water', 'drinking', 'groundwater', 'well', 'filtration', 'environmental']
      },
      {
        id: 'iit-electronics',
        departmentName: 'Electronics Engineering',
        universityId: 'iit-ism-dhanbad',
        universityName: 'IIT (ISM) Dhanbad',
        domains: ['IoT Sensors', 'Industrial Instrumentation', 'Environmental Telemetry', 'Embedded Sensing'],
        capabilities: ['Sensor Array Design', 'Industrial Instrumentation', 'Low-Power Field Nodes', 'Telemetry Integration'],
        skills: ['Circuit Design', 'Sensor Calibration', 'Firmware Engineering', 'Battery Management'],
        technologies: ['MEMS Sensors', 'Optical Sensing', 'ADC Converters', 'Industrial Fieldbus'],
        keywords: ['sensor', 'iot', 'hardware', 'instrumentation', 'low power', 'monitoring device', 'circuit', 'node']
      }
    ]
  },
  {
    id: 'nit-jamshedpur',
    name: 'National Institute of Technology (NIT) Jamshedpur',
    shortName: 'NIT Jamshedpur',
    location: 'Jamshedpur, Jharkhand',
    departments: [
      {
        id: 'nit-cse',
        departmentName: 'Computer Science & Engineering',
        universityId: 'nit-jamshedpur',
        universityName: 'National Institute of Technology (NIT) Jamshedpur',
        domains: ['Web Platforms', 'Data Analytics', 'Computer Vision', 'IoT Gateways'],
        capabilities: ['Full-Stack Web Platforms', 'Public Dashboard Design', 'Edge Computer Vision', 'Data Pipelines'],
        skills: ['React', 'TypeScript', 'Node.js', 'OpenCV', 'REST APIs'],
        technologies: ['PostgreSQL', 'Docker', 'YOLO Object Detection', 'MQTT'],
        keywords: ['web platform', 'dashboard', 'analytics', 'vision', 'edge detection', 'citizen portal']
      },
      {
        id: 'nit-civil',
        departmentName: 'Civil Engineering',
        universityId: 'nit-jamshedpur',
        universityName: 'National Institute of Technology (NIT) Jamshedpur',
        domains: ['Road Infrastructure', 'Highway Engineering', 'Pothole Remediation', 'Bridge & Structural Health', 'Urban Drainage'],
        capabilities: ['Road Pavement Design', 'Pothole Detection & Repair', 'Infrastructure Drainage', 'Structural Health Monitoring', 'Highway Safety'],
        skills: ['Pavement Material Testing', 'Bituminous Mix Design', 'Non-Destructive Testing', 'Traffic Impact Analysis'],
        technologies: ['Cold-Mix Bitumen', 'Reclaimed Asphalt Pavement (RAP)', 'Accelerometers', 'Strain Gauges'],
        keywords: ['pothole', 'road', 'highway', 'nh-33', 'pavement', 'crack', 'bridge', 'flyover', 'asphalt', 'bitumen', 'traffic', 'transit', 'surface damage', 'roadway']
      },
      {
        id: 'nit-electrical',
        departmentName: 'Electrical Engineering',
        universityId: 'nit-jamshedpur',
        universityName: 'National Institute of Technology (NIT) Jamshedpur',
        domains: ['Industrial Automation', 'Power System Protection', 'Substation Automation'],
        capabilities: ['Substation Automation', 'Protective Relaying', 'Fault Detection', 'Industrial Motor Drives'],
        skills: ['Relay Coordination', 'Fault Analysis', 'PLC Programming', 'Power Quality'],
        technologies: ['IEC 61850', 'Programmable Logic Controllers', 'Digital Fault Recorders'],
        keywords: ['substation', 'transformer fire', 'surge', 'relay', 'fault', 'breaker', 'line trip']
      },
      {
        id: 'nit-mechanical',
        departmentName: 'Mechanical Engineering',
        universityId: 'nit-jamshedpur',
        universityName: 'National Institute of Technology (NIT) Jamshedpur',
        domains: ['Heavy Equipment', 'Robotics & Automation', 'Thermal Systems', 'Fabrication'],
        capabilities: ['Mechanical Fabrication', 'Robotic Pipe Inspection', 'Heavy Machine Design', 'Hydraulic Actuation'],
        skills: ['SolidWorks 3D CAD', 'FEA Simulation', 'Rapid Prototyping', 'Welding & Metallurgy'],
        technologies: ['CNC Milling', 'Hydraulic Jacks', 'Crawler Robots', 'Structural Steel'],
        keywords: ['robot', 'mechanical', 'pipe cleaner', 'dredging robot', 'fabrication', 'crawler', 'tooling', 'machinery']
      }
    ]
  },
  {
    id: 'bau-ranchi',
    name: 'Birsa Agricultural University (BAU), Ranchi',
    shortName: 'BAU Ranchi',
    location: 'Kanke, Ranchi, Jharkhand',
    departments: [
      {
        id: 'bau-agri-eng',
        departmentName: 'Agricultural Engineering',
        universityId: 'bau-ranchi',
        universityName: 'Birsa Agricultural University (BAU), Ranchi',
        domains: ['Agricultural Automation', 'Farm Mechanization', 'Precision Irrigation', 'Solar Pumping'],
        capabilities: ['Farm Automation', 'Soil Moisture Automated Irrigation', 'Solar Powered Farm Machinery', 'Crop Harvesting Tools'],
        skills: ['Drip Irrigation Layout', 'Soil Moisture Sensor Integration', 'Smallholder Farm Mechanization', 'Renewable Irrigation'],
        technologies: ['Capacitive Soil Sensors', 'Solar Micro-Pumps', 'Automated Solenoid Valves', 'Micro-Drip Systems'],
        keywords: ['farm', 'irrigation', 'farmer', 'crop', 'soil moisture', 'watering', 'agriculture', 'harvest', 'paddy', 'solar pump', 'drip irrigation', 'fields', 'agrarian']
      },
      {
        id: 'bau-soil-water',
        departmentName: 'Soil & Water Engineering',
        universityId: 'bau-ranchi',
        universityName: 'Birsa Agricultural University (BAU), Ranchi',
        domains: ['Water Conservation', 'Soil Erosion', 'Embankment Protection', 'Watershed Management'],
        capabilities: ['Riverbank Soil Protection', 'Earthen Bund Stabilization', 'Rainwater Harvesting Structures', 'Watershed Check Dams'],
        skills: ['Soil Mechanical Testing', 'Bio-Geotextile Installation', 'Contour Bunding', 'Check Dam Hydrology'],
        technologies: ['Vetiver Bio-Engineering', 'Jute Geotextiles', 'Percolation Tanks', 'Gabion Structures'],
        keywords: ['erosion', 'soil erosion', 'riverbank', 'bund', 'embankment', 'wash away', 'river bank', 'soil conservation', 'check dam', 'watershed', 'earthen bund']
      },
      {
        id: 'bau-agronomy',
        departmentName: 'Agronomy',
        universityId: 'bau-ranchi',
        universityName: 'Birsa Agricultural University (BAU), Ranchi',
        domains: ['Sustainable Farming', 'Crop Health', 'Soil Fertility', 'Pest Management'],
        capabilities: ['Soil Nutrient Profiling', 'Organic Crop Protection', 'Drought-Resilient Seeds', 'Integrated Nutrient Management'],
        skills: ['Soil Sampling & NPK Testing', 'Crop Pathology', 'Weed Science', 'Agro-Meteorology'],
        technologies: ['Soil Health Testing Kits', 'Bio-Fertilizers', 'Weather Station Telemetry'],
        keywords: ['soil health', 'crop disease', 'fertilizer', 'drought', 'pest', 'seed', 'yield', 'organic', 'nutrients']
      },
      {
        id: 'bau-agri-sciences',
        departmentName: 'Agricultural Sciences',
        universityId: 'bau-ranchi',
        universityName: 'Birsa Agricultural University (BAU), Ranchi',
        domains: ['Plant Pathology', 'Bio-Technology', 'Post-Harvest Technology'],
        capabilities: ['Crop Pathology Diagnostics', 'Bio-Pesticide Formulation', 'Cold Storage Preservation', 'Mushroom & Agro-Processing'],
        skills: ['Microbiology', 'Tissue Culture', 'Food Processing Quality Check'],
        technologies: ['Solar Dryers', 'Hermetic Grain Bags', 'Incubation Chambers'],
        keywords: ['spoilage', 'storage', 'grain', 'post harvest', 'plant disease', 'fungal', 'cold storage']
      }
    ]
  }
];

export const ALL_DEPARTMENTS: DepartmentCapability[] = UNIVERSITIES.flatMap(u => u.departments);
