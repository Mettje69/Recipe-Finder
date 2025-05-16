import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
  Container,
  FormErrorMessage,
  IconButton,
  HStack,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

interface Ingredient {
  id: string;
  text: string;
}

interface Instruction {
  id: string;
  text: string;
}

const AddRecipeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: '1', text: '' }]);
  const [instructions, setInstructions] = useState<Instruction[]>([{ id: '1', text: '' }]);
  const [cookTime, setCookTime] = useState(30);
  const [difficulty, setDifficulty] = useState('Medium');
  const [servings, setServings] = useState(4);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!description) newErrors.description = 'Description is required';
    if (ingredients.some(ing => !ing.text)) newErrors.ingredients = 'All ingredients must be filled';
    if (instructions.some(inst => !inst.text)) newErrors.instructions = 'All instructions must be filled';
    if (!category) newErrors.category = 'Category is required';
    if (cookTime < 0) newErrors.cookTime = 'Cook time must be positive';
    if (servings < 1) newErrors.servings = 'Servings must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };

  const handleIngredientChange = (id: string, value: string) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, text: value } : ing
    ));
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveInstruction = (id: string) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter(inst => inst.id !== id));
    }
  };

  const handleInstructionChange = (id: string, value: string) => {
    setInstructions(instructions.map(inst => 
      inst.id === id ? { ...inst, text: value } : inst
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('ingredients', JSON.stringify(ingredients.map(ing => ing.text)));
      formData.append('instructions', JSON.stringify(instructions.map(inst => inst.text)));
      formData.append('cookTime', cookTime.toString());
      formData.append('difficulty', difficulty);
      formData.append('servings', servings.toString());
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      toast({
        title: 'Recipe created!',
        description: "Your recipe has been shared successfully.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create recipe',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">Share Your Recipe</Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Recipe Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter recipe name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your recipe"
                  rows={3}
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.ingredients}>
                <FormLabel>Ingredients</FormLabel>
                <VStack spacing={2} align="stretch">
                  {ingredients.map((ingredient, index) => (
                    <HStack key={ingredient.id}>
                      <Input
                        value={ingredient.text}
                        onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      <IconButton
                        aria-label="Remove ingredient"
                        icon={<DeleteIcon />}
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                        isDisabled={ingredients.length === 1}
                      />
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddIngredient}
                    size="sm"
                    variant="outline"
                  >
                    Add Ingredient
                  </Button>
                </VStack>
                <FormErrorMessage>{errors.ingredients}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.instructions}>
                <FormLabel>Instructions</FormLabel>
                <VStack spacing={2} align="stretch">
                  {instructions.map((instruction, index) => (
                    <HStack key={instruction.id}>
                      <Text>{index + 1}.</Text>
                      <Textarea
                        value={instruction.text}
                        onChange={(e) => handleInstructionChange(instruction.id, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        rows={2}
                      />
                      <IconButton
                        aria-label="Remove instruction"
                        icon={<DeleteIcon />}
                        onClick={() => handleRemoveInstruction(instruction.id)}
                        isDisabled={instructions.length === 1}
                      />
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={handleAddInstruction}
                    size="sm"
                    variant="outline"
                  >
                    Add Step
                  </Button>
                </VStack>
                <FormErrorMessage>{errors.instructions}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.cookTime}>
                <FormLabel>Cook Time (minutes)</FormLabel>
                <NumberInput
                  value={cookTime}
                  onChange={(_, value) => setCookTime(value)}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.cookTime}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.difficulty}>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.servings}>
                <FormLabel>Servings</FormLabel>
                <NumberInput
                  value={servings}
                  onChange={(_, value) => setServings(value)}
                  min={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.servings}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.category}>
                <FormLabel>Category</FormLabel>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Italian, Dessert, Breakfast"
                />
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Recipe Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                width="100%"
                isLoading={isLoading}
                loadingText="Creating recipe..."
              >
                Share Recipe
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default AddRecipeForm; 