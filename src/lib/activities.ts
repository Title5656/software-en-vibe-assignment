export type ClubActivity = { id: string; date: string; title: string; clubId: string; startTime: string; endTime: string; location: string; description: string; preparation: string };
export function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function getWeekStart(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return shiftDate(date, -((day + 6) % 7));
}

export function getBangkokToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value).join("-");
}

const demoWeek: Omit<ClubActivity, "date">[] = [
  { id: "speaking-lab", title: "Find Your Voice Workshop", clubId: "speakers", startTime: "17:00", endTime: "18:30", location: "ICT Building, Auditorium", description: "Practice introductions, storytelling and short presentations in a friendly group. Beginners are welcome and everyone gets supportive feedback.", preparation: "Bring a notebook and prepare a one-minute introduction." },
  { id: "web-workshop", title: "Build Your First Website", clubId: "dev", startTime: "17:00", endTime: "19:00", location: "ICT Building, Lab 2", description: "Create a small personal website with HTML, CSS and JavaScript. Pair up with club members and share your finished page at the end.", preparation: "Bring a laptop with a browser and code editor installed." },
  { id: "ai-playground", title: "AI Playground", clubId: "ai", startTime: "17:00", endTime: "19:00", location: "ICT Building, Room 304", description: "Explore how machine learning works through small guided experiments. Try classifying data and discuss responsible uses of AI.", preparation: "Bring a laptop. No previous machine learning experience is needed." },
  { id: "iot-lab", title: "Smart Sensor Lab", clubId: "iot", startTime: "16:30", endTime: "18:30", location: "Maker Space, Floor 1", description: "Connect a sensor to a microcontroller and build a simple monitoring dashboard. Work in small teams with kits provided by the club.", preparation: "Bring a laptop and a USB cable. Sensor kits are provided." },
  { id: "cyber-ctf", title: "Cybersecurity Mini CTF", clubId: "cyber", startTime: "17:00", endTime: "19:00", location: "ICT Building, Room 210", description: "Solve beginner-friendly security puzzles in a supervised practice environment. Learn about safe passwords, web security and teamwork.", preparation: "Bring a laptop. All challenges use the club's demo environment." },
  { id: "badminton-social", title: "Weekend Badminton Social", clubId: "badminton", startTime: "10:00", endTime: "12:00", location: "MU Sports Complex, Court B", description: "Join warm-ups, friendly doubles and an introduction to basic techniques. Players of all experience levels can take part.", preparation: "Wear sports clothes and indoor shoes. Bring water and a racket if you have one." },
  { id: "board-game-afternoon", title: "Board Game Discovery", clubId: "board-game", startTime: "13:00", endTime: "16:00", location: "Student Lounge", description: "Discover strategy and party games with club members explaining the rules. Meet other students and try a new game together.", preparation: "No equipment needed. Games are provided; bring your curiosity." },
];

export function getDemoActivities(date: string): ClubActivity[] {
  const monday = getWeekStart(date);
  return demoWeek.map((activity, index) => ({ ...activity, date: shiftDate(monday, index) }));
}
