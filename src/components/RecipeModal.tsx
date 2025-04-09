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
  Divider,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react'
import { Recipe } from '../types'
import { ClockIcon, UsersIcon } from './Icons'
import { useState, useEffect } from 'react'

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [contentReady, setContentReady] = useState(false)
  
  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Set content ready after a short delay to ensure smooth transition
      const timer = setTimeout(() => {
        setContentReady(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setContentReady(false)
      setImageLoaded(false)
    }
  }, [isOpen])
  
  if (!recipe) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="xl" 
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent 
        maxW="800px" 
        maxH="90vh" 
        overflowY="auto"
        w="100%"
        transition="all 0.2s ease-in-out"
      >
        <ModalHeader>{recipe.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
            <Box 
              position="relative" 
              height="200px" 
              width="100%"
              overflow="hidden"
              borderRadius="md"
            >
              {!imageLoaded && (
                <Skeleton height="200px" width="100%" borderRadius="md" />
              )}
              <Image
                src={recipe.image}
                alt={recipe.name}
                borderRadius="md"
                objectFit="cover"
                height="200px"
                width="100%"
                onLoad={() => setImageLoaded(true)}
                style={{ 
                  display: imageLoaded ? 'block' : 'none',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
            </Box>
            <Box>
              <HStack spacing={4} mb={4}>
                <HStack>
                  <ClockIcon />
                  <Text>Cook: {recipe.cookTime}</Text>
                </HStack>
                <HStack>
                  <UsersIcon />
                  <Text>Serves: {recipe.servings}</Text>
                </HStack>
              </HStack>
              {recipe.difficulty && (
                <Badge colorScheme={getDifficultyColor(recipe.difficulty)} mb={4}>
                  {recipe.difficulty}
                </Badge>
              )}
            </Box>
          </Grid>

          <Divider my={4} />

          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={2}>Ingredients:</Text>
              <UnorderedList spacing={1}>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>{ingredient}</ListItem>
                ))}
              </UnorderedList>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Instructions:</Text>
              <Text>{recipe.instructions}</Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const getDifficultyColor = (difficulty: string) => {
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

export default RecipeModal 