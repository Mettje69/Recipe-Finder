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
  Avatar,
  Portal
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { SearchIcon, StarIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons'

const Header = () => {
  const headerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('orange.100', 'gray.700')
  const titleColor = useColorModeValue('orange.500', 'orange.300')
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
    window.location.reload()
  }

  const handleRegister = () => {
    navigate('/register')
    window.location.reload()
  }

  return (
    <Box 
      bg={headerBg}
      borderBottom="1px"
      borderColor={borderColor}
      py={4}
      w="100%"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW="1280px" px={{ base: 3, md: 4 }} mx="auto">
        <Flex justify="space-between" align="center">
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<AddIcon />}
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
              <Icon as={AddIcon} w={5} h={5} color="white" />
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
                    <Avatar size="sm" name={user?.username} />
                  </MenuButton>
                  <Portal>
                    <MenuList zIndex={2000} position="relative">
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  colorScheme="orange"
                  size="md"
                  borderRadius="full"
                  variant="outline"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.2s ease-in-out"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  colorScheme="orange"
                  size="md"
                  borderRadius="full"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  transition="all 0.2s ease-in-out"
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default Header 