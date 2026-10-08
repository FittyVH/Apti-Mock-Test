const axios = require('axios');
const cheerio = require('cheerio');

exports.fetchLiveQuestions = async (topic, count = 10) => {
  // Mock live data fallback (Replace with live site cheerio/puppeteer scrapers as needed)
  const mockDatabase = [
    {
      id: 'q1',
      questionText: 'A train 240 m long passes a pole in 24 seconds. What is the speed of the train in km/hr?',
      options: [
        { key: 'A', text: '30 km/hr' },
        { key: 'B', text: '36 km/hr' },
        { key: 'C', text: '40 km/hr' },
        { key: 'D', text: '10 km/hr' }
      ],
      correctOption: 'B'
    },
    {
      id: 'q2',
      questionText: 'If 12 men or 18 women can do a piece of work in 14 days, how long will 8 men and 16 women take to finish it?',
      options: [
        { key: 'A', text: '8 days' },
        { key: 'B', text: '9 days' },
        { key: 'C', text: '10 days' },
        { key: 'D', text: '12 days' }
      ],
      correctOption: 'B'
    }
  ];

  return mockDatabase.slice(0, count);
};