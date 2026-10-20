export type Club = {
  id: string;
  name: string;
  category: "Tech" | "Sport" | "Culture" | "Creative";
  tagline: string;
  description: string;
  meets: string;
  location: string;
  advisor: string;
  capacity: number;
  emoji: string;
};

export const clubs: Club[] = [
  { id: "ai", name: "AI Club", category: "Tech", emoji: "🧠", tagline: "Build intelligent systems together.", description: "Explore machine learning, deep learning and LLMs through study groups, Kaggle challenges and hands-on projects.", meets: "Wednesdays 17:00–19:00", location: "ICT Building, Room 304", advisor: "Dr. Somchai K.", capacity: 60 },
  { id: "dev", name: "Dev Club", category: "Tech", emoji: "💻", tagline: "Ship real software, fast.", description: "Web, mobile and backend development. Hackathons, code reviews and open‑source contributions every term.", meets: "Tuesdays 17:00–19:00", location: "ICT Building, Lab 2", advisor: "Dr. Nattapong S.", capacity: 80 },
  { id: "iot", name: "IoT Club", category: "Tech", emoji: "📡", tagline: "Connect the physical world.", description: "Microcontrollers, sensors and smart devices. Prototype with Arduino, ESP32 and Raspberry Pi.", meets: "Thursdays 16:30–18:30", location: "Maker Space, Floor 1", advisor: "Dr. Pimchanok R.", capacity: 40 },
  { id: "cyber", name: "Cyber Club", category: "Tech", emoji: "🛡️", tagline: "Defend, attack, learn.", description: "Capture‑the‑flag competitions, ethical hacking workshops and security research.", meets: "Fridays 17:00–19:00", location: "ICT Building, Room 210", advisor: "Dr. Anan T.", capacity: 50 },
  { id: "badminton", name: "Badminton", category: "Sport", emoji: "🏸", tagline: "Smash your way to fitness.", description: "Weekly practice for all levels plus friendly inter‑faculty tournaments.", meets: "Mondays 18:00–20:00", location: "MU Sports Complex, Court B", advisor: "Aj. Kittipong P.", capacity: 40 },
  { id: "table-tennis", name: "Table Tennis", category: "Sport", emoji: "🏓", tagline: "Fast reflexes, good vibes.", description: "Casual rallies and coached training sessions. Tables and paddles provided.", meets: "Wednesdays 18:00–20:00", location: "Student Center, Hall 2", advisor: "Aj. Wanida C.", capacity: 30 },
  { id: "japanese", name: "Japanese Society", category: "Culture", emoji: "🎌", tagline: "Language, culture and anime.", description: "Japanese language practice, cultural events, cooking days and anime nights.", meets: "Thursdays 17:00–19:00", location: "ICT Building, Room 105", advisor: "Aj. Yuki M.", capacity: 45 },
  { id: "board-game", name: "Board Game", category: "Culture", emoji: "🎲", tagline: "Strategy, laughs and snacks.", description: "From Catan to Gloomhaven — weekly game nights and a growing shared library.", meets: "Fridays 18:00–21:00", location: "Student Lounge", advisor: "Aj. Thanakorn L.", capacity: 35 },
  { id: "media", name: "Media and Entertainment", category: "Creative", emoji: "🎬", tagline: "Tell stories that move people.", description: "Photography, videography, editing and running MUICT's social channels and events.", meets: "Tuesdays 16:30–18:30", location: "Media Studio, Floor 3", advisor: "Aj. Supaporn N.", capacity: 40 },
  { id: "speakers", name: "Speakers", category: "Creative", emoji: "🎤", tagline: "Find your voice on stage.", description: "Public speaking, debate and presentation practice in a supportive community.", meets: "Mondays 17:00–18:30", location: "ICT Building, Auditorium", advisor: "Dr. Rattana V.", capacity: 30 },
];

export const getClub = (id: string) => clubs.find((c) => c.id === id);
