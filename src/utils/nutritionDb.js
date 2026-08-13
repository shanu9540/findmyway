// Comprehensive lookup database for common Indian and international foods.
// Values are generally per standard unit (e.g., "1 Roti", "1 Egg", "1 Banana") or per 100g.

export const nutritionDb = {
  // Eggs & Dairy
  "egg": { name: "Egg (Large)", unit: "pcs", calories: 70, protein: 6.0, carbs: 0.6, fat: 5.0, fiber: 0.0, sugar: 0.0, sodium: 70, vitamins: "Vitamin D, B12, B6", minerals: "Selenium, Phosphorus, Iron", healthy: true, category: "dairy" },
  "egg white": { name: "Egg White", unit: "pcs", calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0.0, sugar: 0.0, sodium: 55, vitamins: "B-Vitamins", minerals: "Potassium, Sodium", healthy: true, category: "dairy" },
  "milk": { name: "Milk (1 Glass / 250ml)", unit: "glass", calories: 150, protein: 8.0, carbs: 12.0, fat: 8.0, fiber: 0.0, sugar: 12.0, sodium: 120, vitamins: "Vitamin D, B12, A", minerals: "Calcium, Phosphorus", healthy: true, category: "dairy" },
  "curd": { name: "Curd / Dahi (1 Cup / 150g)", unit: "cup", calories: 100, protein: 5.0, carbs: 6.0, fat: 6.0, fiber: 0.0, sugar: 6.0, sodium: 70, vitamins: "B12, Riboflavin", minerals: "Calcium, Phosphorus", healthy: true, category: "dairy" },
  "paneer": { name: "Paneer (100g)", unit: "g", calories: 265, protein: 18.0, carbs: 3.0, fat: 20.0, fiber: 0.0, sugar: 3.0, sodium: 18, vitamins: "Vitamin D, A", minerals: "Calcium, Phosphorus", healthy: true, category: "dairy" },
  "tofu": { name: "Tofu (100g)", unit: "g", calories: 80, protein: 8.0, carbs: 2.0, fat: 5.0, fiber: 1.0, sugar: 0.0, sodium: 7, vitamins: "B-Vitamins, Folate", minerals: "Calcium, Manganese, Iron", healthy: true, category: "dairy" },
  "butter": { name: "Butter (1 tsp / 5g)", unit: "tsp", calories: 36, protein: 0.05, carbs: 0.0, fat: 4.1, fiber: 0.0, sugar: 0.0, sodium: 40, vitamins: "Vitamin A, E", minerals: "Trace", healthy: false, category: "dairy" },
  "cheese": { name: "Cheese (1 Slice / 20g)", unit: "slice", calories: 80, protein: 5.0, carbs: 0.5, fat: 6.5, fiber: 0.0, sugar: 0.0, sodium: 180, vitamins: "Vitamin A, B12", minerals: "Calcium, Zinc", healthy: false, category: "dairy" },

  // Grains & Roti/Rice
  "roti": { name: "Whole Wheat Roti", unit: "pcs", calories: 85, protein: 3.0, carbs: 18.0, fat: 0.5, fiber: 2.5, sugar: 0.2, sodium: 120, vitamins: "B1, B3, B9", minerals: "Magnesium, Iron, Zinc", healthy: true, category: "grains" },
  "naan": { name: "Butter Naan", unit: "pcs", calories: 290, protein: 8.0, carbs: 48.0, fat: 9.0, fiber: 1.8, sugar: 3.0, sodium: 450, vitamins: "B-Vitamins", minerals: "Iron, Calcium", healthy: false, category: "grains" },
  "rice": { name: "Cooked Basmati Rice (1 Cup / 150g)", unit: "cup", calories: 200, protein: 4.2, carbs: 44.0, fat: 0.4, fiber: 1.0, sugar: 0.1, sodium: 5, vitamins: "B-Vitamins", minerals: "Selenium, Manganese", healthy: true, category: "grains" },
  "brown rice": { name: "Cooked Brown Rice (1 Cup / 150g)", unit: "cup", calories: 170, protein: 4.0, carbs: 36.0, fat: 1.2, fiber: 3.0, sugar: 0.0, sodium: 4, vitamins: "B1, B3, B6", minerals: "Magnesium, Phosphorus", healthy: true, category: "grains" },
  "oats": { name: "Oats (Raw, 40g)", unit: "serving", calories: 150, protein: 5.0, carbs: 27.0, fat: 2.5, fiber: 4.0, sugar: 0.5, sodium: 2, vitamins: "B1, B5, Folate", minerals: "Manganese, Phosphorus, Magnesium, Iron", healthy: true, category: "grains" },
  "bread": { name: "Whole Wheat Bread Slice", unit: "slice", calories: 75, protein: 3.5, carbs: 14.0, fat: 1.0, fiber: 2.0, sugar: 1.5, sodium: 130, vitamins: "B-Vitamins", minerals: "Selenium, Iron", healthy: true, category: "grains" },
  "white bread": { name: "White Bread Slice", unit: "slice", calories: 80, protein: 2.5, carbs: 15.0, fat: 1.0, fiber: 0.6, sugar: 1.5, sodium: 150, vitamins: "Trace", minerals: "Trace", healthy: false, category: "grains" },
  "quinoa": { name: "Cooked Quinoa (1 Cup / 150g)", unit: "cup", calories: 220, protein: 8.0, carbs: 39.0, fat: 3.6, fiber: 5.0, sugar: 1.5, sodium: 10, vitamins: "Vitamin E, B-Vitamins", minerals: "Manganese, Magnesium, Phosphorus, Folate", healthy: true, category: "grains" },

  // Poultry & Meats
  "chicken breast": { name: "Chicken Breast (100g, Raw)", unit: "g", calories: 110, protein: 23.0, carbs: 0.0, fat: 1.5, fiber: 0.0, sugar: 0.0, sodium: 75, vitamins: "B3, B6, B12", minerals: "Selenium, Phosphorus, Zinc", healthy: true, category: "meat" },
  "chicken curry": { name: "Chicken Curry (1 Serving / 200g)", unit: "serving", calories: 350, protein: 28.0, carbs: 8.0, fat: 18.0, fiber: 2.0, sugar: 2.0, sodium: 550, vitamins: "B-Vitamins", minerals: "Selenium, Iron, Zinc", healthy: true, category: "meat" },
  "fish": { name: "Fish / Salmon (100g)", unit: "g", calories: 180, protein: 22.0, carbs: 0.0, fat: 10.0, fiber: 0.0, sugar: 0.0, sodium: 60, vitamins: "Vitamin D, B12, B6", minerals: "Potassium, Selenium", healthy: true, category: "meat" },
  "mutton curry": { name: "Mutton Curry (1 Serving / 200g)", unit: "serving", calories: 420, protein: 24.0, carbs: 9.0, fat: 28.0, fiber: 2.0, sugar: 2.0, sodium: 620, vitamins: "B12, B3", minerals: "Iron, Zinc, Potassium", healthy: false, category: "meat" },

  // Lentils, Legumes & Soy
  "dal": { name: "Cooked Yellow Dal (1 Cup / 150g)", unit: "cup", calories: 150, protein: 8.0, carbs: 24.0, fat: 2.5, fiber: 6.0, sugar: 0.5, sodium: 320, vitamins: "Folate, B-Vitamins", minerals: "Iron, Potassium, Magnesium", healthy: true, category: "legumes" },
  "chana": { name: "Boiled Chickpeas/Chana (1 Cup / 150g)", unit: "cup", calories: 210, protein: 11.0, carbs: 35.0, fat: 3.0, fiber: 9.0, sugar: 4.0, sodium: 15, vitamins: "Folate, B6", minerals: "Iron, Magnesium, Potassium", healthy: true, category: "legumes" },
  "soya chunks": { name: "Soya Chunks (Raw, 50g)", unit: "serving", calories: 170, protein: 26.0, carbs: 16.0, fat: 0.4, fiber: 6.0, sugar: 3.0, sodium: 15, vitamins: "B-Vitamins, Folate", minerals: "Iron, Calcium, Magnesium", healthy: true, category: "legumes" },
  "rajma": { name: "Cooked Rajma (1 Cup / 150g)", unit: "cup", calories: 190, protein: 12.0, carbs: 32.0, fat: 1.0, fiber: 10.0, sugar: 1.5, sodium: 280, vitamins: "Folate, B1", minerals: "Iron, Potassium, Copper", healthy: true, category: "legumes" },

  // Fruits & Vegetables
  "banana": { name: "Banana (Medium)", unit: "pcs", calories: 105, protein: 1.3, carbs: 27.0, fat: 0.3, fiber: 3.1, sugar: 14.0, sodium: 1, vitamins: "Vitamin C, B6", minerals: "Potassium, Manganese", healthy: true, category: "fruits" },
  "apple": { name: "Apple (Medium)", unit: "pcs", calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, fiber: 4.4, sugar: 19.0, sodium: 2, vitamins: "Vitamin C", minerals: "Potassium", healthy: true, category: "fruits" },
  "orange": { name: "Orange (Medium)", unit: "pcs", calories: 60, protein: 1.2, carbs: 15.0, fat: 0.2, fiber: 3.0, sugar: 12.0, sodium: 0, vitamins: "Vitamin C, Folate", minerals: "Calcium, Potassium", healthy: true, category: "fruits" },
  "papaya": { name: "Papaya (1 Cup / 140g)", unit: "cup", calories: 55, protein: 0.6, carbs: 14.0, fat: 0.3, fiber: 2.5, sugar: 11.0, sodium: 3, vitamins: "Vitamin C, A, Folate", minerals: "Potassium, Calcium", healthy: true, category: "fruits" },
  "almonds": { name: "Almonds (10 pcs / 10g)", unit: "serving", calories: 60, protein: 2.1, carbs: 2.2, fat: 5.0, fiber: 1.2, sugar: 0.4, sodium: 1, vitamins: "Vitamin E, Riboflavin", minerals: "Magnesium, Manganese, Copper", healthy: true, category: "fruits" },
  "mixed salad": { name: "Cucumber Tomato Salad (1 Plate)", unit: "plate", calories: 40, protein: 1.5, carbs: 8.0, fat: 0.2, fiber: 3.0, sugar: 4.0, sodium: 15, vitamins: "Vitamin K, C, A", minerals: "Potassium", healthy: true, category: "vegetables" },
  "broccoli": { name: "Boiled Broccoli (1 Cup / 100g)", unit: "cup", calories: 35, protein: 2.8, carbs: 7.0, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 30, vitamins: "Vitamin C, K, Folate", minerals: "Potassium, Manganese", healthy: true, category: "vegetables" },
  "potato": { name: "Boiled Potato (Medium / 150g)", unit: "pcs", calories: 130, protein: 3.0, carbs: 29.0, fat: 0.2, fiber: 3.0, sugar: 1.2, sodium: 10, vitamins: "Vitamin C, B6", minerals: "Potassium, Manganese", healthy: true, category: "vegetables" },

  // Junk Food / Snacks / Indian Sweets
  "pizza": { name: "Pizza (1 Slice, Large)", unit: "slice", calories: 290, protein: 12.0, carbs: 32.0, fat: 12.0, fiber: 2.0, sugar: 3.8, sodium: 640, vitamins: "Calcium, Vitamin A", minerals: "Sodium, Selenium", healthy: false, category: "junk" },
  "burger": { name: "Veg Burger (Standard)", unit: "pcs", calories: 350, protein: 10.0, carbs: 45.0, fat: 14.0, fiber: 3.0, sugar: 6.0, sodium: 750, vitamins: "B-Vitamins", minerals: "Sodium, Calcium", healthy: false, category: "junk" },
  "samosa": { name: "Samosa (1 pc)", unit: "pcs", calories: 260, protein: 4.0, carbs: 32.0, fat: 13.0, fiber: 1.5, sugar: 1.0, sodium: 360, vitamins: "Trace", minerals: "Sodium", healthy: false, category: "junk" },
  "french fries": { name: "French Fries (Medium / 100g)", unit: "serving", calories: 312, protein: 3.4, carbs: 41.0, fat: 15.0, fiber: 3.8, sugar: 0.3, sodium: 210, vitamins: "Vitamin B6", minerals: "Potassium, Sodium", healthy: false, category: "junk" },
  "maggi": { name: "Maggi Noodles (1 Pack)", unit: "pack", calories: 310, protein: 7.0, carbs: 48.0, fat: 10.0, fiber: 2.0, sugar: 2.0, sodium: 900, vitamins: "Iron", minerals: "Sodium", healthy: false, category: "junk" },
  "coke": { name: "Coca Cola / Sugary Soda (330ml Can)", unit: "can", calories: 140, protein: 0.0, carbs: 39.0, fat: 0.0, fiber: 0.0, sugar: 39.0, sodium: 45, vitamins: "None", minerals: "Phosphorus", healthy: false, category: "junk" },
  "tea": { name: "Indian Chai with Milk & Sugar (1 Cup)", unit: "cup", calories: 90, protein: 2.0, carbs: 12.0, fat: 3.0, fiber: 0.0, sugar: 10.0, sodium: 25, vitamins: "None", minerals: "Potassium", healthy: false, category: "beverages" },
  "green tea": { name: "Green Tea (No Sugar)", unit: "cup", calories: 2, protein: 0.2, carbs: 0.0, fat: 0.0, fiber: 0.0, sugar: 0.0, sodium: 0, vitamins: "Antioxidants", minerals: "Fluoride", healthy: true, category: "beverages" },
  "coffee": { name: "Black Coffee (No Sugar)", unit: "cup", calories: 5, protein: 0.3, carbs: 0.0, fat: 0.0, fiber: 0.0, sugar: 0.0, sodium: 5, vitamins: "B2, B5", minerals: "Potassium, Magnesium", healthy: true, category: "beverages" },
  "whey protein": { name: "Whey Protein (1 Scoop / 30g)", unit: "scoop", calories: 120, protein: 25.0, carbs: 2.0, fat: 1.5, fiber: 0.0, sugar: 1.0, sodium: 50, vitamins: "B-Vitamins", minerals: "Calcium, Potassium", healthy: true, category: "supplement" }
};

