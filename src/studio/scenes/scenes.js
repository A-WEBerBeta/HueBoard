import scene1 from "../../assets/scenes/scene-1.jpg";
import scene2 from "../../assets/scenes/scene-2.jpg";
import scene3 from "../../assets/scenes/scene-3.jpg";
import scene4 from "../../assets/scenes/scene-4.jpg";
import scene5 from "../../assets/scenes/scene-5.jpg";
import scene6 from "../../assets/scenes/scene-6.jpg";

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
