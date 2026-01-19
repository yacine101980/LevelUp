import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenue sur LevelUp</h1>
      <p>
        Transformez vos rêves en réalité.
        Gérez vos objectifs, suivez vos habitudes et restez motivé.
      </p>
      
      <div style={{ marginTop: '30px' }}>
        {/* Lien vers la connexion */}
        <Link to="/login" style={{ marginRight: '20px' }}>
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Se connecter
          </button>
        </Link>

        {/* Lien vers l'inscription */}
        <Link to="/register">
          <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
            Créer un compte
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '50px', textAlign: 'left', maxWidth: '600px', margin: '50px auto' }}>
        <h3>Pourquoi utiliser cette app ?</h3>
        <ul>
          <li>🎯 <strong>Objectifs :</strong> Définissez et suivez vos projets personnels.</li>
          <li>📅 <strong>Habitudes :</strong> Créez des routines quotidiennes solides.</li>
          <li>🔥 <strong>Gamification :</strong> Gagnez des badges et visualisez vos "streaks".</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;