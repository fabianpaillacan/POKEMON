import { Link } from 'react-router-dom';
import { useEffect } from 'react';
function AnimatedParticles() {
  useEffect(() => {
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      o: Math.random() * 0.6 + 0.2 //0.3 0.1
    }));
    let animationId;
    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 8, 6 * Math.PI); //0 2 
        ctx.fillStyle = `rgba(5,0,247,${p.o})`; //168,85,247
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > window.innerWidth) p.dx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.dy *= -1;
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', resize);
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas id="particles-bg" className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
  );
}


function LandingPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 via-gray-500 to-green-950">
      <AnimatedParticles/>
      <Link 
        to="/pokegrid" 
        className="bg-white text-purple-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-900  hover:text-white transition-colors absolute z-10"
      >
        START
      </Link>
    </div>
  );
}

export default LandingPage;