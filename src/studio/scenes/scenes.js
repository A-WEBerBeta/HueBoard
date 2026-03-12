import scene1 from "../../assets/scenes/scene-1.webp";
import scene2 from "../../assets/scenes/scene-2.webp";
import scene3 from "../../assets/scenes/scene-3.webp";
import scene4 from "../../assets/scenes/scene-4.webp";
import scene5 from "../../assets/scenes/scene-5.webp";
import scene6 from "../../assets/scenes/scene-6.webp";

export const SCENES = [
  { id: "scene-1", name: "Memphis", image: scene1 },
  { id: "scene-2", name: "Pop Gradient", image: scene2 },
  { id: "scene-3", name: "Yellow Pop", image: scene3 },
  { id: "scene-4", name: "Neon Shapes", image: scene4 },
  { id: "scene-5", name: "Retro Pink", image: scene5 },
  { id: "scene-6", name: "Pastel 3D", image: scene6 },
  {
    id: "dots",
    name: "Dot grid",
    type: "dots",
  },
  {
    id: "grid",
    name: "Grid",
    type: "grid",
  },
];

export function pickScene(id) {
  return SCENES.find((s) => s.id === id) || SCENES[0];
}

export function randomScene() {
  return SCENES[Math.floor(Math.random() * SCENES.length)];
}
