// Add these functions to your existing helper.js or helper.ts file

/**
 * Shuffle an array using the Fisher-Yates algorithm seeded with the current date
 * This ensures the same shuffle pattern for a given day
 */
function dailyShuffle<T>(array: T[]): T[] {
  // Clone the array to avoid mutating the original
  const shuffled = [...array];
  
  // Create a seed based on the current date (year, month, day)
  const date = new Date();
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  
  // Simple seeded random function
  const seededRandom = () => {
    // Using a simple linear congruential generator with the date seed
    let x = seed;
    return () => {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  };
  
  const random = seededRandom();
  
  // Fisher-Yates shuffle algorithm with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Fetch women's aesthetics data
 */
export async function getWomenAesthetics() {
  // This is a placeholder - replace with your actual data fetching logic
  // You could fetch this from an API or database
  
  // Data based on your file structure
  const aesthetics = [
    {
      id: "90s-cool-girl",
      title: "90s Cool Girl",
      coverImage: "/aesthetics/women/90s-cool-girl.jpg",
      link: "/aesthetics/women/90s-cool-girl"
    },
    {
      id: "barbie",
      title: "Barbie",
      coverImage: "/aesthetics/women/Barbie.jpg",
      link: "/aesthetics/women/barbie"
    },
    {
      id: "beach-babe",
      title: "Beach Babe",
      coverImage: "/aesthetics/women/beach-babe.jpg",
      link: "/aesthetics/women/beach-babe"
    },
    {
      id: "corporate-girlie",
      title: "Corporate Girlie",
      coverImage: "/aesthetics/women/corporate-girlie.jpg",
      link: "/aesthetics/women/corporate-girlie"
    },
    {
      id: "edgy-streetwear",
      title: "Edgy Streetwear",
      coverImage: "/aesthetics/women/edgy-streetwear.jpg",
      link: "/aesthetics/women/edgy-streetwear"
    },
    {
      id: "frazzled-english",
      title: "Frazzled English",
      coverImage: "/aesthetics/women/frazzled-english.jpg",
      link: "/aesthetics/women/frazzled-english"
    },
    {
      id: "glam-night-out",
      title: "Glam Night Out",
      coverImage: "/aesthetics/women/Glam-Night-Out.jpg",
      link: "/aesthetics/women/glam-night-out"
    },
    {
      id: "white-sundress",
      title: "White Sundress",
      coverImage: "/aesthetics/women/white-sundress.jpg",
      link: "/aesthetics/women/white-sundress"
    }
  ];
  
  // Shuffle the aesthetics with a daily seed
  return dailyShuffle(aesthetics);
}

/**
 * Fetch men's aesthetics data
 */
export async function getMenAesthetics() {
  // This is a placeholder - replace with your actual data fetching logic
  // You could fetch this from an API or database
  
  // Data based on your file structure
  const aesthetics = [
    {
      id: "coastal-casual",
      title: "Coastal Casual",
      coverImage: "/aesthetics/men/Coastal-casual.jpg",
      link: "/aesthetics/men/coastal-casual"
    },
    {
      id: "corporate-streetware",
      title: "Corporate Streetwear",
      coverImage: "/aesthetics/men/Corperate-streetware.jpg",
      link: "/aesthetics/men/corporate-streetware"
    },
    {
      id: "gym-bro",
      title: "Gym Bro",
      coverImage: "/aesthetics/men/gym-bro.jpg",
      link: "/aesthetics/men/gym-bro"
    },
    {
      id: "jocks",
      title: "Jocks",
      coverImage: "/aesthetics/men/Jocks.jpg",
      link: "/aesthetics/men/jocks"
    },
    {
      id: "neo-dandyism",
      title: "Neo-Dandyism",
      coverImage: "/aesthetics/men/Neo-Dandyism.jpg",
      link: "/aesthetics/men/neo-dandyism"
    },
    {
      id: "old-money",
      title: "Old Money",
      coverImage: "/aesthetics/men/Old-Money.jpg",
      link: "/aesthetics/men/old-money"
    },
    {
      id: "skatecore",
      title: "Skatecore",
      coverImage: "/aesthetics/men/Skatecore.jpg",
      link: "/aesthetics/men/skatecore"
    },
    {
      id: "street-goth",
      title: "Street Goth",
      coverImage: "/aesthetics/men/Street-Goth.jpg",
      link: "/aesthetics/men/street-goth"
    },
    {
      id: "techwear-minimalism",
      title: "Techwear Minimalism",
      coverImage: "/aesthetics/men/Techwear-Minimalism.jpg",
      link: "/aesthetics/men/techwear-minimalism"
    },
    {
      id: "y2k-grunge",
      title: "Y2K Grunge",
      coverImage: "/aesthetics/men/Y2K-Grunge.jpg",
      link: "/aesthetics/men/y2k-grunge"
    }
  ];
  
  // Shuffle the aesthetics with a daily seed
  return dailyShuffle(aesthetics);
}