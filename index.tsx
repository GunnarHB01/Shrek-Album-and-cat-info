import { useEffect, useState } from 'react';

interface ShrekImage {
  url: string;
}

const fetchShrekImage = async (): Promise<ShrekImage> => {
  try {
    const response = await fetch('http://localhost:4000/shrek-image');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return { url: data.url };
  } catch (error) {
    console.error("Failed to fetch Shrek image through proxy:", error);
    throw error;
  }
};

const fetchCatFact = async (): Promise<string> => {
  try {
    const response = await fetch('https://catfact.ninja/fact');
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data.fact;
  } catch (error) {
    console.error("Failed to fetch cat fact:", error);
    return "Could not load cat fact. Please try again.";
  }
};

const Home = () => {
  const [images, setImages] = useState<ShrekImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFact, setLoadingFact] = useState(false);
  const [catFact, setCatFact] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const newImages = await Promise.all(Array.from({ length: 9 }, fetchShrekImage));
      setImages(newImages);
    } catch (error) {
      console.error("Error loading images:", error);
      alert("Failed to load Shrek images. Please try again later.");
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageClick = async (index: number) => {
    setActiveImageIndex(index);
    setLoadingFact(true);
    const fact = await fetchCatFact();
    setCatFact(fact);
    setLoadingFact(false);
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="container">
      <h1>Shrek Album</h1>
      {loadingImages ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-container"
              onClick={() => handleImageClick(index)}
            >
              <img src={image.url} alt={`Shrek ${index + 1}`} className="image" />
              {loadingFact && activeImageIndex === index && (
                <div className="overlay">Loading...</div>
              )}
              {catFact && activeImageIndex === index && !loadingFact && (
                <div className="overlay">{catFact}</div>
              )}
            </div>
          ))}
        </div>
      )}
      <button className="refetch-button" onClick={loadImages}>Refetch Images</button>
    </div>
  );
};

export default Home;