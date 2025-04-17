import { 
  Box, 
  Heading, 
  Text, 
  HStack, 
  Icon, 
  Container, 
  Button, 
  Flex, 
  useColorModeValue, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Avatar 
} from '@chakra-ui/react'
import { SearchIcon, AddIcon, StarIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const headerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('orange.100', 'gray.700')
  const titleColor = useColorModeValue('orange.500', 'orange.300')
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <Box 
      bg={headerBg}
      borderBottom="1px"
      borderColor={borderColor}
      py={4}
      w="100%"
      overflowX="hidden"
      maxW="100%"
      pr="0"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        zIndex: 0
      }}
      boxShadow="sm"
    >
      <Container maxW="1280px" px={{ base: 3, md: 4 }} position="relative" zIndex={1}>
        <Flex justify="space-between" align="center">
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<StarIcon />}
            colorScheme="orange"
            size="md"
            borderRadius="full"
            variant="outline"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'md',
              borderColor: 'orange.400'
            }}
            transition="all 0.2s ease-in-out"
          >
            Home
          </Button>
          
          <HStack spacing={4} align="center">
            <Box
              bg="orange.500"
              p={2}
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="md"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: 'lg'
              }}
              transition="all 0.2s ease-in-out"
            >
              <Icon as={SearchIcon} w={5} h={5} color="white" />
            </Box>
            <Box>
              <Heading 
                size="lg" 
                color={titleColor}
                fontWeight="bold"
                letterSpacing="tight"
              >
                Recipe Finder
              </Heading>
            </Box>
          </HStack>
          
          <HStack spacing={4}>
            {isAuthenticated ? (
              <>
                <Button
                  as={RouterLink}
                  to="/add"
                  leftIcon={<AddIcon />}
                  colorScheme="orange"
                  size="md"
                  borderRadius="full"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Add Recipe
                </Button>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    colorScheme="orange"
                    size="md"
                    borderRadius="full"
                  >
                    <Avatar size="sm" name={user?.name} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="orange"
                size="md"
                borderRadius="full"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                transition="all 0.2s ease-in-out"
              >
                Register
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header 