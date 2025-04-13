import React, { useState, useEffect } from 'react';

const petImages = {
  common: {
    cat: '/assets/pets/common/cat.png',
    dog: '/assets/pets/common/dog.png',
    hamster: '/assets/pets/common/hamster.png'
  },
  rare: {
    dragon: '/assets/pets/rare/dragon.png',
    unicorn: '/assets/pets/rare/unicorn.png'
  },
  legendary: {
    alien: '/assets/pets/legendary/alien.png',
    cosmic: '/assets/pets/legendary/cosmic.png',
    robo: '/assets/pets/legendary/robo.png'
  }
};

export const useAssetLoader = () => {
  const [assets, setAssets] = useState({
    loaded: false,
    images: {}
  });

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = {};
      const promises = [];

      // Load all pet images
      for (const rarity in petImages) {
        loadedImages[rarity] = {};
        for (const pet in petImages[rarity]) {
          const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              loadedImages[rarity][pet] = img;
              resolve();
            };
            img.onerror = reject;
            img.src = petImages[rarity][pet];
          });
          promises.push(promise);
        }
      }

      try {
        await Promise.all(promises);
        setAssets({
          loaded: true,
          images: loadedImages
        });
      } catch (error) {
        console.error('Error loading assets:', error);
        setAssets(prev => ({
          ...prev,
          loaded: true,
          error: 'Failed to load some assets'
        }));
      }
    };

    loadImages();
  }, []);

  return assets;
};

const AssetLoader = ({ children }) => {
  const { loaded, error, images } = useAssetLoader();

  if (!loaded) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--background-color)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--card-bg)',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '1rem'
          }}>
            🎮
          </div>
          <div style={{
            color: 'var(--text-color)',
            marginBottom: '0.5rem'
          }}>
            Loading Pet Assets...
          </div>
          <div style={{
            width: '150px',
            height: '4px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '50%',
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              animation: 'loading 1s infinite linear'
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--error-bg)',
        color: 'var(--error-color)',
        borderRadius: '0.5rem',
        margin: '1rem'
      }}>
        Error: {error}
      </div>
    );
  }

  return children({ images });
};

export default AssetLoader;