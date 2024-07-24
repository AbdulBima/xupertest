const axios = require('axios');
const NodeCache = require('node-cache');

// Create a cache instance with a default TTL (time-to-live) of 10 minutes
const cache = new NodeCache({ stdTTL: 600 }); // 600 seconds = 10 minutes

// Function to fetch additional book details from an external API based on ISBN
const fetchBookDetails = async (isbn) => {
  // Check if the data is in the cache
  const cachedData = cache.get(isbn);
  if (cachedData) {
    // Return cached data if available
    return cachedData;
  }

  try {
    // Make a GET request to the external book information API
    const response = await axios.get(`https://api.example.com/books/${isbn}`);
    // Store the response in the cache
    cache.set(isbn, response.data);
    // Return the data
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details');
  }
};

// Function to fetch the conversion rate between source and target currencies
const fetchConversionRate = async (fromCurrency, toCurrency) => {
  // Construct the cache key from source and target currencies
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  
  // Check if the rate is in the cache
  const cachedRate = cache.get(cacheKey);
  if (cachedRate) {
    return cachedRate;
  }

  try {
    // Make a GET request to the external currency conversion API
    const response = await axios.get(`https://api.example.com/convert?from=${fromCurrency}&to=${toCurrency}`);
    const rate = response.data.rate;
    
    // Store the rate in the cache
    cache.set(cacheKey, rate);
    
    // Return the conversion rate
    return rate;
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
    throw new Error('Failed to fetch conversion rate');
  }
};


module.exports = { fetchBookDetails, fetchConversionRate };
