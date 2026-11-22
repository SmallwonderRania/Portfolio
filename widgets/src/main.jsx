import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CircularCarousel from './CircularCarousel.jsx';
import DomeGallery from './DomeGallery.jsx';
import './widgets.css';

/* ---------- Key Achievements: real photos, full image visible ---------- */
const ACHIEVEMENTS = [
  { src: 'assets/achievements/mask-of-logic.jpg', alt: 'Rania holding the Mask of Logic trophy and her merit certificate', title: 'Mask of Logic — 2nd Place', subtitle: 'Vencer 2K24 · National Codathon' },
  { src: 'assets/achievements/irjmets.jpg', alt: 'IRJMETS certificate of publication for Rania Jamadar', title: 'Published in IRJMETS', subtitle: 'VIBE · Impact Factor 8.187 · Jan 2026' },
  { src: 'assets/achievements/trophy-certificates.jpg', alt: 'Vencer 2K24 trophy and winners\u2019 certificates on the grass', title: 'Trophy & Merit Certificates', subtitle: 'Team of four · AITM, Vencer 2K24' },
  { src: 'assets/achievements/vaividhyam.jpg', alt: 'Vaividhyam 2.0 event board with the team at KLE Tech', title: 'Vaividhyam 2.0 — Innovation Track', subtitle: 'KLE Tech × IEEE Bangalore · Oct 2024' },
  { src: 'assets/achievements/felicitation.jpg', alt: 'Award felicitation with department faculty', title: 'Award Felicitation', subtitle: 'Mask of Logic · 2nd Place' },
  { src: 'assets/achievements/vibe-team.jpg', alt: 'Project VIBE team in front of the AI & Data Science board', title: 'Project VIBE Team', subtitle: 'AI & Data Science Department' },
  { src: 'assets/achievements/graduation.jpg', alt: 'Rania in graduation gown with thumbs up', title: 'B.E. in AI & Data Science', subtitle: 'SGBIT · Graduated 15 May 2026' }
];

function useWidth() {
  const [w, setW] = useState(typeof window === 'undefined' ? 1200 : window.innerWidth);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

function Achievements() {
  const w = useWidth();
  const cardWidth = w < 520 ? 200 : w < 900 ? 260 : 340;
  return (
    <div className="ach-carousel" style={{ height: cardWidth + 170 }}>
      <CircularCarousel
        items={ACHIEVEMENTS}
        preset="cylinder"
        intro="rise"
        cardWidth={cardWidth}
        aspectRatio={1}
        gap={w < 520 ? 14 : 26}
        captions
        autoplay="drift"
        speed={9}
        draggable
        snap
        pauseOnHover
        focusOnClick
        depthFade={0.3}
        fadeColor="#f4f4f4"
        innerShade={0}
        cornerRadius={4}
      />
    </div>
  );
}

/* ---------- Tech tools: real logos on tiles ---------- */
const TECH = [
  ['python', 'Python'], ['tensorflow', 'TensorFlow'], ['pytorch', 'PyTorch'], ['keras', 'Keras'],
  ['scikit-learn', 'scikit-learn'], ['opencv', 'OpenCV'], ['numpy', 'NumPy'], ['pandas', 'Pandas'],
  ['jupyter', 'Jupyter'], ['matplotlib', 'Matplotlib'], ['react', 'React'], ['typescript', 'TypeScript'],
  ['javascript', 'JavaScript'], ['nodejs', 'Node.js'], ['express', 'Express'], ['flask', 'Flask'],
  ['socketio', 'Socket.IO'], ['tailwindcss', 'Tailwind CSS'], ['vite', 'Vite'], ['html5', 'HTML5'],
  ['css3', 'CSS3'], ['mysql', 'SQL'], ['git', 'Git'], ['github', 'GitHub']
].map(([slug, alt]) => ({ src: `assets/tech/${slug}.svg`, alt }));

function Tools() {
  const w = useWidth();
  return (
    <div className="dome-wrap">
      <DomeGallery
        images={TECH}
        grayscale={false}
        overlayBlurColor="#1d1d1d"
        fit={w < 700 ? 0.9 : 0.75}
        minRadius={w < 700 ? 420 : 600}
        segments={w < 700 ? 24 : 35}
        imageBorderRadius="14px"
        openedImageBorderRadius="18px"
        openedImageWidth={w < 700 ? '260px' : '380px'}
        openedImageHeight={w < 700 ? '260px' : '380px'}
        dragSensitivity={w < 700 ? 24 : 20}
      />
    </div>
  );
}

const mount = (id, Comp) => {
  const el = document.getElementById(id);
  if (el) createRoot(el).render(<Comp />);
};
mount('achievements-carousel', Achievements);
mount('tech-dome', Tools);
