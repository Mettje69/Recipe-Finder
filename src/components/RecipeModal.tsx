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
} from '@chakra-ui/react'
import { Recipe } from '../types'
import { ClockIcon, UsersIcon } from './Icons'
import { useState } from 'react'

interface RecipeModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  if (!recipe) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="800px" maxH="90vh" overflowY="auto">
        <ModalHeader>{recipe.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={4}>
            <Box position="relative" height="200px" width="100%">
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
                style={{ display: imageLoaded ? 'block' : 'none' }}
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