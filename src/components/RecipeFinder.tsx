import { useState, useRef, KeyboardEvent, useCallback, useMemo, useEffect } from 'react'
import {
  Box,
  Grid,
  Input,
  VStack,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  CloseButton,
  Heading,
  SimpleGrid,
  Text,
  Image,
  useDisclosure,
  HStack,
  Select,
  Skeleton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  InputGroup,
  InputLeftElement,
  Divider,
  Badge,
  Progress,
  Tooltip,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  InputRightElement,
  useToast,
  Spinner,
  List,
  ListItem,
  useOutsideClick,
} from '@chakra-ui/react'
import { ingredientCategories } from '../data/ingredients'
import { Recipe, RecipeFilters, SortOption } from '../types'
import { findRecipesByIngredients } from '../data/recipes'
import RecipeModal from './RecipeModal'
import { FilterIcon } from './Icons'
import { SearchIcon, CheckIcon, WarningIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons'
import { api } from '../services/api'
import React from 'react'

const RecipeFinder = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [filters, setFilters] = useState<RecipeFilters>({})
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const RECIPES_PER_PAGE = 12
  const { isOpen, onOpen, onClose } = useDisclosure()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const searchTimeoutRef = useRef<number | null>(null)
  const filterTimeoutRef = useRef<number | null>(null)

  // Extract all ingredients from categories for search
  const allIngredients = useMemo(() => {
    return ingredientCategories.flatMap(category => category.ingredients)
  }, [])

  // Sort recipes with highest match percentage first
  const sortRecipes = (recipesToSort: Recipe[], sortBy: SortOption) => {
    try {
      return [...recipesToSort].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'cookTime':
            const parseTime = (time: string) => {
              const minutes = parseInt(time.split(' ')[0]);
              return isNaN(minutes) ? 0 : minutes;
            };
            return parseTime(a.cookTime) - parseTime(b.cookTime);
          case 'difficulty':
            const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                   difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
          case 'ingredients':
            return a.ingredients.length - b.ingredients.length;
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting recipes:', error);
      return recipesToSort;
    }
  };

  // Load initial recipes when component mounts
  useEffect(() => {
    const loadInitialRecipes = async () => {
      setIsLoading(true)
      console.log('RecipeFinder: Starting to load recipes...')
      try {
        console.log('RecipeFinder: Calling api.getAllRecipes()')
        const allRecipes = await api.getAllRecipes()
        console.log('RecipeFinder: Received recipes:', allRecipes)
        
        if (allRecipes && allRecipes.length > 0) {
          console.log('RecipeFinder: Setting recipes state with', allRecipes.length, 'recipes')
          setRecipes(allRecipes)
          // Display initial recipes
          setDisplayedRecipes(allRecipes.slice(0, RECIPES_PER_PAGE))
          setHasMore(allRecipes.length > RECIPES_PER_PAGE)
        } else {
          console.log('RecipeFinder: No recipes received from API')
          toast({
            title: "No recipes found",
            description: "There are no recipes available at the moment.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          })
        }
      } catch (error) {
        console.error('RecipeFinder: Error loading recipes:', error)
        toast({
          title: "Error loading recipes",
          description: error instanceof Error ? error.message : "There was a problem loading recipes. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialRecipes()
    
    // Focus the search input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [toast])

  // Add global keyboard event listener to capture all keyboard input
  useEffect(() => {
    const handleGlobalKeyDown = (e: Event) => {
      // Cast to KeyboardEvent with proper type handling
      const keyboardEvent = e as unknown as KeyboardEvent;
      
      // Ignore if already focused on an input or textarea
      if (keyboardEvent.target instanceof HTMLInputElement || keyboardEvent.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ignore special keys and shortcuts
      if (
        keyboardEvent.ctrlKey || 
        keyboardEvent.altKey || 
        keyboardEvent.metaKey || 
        keyboardEvent.key === 'Tab' || 
        keyboardEvent.key === 'Escape' || 
        keyboardEvent.key === 'F1' || 
        keyboardEvent.key === 'F2' || 
        keyboardEvent.key === 'F3' || 
        keyboardEvent.key === 'F4' || 
        keyboardEvent.key === 'F5' || 
        keyboardEvent.key === 'F6' || 
        keyboardEvent.key === 'F7' || 
        keyboardEvent.key === 'F8' || 
        keyboardEvent.key === 'F9' || 
        keyboardEvent.key === 'F10' || 
        keyboardEvent.key === 'F11' || 
        keyboardEvent.key === 'F12'
      ) {
        return;
      }
      
      // Focus the search input and append the pressed key
      if (inputRef.current) {
        // Focus the input
        inputRef.current.focus();
        
        // Only append printable characters
        if (keyboardEvent.key.length === 1) {
          // Prevent the default behavior to avoid duplicate input
          keyboardEvent.preventDefault();
          
          // Directly update the search term state
          setSearchTerm(prev => prev + keyboardEvent.key);
          
          // Show suggestions
          setShowSuggestions(true);
        }
      }
    };
    
    // Add event listener to the document
    document.addEventListener('keydown', handleGlobalKeyDown);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  // Memoize the filtered ingredients to prevent recalculation on every render
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const searchTermLower = searchTerm.toLowerCase();
    return allIngredients
      .filter(ingredient => 
        ingredient.toLowerCase().includes(searchTermLower)
      )
      .slice(0, 10);
  }, [allIngredients, searchTerm]);

  // Memoize the filtered and sorted recipes
  const filteredAndSortedRecipes = useMemo(() => {
    // Start with all recipes
    let filteredRecipes = [...recipes];

    // Apply ingredient filtering
    if (selectedIngredients.length > 0) {
      const ingredientsLower = selectedIngredients.map(i => i.toLowerCase());
      filteredRecipes = filteredRecipes.filter(recipe => {
        return ingredientsLower.some(selectedIngredient => 
          recipe.ingredients.some(recipeIngredient => 
            recipeIngredient.toLowerCase().includes(selectedIngredient)
          )
        );
      });
    }

    // Apply filters
    if (filters.difficulty) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.difficulty === filters.difficulty
      );
    }
    if (filters.category) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.category === filters.category
      );
    }
    if (filters.maxCookTime) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        const cookTime = parseInt(recipe.cookTime.split(' ')[0]);
        return !isNaN(cookTime) && cookTime <= filters.maxCookTime!;
      });
    }

    // Sort the recipes
    return sortRecipes(filteredRecipes, sortBy);
  }, [recipes, selectedIngredients, filters, sortBy, sortRecipes]);

  // Update displayed recipes when filters or pagination changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * RECIPES_PER_PAGE;
    const newDisplayedRecipes = filteredAndSortedRecipes.slice(startIndex, endIndex);
    setDisplayedRecipes(newDisplayedRecipes);
    setHasMore(endIndex < filteredAndSortedRecipes.length);
  }, [filteredAndSortedRecipes, page, RECIPES_PER_PAGE]);

  // Load more recipes when "See more" is clicked
  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedIngredients, filters, sortBy]);

  // Create a simple, direct function to handle recipe clicks
  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    onOpen();
  }, [onOpen]);

  // Handle search term changes
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(0);
    setShowSuggestions(value.trim() !== '');
  };

  // Handle key press in search input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && filteredIngredients.length > 0) {
        const selectedIngredient = filteredIngredients[highlightedIndex];
        if (selectedIngredient) {
          // Check if the ingredient is already selected
          const isSelected = selectedIngredients.some(
            selected => selected.toLowerCase() === selectedIngredient.toLowerCase()
          );
          
          if (isSelected) {
            // If already selected, remove it
            handleRemoveIngredient(selectedIngredient);
          } else {
            // If not selected, add it
            handleIngredientClick(selectedIngredient);
          }
          setSearchTerm('');
          setShowSuggestions(false);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => prev < filteredIngredients.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle ingredient selection
  const handleIngredientClick = useCallback((ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  }, [selectedIngredients]);

  // Handle ingredient removal
  const handleRemoveIngredient = useCallback((ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterKey: keyof RecipeFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  // Handle sort changes
  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  // Memoize the recipe list rendering
  const RecipeList = useMemo(() => {
    // Show loading state
    if (isLoading && displayedRecipes.length === 0) {
      return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 4 }}>
          {[1, 2, 3].map((n) => (
            <Box key={`skeleton-${n}`} borderWidth="1px" borderRadius="xl" overflow="hidden">
              <Skeleton height="200px" />
              <Box p={4}>
                <Skeleton height="20px" mb={2} />
                <Skeleton height="30px" width="100px" />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      );
    }

    // Show empty state when no ingredients are selected
    if (selectedIngredients.length === 0) {
      return (
        <Box 
          textAlign="center" 
          py={10}
          px={6}
          borderRadius="xl"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="orange.200"
          bg="orange.50"
        >
          <Text fontSize="xl" fontWeight="medium" mb={2}>Select Ingredients to Find Recipes</Text>
          <Text color="gray.600">
            Choose ingredients from the list to discover matching recipes
          </Text>
        </Box>
      );
    }

    // Show empty state when no recipes match the selected ingredients
    if (displayedRecipes.length === 0) {
      return (
        <Box 
          textAlign="center" 
          py={10}
          px={6}
          borderRadius="xl"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="orange.200"
          bg="orange.50"
        >
          <Text fontSize="xl" fontWeight="medium" mb={2}>No recipes found</Text>
          <Text color="gray.600">
            Try selecting different ingredients or adjusting the filters
          </Text>
        </Box>
      );
    }

    // Show recipes
    return (
      <>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 4 }}>
          {displayedRecipes.map((recipe) => (
            <Box 
              key={recipe.id || `recipe-${recipe.name}`}
              onClick={() => handleRecipeClick(recipe)}
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              w="100%"
              pr="0"
              bg="white"
              boxShadow="sm"
              position="relative"
              willChange="transform"
              transform="translateZ(0)"
              cursor="pointer"
            >
              <Box position="relative">
                <Image 
                  src={recipe.image} 
                  alt={recipe.name} 
                  height="200px" 
                  width="100%"
                  objectFit="cover"
                  loading="lazy"
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient="linear(to-t, blackAlpha.600, transparent)"
                />
                <HStack 
                  position="absolute" 
                  bottom={3} 
                  left={3} 
                  spacing={2}
                >
                  {recipe.difficulty && (
                    <Tag size="md" colorScheme={getDifficultyColor(recipe.difficulty)} variant="solid">
                      {recipe.difficulty}
                    </Tag>
                  )}
                  <Tag size="md" colorScheme="orange" variant="solid">
                    {recipe.cookTime}
                  </Tag>
                </HStack>
              </Box>
              <Box p={4}>
                <Heading size="md" mb={2} noOfLines={1}>
                  {recipe.name}
                </Heading>
                <Text color="gray.600" noOfLines={2}>
                  {recipe.description}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        {hasMore && (
          <Box textAlign="center" mt={8}>
            <Button
              onClick={handleLoadMore}
              colorScheme="orange"
              size="lg"
              isLoading={isLoading}
            >
              Load More Recipes
            </Button>
          </Box>
        )}
      </>
    );
  }, [displayedRecipes, isLoading, handleRecipeClick, hasMore, handleLoadMore]);

  // Add debug info panel
  const debugInfo = useMemo(() => {
    return {
      totalRecipes: recipes.length,
      displayedRecipes: displayedRecipes.length,
      isLoading,
      searchTerm,
      selectedIngredients: selectedIngredients.length,
      filters,
      sortBy,
      page,
      hasMore
    };
  }, [recipes.length, displayedRecipes.length, isLoading, searchTerm, selectedIngredients.length, filters, sortBy, page, hasMore]);

  return (
    <VStack spacing={6} align="stretch">
      {/* Minimalistic search bar */}
      <Box 
        w="100%" 
        position="relative" 
        mb={6}
        bg="white"
        p={{ base: 3, md: 4 }}
        borderRadius="xl"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="gray.200"
        _hover={{ borderColor: "orange.200", boxShadow: "md" }}
        transition="all 0.2s ease-in-out"
      >
        <InputGroup size="lg">
          <InputLeftElement 
            pointerEvents="none" 
            h="60px" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <SearchIcon color="orange.400" boxSize={5} />
          </InputLeftElement>
          <Input
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            onKeyDown={handleKeyPress}
            borderRadius="full"
            _focus={{ borderColor: 'orange.300', boxShadow: '0 0 0 1px orange.300' }}
            ref={inputRef}
            h="60px"
            fontSize="lg"
            bg="white"
            borderColor="gray.200"
            _hover={{ borderColor: 'orange.200' }}
            autoFocus
            pl="60px"
            tabIndex={0}
          />
        </InputGroup>
        
        {/* Autocomplete Suggestions */}
        {showSuggestions && filteredIngredients.length > 0 && (
          <Box 
            ref={suggestionsRef}
            position="absolute"
            top="100%"
            left={0}
            right={0}
            zIndex={10}
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            borderWidth="1px"
            borderColor="gray.200"
            maxH="300px"
            overflowY="auto"
            mt={2}
          >
            <List spacing={0}>
              {filteredIngredients.map((ingredient, index) => {
                // Check directly if this ingredient is already selected
                const isSelected = selectedIngredients.some(
                  selected => selected.toLowerCase() === ingredient.toLowerCase()
                );
                
                return (
                <ListItem 
                  key={ingredient}
                  px={4}
                  py={2}
                  cursor="pointer"
                  bg={index === highlightedIndex ? "orange.50" : "transparent"}
                  _hover={{ bg: "orange.50" }}
                  onClick={() => {
                    handleIngredientClick(ingredient)
                    setSearchTerm('')
                    setShowSuggestions(false)
                  }}
                >
                  <HStack>
                    <Text>{ingredient}</Text>
                    {index === highlightedIndex && (
                        <Badge 
                          colorScheme={isSelected ? "red" : "orange"} 
                          ml="auto"
                        >
                          {isSelected ? "DELETE" : "Press Enter"}
                        </Badge>
                    )}
                  </HStack>
                </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Box>

      <Grid 
        templateColumns={{ base: '1fr', md: '280px 1fr' }} 
        gap={{ base: 4, md: 4 }}
        w="100%" 
        maxW="100%"
        position="relative"
        overflowX="hidden"
      >
        <Box maxW={{ md: '280px' }} w="100%">
          <VStack align="stretch" gap={6} position="sticky" top="4">
            <Box bg="white" p={4} borderRadius="xl" boxShadow="sm" borderWidth="1px">
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>Selected Ingredients:</Text>
                {selectedIngredients.length > 0 ? (
                  <Wrap maxH="120px" overflowY="auto">
                    {selectedIngredients.map((ingredient) => (
                      <WrapItem key={`selected-${ingredient}`}>
                        <Tag 
                          size="lg" 
                          borderRadius="full" 
                          variant="solid" 
                          colorScheme="orange"
                          px={4}
                          py={2}
                          cursor="pointer"
                          onClick={() => handleRemoveIngredient(ingredient)}
                        >
                          <TagLabel>{ingredient}</TagLabel>
                          <CloseButton size="sm" onClick={() => handleRemoveIngredient(ingredient)} ml={2} />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    Select ingredients to find matching recipes
                  </Text>
                )}
              </Box>

              <Divider my={4} />

              <Box>
                <Text fontWeight="bold" mb={3}>Available Ingredients:</Text>
                {searchTerm ? (
                  filteredIngredients.length > 0 ? (
                    <Wrap maxH="300px" overflowY="auto">
                      {filteredIngredients.map((ingredient: string) => (
                        <WrapItem key={ingredient}>
                          <Tag
                            size="lg"
                            borderRadius="full"
                            variant="outline"
                            colorScheme="orange"
                            cursor="pointer"
                            _hover={{ bg: 'orange.50' }}
                            onClick={() => handleIngredientClick(ingredient)}
                            px={4}
                            py={2}
                          >
                            <TagLabel>{ingredient}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      No ingredients found matching "{searchTerm}"
                    </Text>
                  )
                ) : (
                  <Box maxH="300px" overflowY="auto">
                    <Accordion allowMultiple defaultIndex={[]} className="custom-accordion">
                      {ingredientCategories.map((category, index) => (
                        <AccordionItem key={`category-${category.name}-${index}`} border="none" className="custom-accordion-item">
                          <AccordionButton 
                            _hover={{ bg: 'orange.50' }}
                            _expanded={{ bg: 'orange.50', color: 'orange.500', fontWeight: 'semibold' }}
                            borderRadius="md"
                            p={3}
                            className="custom-accordion-button"
                          >
                            <HStack flex="1" spacing={3} align="center">
                              <Text fontSize="md" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxW="220px">
                                {category.name}
                              </Text>
                              <Badge colorScheme="orange" fontSize="xs" ml="auto">
                                {category.ingredients.length}
                              </Badge>
                            </HStack>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4} className="custom-accordion-panel">
                            <Wrap>
                              {category.ingredients.map((ingredient) => (
                                <WrapItem key={`ingredient-${category.name}-${ingredient}`}>
                                  <Tag
                                    size="lg"
                                    borderRadius="full"
                                    variant="outline"
                                    colorScheme="orange"
                                    cursor="pointer"
                                    _hover={{ bg: 'orange.50' }}
                                    onClick={() => handleIngredientClick(ingredient)}
                                    px={4}
                                    py={2}
                                  >
                                    <TagLabel>{ingredient}</TagLabel>
                                  </Tag>
                                </WrapItem>
                              ))}
                            </Wrap>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Box>
                )}
              </Box>
            </Box>

            <Box bg="white" p={4} borderRadius="xl" boxShadow="sm" borderWidth="1px">
              <HStack mb={3}>
                <FilterIcon />
                <Text fontWeight="bold">Filters & Sorting</Text>
              </HStack>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Difficulty Level</Text>
                  <Select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    bg="white"
                    size="lg"
                    _hover={{ borderColor: 'orange.300' }}
                  >
                    <option value="">Any difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Maximum Cooking Time</Text>
                  <Select
                    value={filters.maxCookTime}
                    onChange={(e) => handleFilterChange('maxCookTime', parseInt(e.target.value))}
                    bg="white"
                    size="lg"
                    _hover={{ borderColor: 'orange.300' }}
                  >
                    <option value="">Any duration</option>
                    <option value="15">15 minutes or less</option>
                    <option value="30">30 minutes or less</option>
                    <option value="45">45 minutes or less</option>
                    <option value="60">1 hour or less</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Sort Recipes By</Text>
                  <Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    bg="white"
                    size="lg"
                    _hover={{ borderColor: 'orange.300' }}
                  >
                    <option value="name">Name</option>
                    <option value="cookTime">Cooking Time</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="ingredients">Number of Ingredients</option>
                  </Select>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <Box flex="1" minW="0" w="100%" overflowX="hidden">
          <Box 
            bg="white" 
            p={{ base: 3, md: 4 }} 
            borderRadius="xl" 
            boxShadow="sm" 
            borderWidth="1px" 
            mb={6}
          >
            <HStack justify="space-between" mb={4}>
              <Heading size="lg">Recipes You Can Make</Heading>
              {recipes.length > 0 && (
                <Tag size="lg" colorScheme="orange" borderRadius="full" px={4}>
                  {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
                </Tag>
              )}
            </HStack>

            {RecipeList}
          </Box>
        </Box>
      </Grid>

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isOpen}
        onClose={onClose}
      />
    </VStack>
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

export default RecipeFinder 