// Fuzzy match database keys
export function findFoodKey(name) {
  const normalized = name.toLowerCase().trim();
  
  // Direct match
  if (nutritionDb[normalized]) return normalized;

  // Partial matchings
  const keys = Object.keys(nutritionDb);
  
  // Check if any key contains the input, or vice versa
  for (const key of keys) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return key;
    }
  }

  // Common plurals
  if (normalized.endsWith('s')) {
    const singular = normalized.slice(0, -1);
    if (nutritionDb[singular]) return singular;
  }
  
  // Specific aliases
  if (normalized.includes("egg") && normalized.includes("white")) return "egg white";
  if (normalized.includes("egg")) return "egg";
  if (normalized.includes("curd") || normalized.includes("dahi") || normalized.includes("yogurt")) return "curd";
  if (normalized.includes("paneer")) return "paneer";
  if (normalized.includes("milk")) return "milk";
  if (normalized.includes("roti") || normalized.includes("chapati") || normalized.includes("phulka")) return "roti";
  if (normalized.includes("rice")) return "rice";
  if (normalized.includes("oat")) return "oats";
  if (normalized.includes("chicken") && normalized.includes("breast")) return "chicken breast";
  if (normalized.includes("chicken")) return "chicken curry";
  if (normalized.includes("fish") || normalized.includes("salmon")) return "fish";
  if (normalized.includes("banana")) return "banana";
  if (normalized.includes("apple")) return "apple";
  if (normalized.includes("orange")) return "orange";
  if (normalized.includes("tea") && (normalized.includes("green") || normalized.includes("matcha"))) return "green tea";
  if (normalized.includes("tea")) return "tea";
  if (normalized.includes("coffee") && normalized.includes("black")) return "coffee";
  if (normalized.includes("protein") || normalized.includes("whey")) return "whey protein";
  if (normalized.includes("samosa")) return "samosa";
  if (normalized.includes("pizza")) return "pizza";

  return null;
}

