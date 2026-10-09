"use client";

import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

// High-fidelity Unsplash photography tailored for STEM & Creative Computing portfolios
const WORKS: WorksWheelItem[] = [
  {
    title: "AI Neural Chatbot",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    href: "#ai-chatbot",
  },
  {
    title: "Autonomous Mars Rover",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    href: "#mars-rover",
  },
  {
    title: "Quantum Cipher Engine",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    href: "#quantum-cipher",
  },
  {
    title: "Python 3D Game Engine",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    href: "#3d-game-engine",
  },
  {
    title: "Celestial Orbiter",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    href: "#celestial-orbiter",
  },
  {
    title: "Interactive Web Platform",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80",
    href: "#web-platform",
  },
  {
    title: "Micro:bit Smart Greenhouse",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    href: "#smart-greenhouse",
  },
  {
    title: "Robotics Motion Tracker",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    href: "#motion-tracker",
  },
  {
    title: "Algorithmic Music Synth",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    href: "#music-synth",
  },
];

export default function WorksWheelDemo() {
  return (
    <div className="bg-background text-foreground w-full h-[600px] rounded-2xl overflow-hidden border border-border shadow-card relative">
      <WorksWheel items={WORKS} label="Student Showcase '26" action="Explore Project" />
    </div>
  );
}
