import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
      <Link 
        to="/pokegrid" 
        className="bg-white text-purple-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-purple-100 transition-colors"
      >
        START
      </Link>
    </div>
  );
}

export default LandingPage;