import { useState, useEffect } from 'react';
import axios from 'axios';
import { transformData } from '../utils/transformData'; // Make sure you have the transformData function

/**
 * Custom hook for fetching disease data and transforming it.
 * @param {string} url - The API endpoint to fetch the data from.
 * @returns {Object} - An object containing chartData, diseaseName, error, and loading state.
 */
export const useDiseaseData = (url) => {
  const [chartData, setChartData] = useState(null);
  const [diseaseName, setDiseaseName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const { weekly_counts, disease_name } = response.data;
        const transformedData = transformData(weekly_counts);
        setChartData(transformedData);
        setDiseaseName(disease_name);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { chartData, diseaseName, error, loading };
};
