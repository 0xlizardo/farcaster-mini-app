# FarFit - Farcaster Calorie Tracker

A beautiful and modern mini-app for Farcaster to track daily calories, activities, and water intake using Spoonacular API.

## Features

- Track daily calorie intake
- Log physical activities and calculate calories burned
- Beautiful pie chart visualization of daily calories
- Water intake tracking
- Responsive design

## Tech Stack

- React
- TypeScript
- Vite
- Recharts
- Spoonacular API

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
# Create .env file
VITE_SPOONACULAR_API_KEYS=your_api_key_here
```

   **Note:** You can get your API key from [Spoonacular API](https://spoonacular.com/food-api)
   - For multiple keys (to handle rate limits), separate them with commas: `key1,key2,key3`

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Testing

To test the application:

1. **Initial Setup:**
   - Enter your current weight (e.g., 75 kg)
   - Enter your target weight (e.g., 70 kg)
   - Select your goal (Lose/Gain/Maintain)

2. **Food Tracking:**
   - Use the food search to add foods
   - Select amount, unit, category, and meal type
   - View your daily calorie distribution

3. **Activity Tracking:**
   - Switch to "Activities" tab
   - Select an activity and duration
   - View calories burned

4. **Water Tracking:**
   - Click on water cups to track intake
   - Goal: 8 cups per day

5. **Data Persistence:**
   - All data is saved in localStorage
   - Refresh the page to verify data persists
   - Use "Reset Day" button to clear today's data

## Usage

1. Enter your current weight, target weight, and goal
2. Track your food intake using the food search
3. Log your physical activities
4. Monitor your daily calorie balance
5. Track your water intake

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add environment variable: `VITE_SPOONACULAR_API_KEYS=your_key_here`
4. Deploy!

### Deploy to GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```
2. Follow GitHub Pages deployment guide

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_SPOONACULAR_API_KEYS=your_api_key_here
```

For multiple API keys (to handle rate limits):
```
VITE_SPOONACULAR_API_KEYS=key1,key2,key3
```

## License

MIT
