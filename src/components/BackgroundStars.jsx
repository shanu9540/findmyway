import { useEffect, useState } from 'react';

function BackgroundStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate 40 stars with randomized styles
    const starList = Array.from({ length: 40 }).map((_, idx) => ({
      id: idx,
      size: Math.random() * 3 + 1, // 1px to 4px
      left: Math.random() * 100, // percentage
      top: Math.random() * 100, // percentage
      delay: Math.random() * 8, // seconds
      duration: Math.random() * 12 + 8, // seconds
    }));
    setStars(starList);
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <span
          key={star.id}
          className="star-particle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default BackgroundStars;
