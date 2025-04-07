import { Box, Heading, Text, HStack, Icon, Container, Button, Flex } from '@chakra-ui/react'
import { SearchIcon, AddIcon, StarIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" py={6} w="100%" overflowX="hidden" maxW="100%" pr="0">
      <Container maxW="1280px" px={{ base: 4, md: 6 }}>
        <Flex justify="space-between" align="center">
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<StarIcon />}
            colorScheme="orange"
            size="lg"
            borderRadius="full"
            variant="outline"
          >
            Home
          </Button>
          
          <HStack spacing={4} align="center">
            <Box
              bg="orange.500"
              p={3}
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={SearchIcon} w={8} h={8} color="white" />
            </Box>
            <Box>
              <Heading size="lg" color="gray.800">Recipe Finder</Heading>
              <Text color="gray.600" fontSize="sm">
                Find delicious recipes based on the ingredients you have
              </Text>
            </Box>
          </HStack>
          
          <Button
            as={RouterLink}
            to="/add"
            leftIcon={<AddIcon />}
            colorScheme="orange"
            size="lg"
            borderRadius="full"
          >
            Add Recipe
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header 