// Parses a meal log string (e.g. "2 Eggs\n2 Roti\n1 Banana\n1 Glass Milk") and calculates nutrients.
export function parseAndCalculateMeal(mealText) {
  if (!mealText) return null;

  const lines = mealText.split(/\r?\n/);
  const items = [];
  
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalSodium = 0;
  
  const vitaminsList = new Set();
  const mineralsList = new Set();
  let healthyItemCount = 0;
  let unhealthyItemCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match numbers, decimals, or fractions, followed by letters
    // Examples: "2 Eggs", "1.5 Roti", "1/2 Banana", "100g Paneer", "1 scoop Whey"
    const match = trimmed.match(/^([\d\/\.\s-]+)?(?:g|scoop|scoops|glass|glasses|cup|cups|slice|slices|pcs|pc|plate|plates)?\s*(.+)$/i);
    
    let quantity = 1;
    let foodString = trimmed;

    if (match) {
      const qtyStr = match[1] ? match[1].trim() : "";
      const foodStr = match[2] ? match[2].trim() : "";

      if (qtyStr) {
        if (qtyStr.includes('/')) {
          const parts = qtyStr.split('/');
          if (parts.length === 2) {
            quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
          }
        } else if (qtyStr.includes('-')) {
          // Average of range
          const parts = qtyStr.split('-');
          quantity = (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
        } else {
          quantity = parseFloat(qtyStr);
        }
      }
      foodString = foodStr;
      
      // Handle weights like "100g Paneer" - if the line explicitly starts with "100g" (or similar weight)
      // and the unit is 'g', we treat quantity as weight/100 for foods defined per 100g
      const weightMatch = trimmed.match(/^(\d+)\s*g\s+(.+)$/i);
      if (weightMatch) {
        const weight = parseInt(weightMatch[1]);
        const foodName = weightMatch[2].trim();
        const key = findFoodKey(foodName);
        if (key && (key === "paneer" || key === "tofu" || key === "chicken breast" || key === "fish" || key === "french fries")) {
          quantity = weight / 100;
          foodString = foodName;
        }
      }
    }

    const key = findFoodKey(foodString);
    if (key) {
      const food = nutritionDb[key];
      const scaledCalories = Math.round(food.calories * quantity);
      const scaledProtein = parseFloat((food.protein * quantity).toFixed(1));
      const scaledCarbs = parseFloat((food.carbs * quantity).toFixed(1));
      const scaledFat = parseFloat((food.fat * quantity).toFixed(1));
      const scaledFiber = parseFloat((food.fiber * quantity).toFixed(1));
      const scaledSugar = parseFloat((food.sugar * quantity).toFixed(1));
      const scaledSodium = Math.round(food.sodium * quantity);

      totalCalories += scaledCalories;
      totalProtein += scaledProtein;
      totalCarbs += scaledCarbs;
      totalFat += scaledFat;
      totalFiber += scaledFiber;
      totalSugar += scaledSugar;
      totalSodium += scaledSodium;

      if (food.vitamins && food.vitamins !== "None" && food.vitamins !== "Trace") {
        food.vitamins.split(',').forEach(v => vitaminsList.add(v.trim()));
      }
      if (food.minerals && food.minerals !== "None" && food.minerals !== "Trace") {
        food.minerals.split(',').forEach(m => mineralsList.add(m.trim()));
      }

      if (food.healthy) {
        healthyItemCount++;
      } else {
        unhealthyItemCount++;
      }

      items.push({
        loggedName: trimmed,
        matchedName: food.name,
        quantity: quantity,
        calories: scaledCalories,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fat: scaledFat,
        healthy: food.healthy
      });
    } else {
      // Fallback/Estimator for unknown foods
      // Assigns conservative averages so it doesn't break
      const fallbackCalories = 150 * quantity;
      const fallbackProtein = 3 * quantity;
      const fallbackCarbs = 20 * quantity;
      const fallbackFat = 5 * quantity;
      
      totalCalories += fallbackCalories;
      totalProtein += fallbackProtein;
      totalCarbs += fallbackCarbs;
      totalFat += fallbackFat;

      items.push({
        loggedName: trimmed,
        matchedName: trimmed + " (Estimated)",
        quantity: quantity,
        calories: fallbackCalories,
        protein: fallbackProtein,
        carbs: fallbackCarbs,
        fat: fallbackFat,
        healthy: true
      });
    }
  }

  // Calculate meal score (out of 10)
  // Higher protein, fiber, lower sugar, healthy ingredients boost the score
  let rating = 7.0; // baseline
  if (totalProtein > 20) rating += 1.0;
  if (totalProtein > 35) rating += 1.0;
  if (totalFiber > 4) rating += 0.5;
  if (totalSugar > 15) rating -= 1.0;
  if (unhealthyItemCount > 0) rating -= 1.5;
  if (healthyItemCount > 2) rating += 1.0;
  
  rating = Math.max(1, Math.min(10, parseFloat(rating.toFixed(1))));

  return {
    rawText: mealText,
    items,
    calories: Math.round(totalCalories),
    protein: parseFloat(totalProtein.toFixed(1)),
    carbs: parseFloat(totalCarbs.toFixed(1)),
    fat: parseFloat(totalFat.toFixed(1)),
    fiber: parseFloat(totalFiber.toFixed(1)),
    sugar: parseFloat(totalSugar.toFixed(1)),
    sodium: Math.round(totalSodium),
    vitamins: Array.from(vitaminsList).slice(0, 4).join(', ') || "A, B-Vitamins",
    minerals: Array.from(mineralsList).slice(0, 4).join(', ') || "Calcium, Potassium, Iron",
    rating,
    healthy: unhealthyItemCount === 0 && healthyItemCount > 0
  };
}
