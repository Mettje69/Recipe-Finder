import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Heading,
  Text,
  HStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../services/api';
import { Recipe } from '../types';

const AddRecipeForm = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cookTime: '',
    difficulty: 'Easy',
    servings: 4,
    category: '',
    image: '',
  });

  const handleInputChange = (field: keyof Recipe, value: string | number) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => (i === index ? value : item)) || [],
    }));
  };

  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    setRecipe(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    setRecipe(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createRecipe(recipe as Omit<Recipe, 'id'>);
      toast({
        title: 'Recipe added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Reset form
      setRecipe({
        name: '',
        description: '',
        ingredients: [''],
        instructions: [''],
        cookTime: '',
        difficulty: 'Easy',
        servings: 4,
        category: '',
        image: '',
      });
    } catch (error) {
      toast({
        title: 'Error adding recipe',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <HStack mb={6} justify="space-between">
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          colorScheme="orange"
        >
          Back to Recipes
        </Button>
        <Heading>Add New Recipe</Heading>
        <Box w="100px" /> {/* Spacer for alignment */}
      </HStack>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Recipe Name</FormLabel>
            <Input
              value={recipe.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter recipe name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={recipe.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter recipe description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              value={recipe.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Select category"
            >
              <option value="Italian">Italian</option>
              <option value="Asian">Asian</option>
              <option value="Mexican">Mexican</option>
              <option value="American">American</option>
              <option value="Indian">Indian</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="Chinese">Chinese</option>
              <option value="Korean">Korean</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Dessert">Dessert</option>
              <option value="Quick">Quick</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Difficulty</FormLabel>
            <Select
              value={recipe.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cook Time (minutes)</FormLabel>
            <Input
              type="number"
              value={recipe.cookTime}
              onChange={(e) => handleInputChange('cookTime', e.target.value)}
              placeholder="Enter cook time in minutes"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Servings</FormLabel>
            <NumberInput
              value={recipe.servings}
              onChange={(value) => handleInputChange('servings', parseInt(value))}
              min={1}
              max={20}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Image URL</FormLabel>
            <Input
              value={recipe.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="Enter image URL"
            />
          </FormControl>

          <Box>
            <FormLabel>Ingredients</FormLabel>
            <VStack spacing={2} align="stretch">
              {recipe.ingredients?.map((ingredient, index) => (
                <HStack key={index}>
                  <Input
                    value={ingredient}
                    onChange={(e) => handleArrayInputChange('ingredients', index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  <IconButton
                    aria-label="Remove ingredient"
                    icon={<DeleteIcon />}
                    onClick={() => removeArrayItem('ingredients', index)}
                    isDisabled={recipe.ingredients?.length === 1}
                  />
                </HStack>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => addArrayItem('ingredients')}
                size="sm"
              >
                Add Ingredient
              </Button>
            </VStack>
          </Box>

          <Box>
            <FormLabel>Instructions</FormLabel>
            <VStack spacing={2} align="stretch">
              {recipe.instructions?.map((instruction, index) => (
                <HStack key={index}>
                  <Input
                    value={instruction}
                    onChange={(e) => handleArrayInputChange('instructions', index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                  />
                  <IconButton
                    aria-label="Remove instruction"
                    icon={<DeleteIcon />}
                    onClick={() => removeArrayItem('instructions', index)}
                    isDisabled={recipe.instructions?.length === 1}
                  />
                </HStack>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={() => addArrayItem('instructions')}
                size="sm"
              >
                Add Step
              </Button>
            </VStack>
          </Box>

          <Button
            type="submit"
            colorScheme="orange"
            isLoading={isSubmitting}
            loadingText="Adding recipe..."
            size="lg"
          >
            Add Recipe
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddRecipeForm; 