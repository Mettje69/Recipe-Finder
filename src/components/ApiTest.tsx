import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, Heading, Spinner } from '@chakra-ui/react';
import { api } from '../services/api';

const ApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing API...');
      const result = await api.getAllRecipes();
      console.log('API result:', result);
      setData(result);
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <Heading size="md">API Test</Heading>
        <Button onClick={testApi} colorScheme="blue" isLoading={loading}>
          Test API
        </Button>
        
        {loading && <Spinner />}
        
        {error && (
          <Box p={4} bg="red.100" color="red.700" borderRadius="md">
            <Text fontWeight="bold">Error:</Text>
            <Text>{error}</Text>
          </Box>
        )}
        
        {data && (
          <Box p={4} bg="green.100" color="green.700" borderRadius="md">
            <Text fontWeight="bold">Success!</Text>
            <Text>Received {data.length} recipes</Text>
            <Text fontSize="sm" mt={2}>
              First recipe: {data[0]?.name || 'N/A'}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ApiTest; 