import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Badge,
  UnorderedList,
  ListItem,
  Box,
  Image,
  Grid,
  GridItem,
  Divider,
  Tag,
  List,
  Progress,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react'
import { Recipe } from '../types'
import { ClockIcon, UsersIcon } from './Icons'
import { useState, useEffect } from 'react'

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

const getDifficultyColor = (difficulty: string | undefined) => {
  if (!difficulty) return 'gray'
  
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'green'
    case 'medium':
      return 'yellow'
    case 'hard':
      return 'red'
    default:
      return 'gray'
  }
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const bgColor = useColorModeValue('white', 'gray.800')

  // Reset image loaded state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false)
    }
  }, [isOpen])

  if (!recipe) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent 
        maxW="900px" 
        w="100%" 
        mx={4}
        bg={bgColor}
        borderRadius="xl"
        overflow="hidden"
      >
        <ModalHeader p={6} borderBottomWidth="1px">
          <Text fontSize="2xl" fontWeight="bold">{recipe.name}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={6}
            w="100%"
          >
            <GridItem>
              <Box 
                position="relative" 
                borderRadius="lg" 
                overflow="hidden"
                bg="gray.100"
                height="300px"
              >
                {!imageLoaded && (
                  <Skeleton 
                    height="100%" 
                    width="100%" 
                    position="absolute" 
                    top={0} 
                    left={0} 
                  />
                )}
                <Image
                  src={recipe.image}
                  alt={recipe.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  onLoad={() => setImageLoaded(true)}
                  transition="opacity 0.3s ease-in-out"
                  opacity={imageLoaded ? 1 : 0}
                />
              </Box>
            </GridItem>
            <GridItem>
              <VStack align="stretch" spacing={4}>
                <HStack spacing={4}>
                  <Tag size="lg" colorScheme={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Tag>
                  <Tag size="lg" colorScheme="blue">
                    {recipe.cookTime}
                  </Tag>
                  <Tag size="lg" colorScheme="green">
                    Serves {recipe.servings}
                  </Tag>
                </HStack>
                <Box>
                  <Text fontWeight="bold" mb={2}>Ingredients:</Text>
                  <List spacing={2}>
                    {recipe.ingredients.map((ingredient, index) => (
                      <ListItem key={index}>
                        <Text>{ingredient}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </VStack>
            </GridItem>
            <GridItem gridColumn={{ base: '1', md: '1 / -1' }}>
              <Box>
                <Text fontWeight="bold" mb={2}>Instructions:</Text>
                <List spacing={3}>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem key={index}>
                      <Text>{instruction}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default RecipeModal 