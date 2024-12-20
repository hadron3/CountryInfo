const express = require('express');
const axios = require('axios');
const router = express.Router();


// Get Available Countries
router.get('/available', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.BASE_URL_NAGER}/AvailableCountries`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch available countries' });
    }
});

// Get Country Info
router.get('/:countryCode', async (req, res) => {
    const { countryCode } = req.params;
    try {
        // Fetch data from different APIs
        const [nagerResponse, populationResponse, flagResponse] = await Promise.all([
            axios.get(`${process.env.BASE_URL_NAGER}/CountryInfo/${countryCode}`),
            axios.get(`${process.env.BASE_URL_COUNTRIESNOW}/countries/population`),
            axios.get(`${process.env.BASE_URL_COUNTRIESNOW}/countries/flag/images`)
        ]);

        // Extract data
        const borders = nagerResponse.data.borders || [];
        const populationData = populationResponse.data.data.find(
            (item) => item.country === nagerResponse.data.commonName
        );
        const flagData = flagResponse.data.data.find(
            (item) => item.name === nagerResponse.data.commonName
        );

        // Construct response
        const countryInfo = {
            borders,
            population: populationData?.populationCounts || [],
            flagUrl: flagData?.flag || '',
        };

        res.json(countryInfo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch country info' });
    }
});

module.exports = router;
