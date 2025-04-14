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
            const aTime = parseInt(a.cookTime.split(' ')[0]);
            const bTime = parseInt(b.cookTime.split(' ')[0]);
            return aTime - bTime;
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
      try {
        const allRecipes = await api.getAllRecipes()
        setRecipes(allRecipes)
        setDisplayedRecipes(allRecipes.slice(0, RECIPES_PER_PAGE))
        setHasMore(allRecipes.length > RECIPES_PER_PAGE)
      } catch (error) {
        console.error('Error loading recipes:', error)
        toast({
          title: "Error loading recipes",
          description: "There was a problem loading recipes. Please try again.",
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

  // Debounced filter and sort function
  const debouncedFilterAndSort = useCallback((
    selectedIngredients: string[], 
    filters: RecipeFilters, 
    sortBy: SortOption,
    allRecipes: Recipe[]
  ) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(true);
      try {
        // Start with all recipes
        let filteredRecipes = [...allRecipes];

        // Apply ingredient filtering only if ingredients are selected
        if (selectedIngredients.length > 0) {
          const ingredientsLower = selectedIngredients.map(i => i.toLowerCase());
          filteredRecipes = filteredRecipes.filter(recipe => {
            // Check if any of the selected ingredients are in the recipe's ingredients list
            return ingredientsLower.some(selectedIngredient => 
              recipe.ingredients.some(recipeIngredient => 
                recipeIngredient.toLowerCase().includes(selectedIngredient)
              )
            );
          });
        }

        // Apply additional filters
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
        
        // Sort recipes
        const sortedRecipes = sortRecipes(filteredRecipes, sortBy);
        
        setRecipes(sortedRecipes);
        setDisplayedRecipes(sortedRecipes.slice(0, RECIPES_PER_PAGE));
        setHasMore(sortedRecipes.length > RECIPES_PER_PAGE);
        setPage(1);
      } catch (error) {
        console.error('Error filtering recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }, 150); // Debounce delay
  }, [sortRecipes]);
    
  // Update recipes when filters or ingredients change
  useEffect(() => {
    const loadAndFilterRecipes = async () => {
      try {
        const allRecipes = await api.getAllRecipes();
        debouncedFilterAndSort(selectedIngredients, filters, sortBy, allRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };

    loadAndFilterRecipes();
  }, [selectedIngredients, filters, sortBy, debouncedFilterAndSort]);

  const handleFilterChange = (filterKey: keyof RecipeFilters, value: string | number) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  const handleIngredientClick = useCallback((ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  }, [selectedIngredients]);

  const handleRemoveIngredient = useCallback((ingredient: string) => {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient));
  }, []);

  const searchRecipes = async (ingredients: string[], filters: RecipeFilters) => {
    setIsLoading(true)
    try {
      console.log('Searching with ingredients:', ingredients)
      console.log('Filters:', filters)
      
      // If no ingredients are selected and no filters are applied, show no recipes
      if (ingredients.length === 0 && Object.keys(filters).length === 0) {
        setRecipes([])
        setDisplayedRecipes([])
        setHasMore(false)
        return
      }
      
      const matchedRecipes = await api.searchRecipes(ingredients, filters)
      console.log('Found recipes:', matchedRecipes.length)
      setRecipes(matchedRecipes)
      // Reset pagination and only show first page
      setPage(1)
      setDisplayedRecipes(matchedRecipes.slice(0, RECIPES_PER_PAGE))
      setHasMore(matchedRecipes.length > RECIPES_PER_PAGE)
    } catch (error) {
      console.error('Error finding recipes:', error)
      toast({
        title: "Error searching recipes",
        description: "There was a problem searching for recipes. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create a simple, direct function to handle recipe clicks
  const handleRecipeClick = useCallback((recipe: Recipe) => {
    console.log('Opening recipe:', recipe.name);
    setSelectedRecipe(recipe);
    onOpen();
  }, [onOpen]);

  // Debounced search term update
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(0);
    
    if (value.trim() !== '') {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle key press in search input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // Check if the search term matches an already selected ingredient
      const exactMatch = selectedIngredients.find(
        ingredient => ingredient.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactMatch) {
        // If it's an exact match, remove the ingredient
        handleRemoveIngredient(exactMatch);
        setSearchTerm('');
        setShowSuggestions(false);
        return;
      }
      
      // If suggestions are shown, select the highlighted suggestion
      if (showSuggestions && filteredIngredients.length > 0) {
        const selectedIngredient = filteredIngredients[highlightedIndex]
        if (selectedIngredient) {
          // Check if the ingredient is already selected
          const isAlreadySelected = selectedIngredients.some(
            selected => selected.toLowerCase() === selectedIngredient.toLowerCase()
          );
          
          if (isAlreadySelected) {
            // If it's already selected, remove it
            handleRemoveIngredient(selectedIngredient);
          } else {
            // If it's not selected, add it
            setSelectedIngredients(prev => [...prev, selectedIngredient]);
          }
          
          setSearchTerm('');
          setShowSuggestions(false);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < filteredIngredients.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Close suggestions when clicking outside
  useOutsideClick({
    ref: suggestionsRef as React.RefObject<HTMLElement>,
    handler: () => setShowSuggestions(false),
  })

  // Calculate ingredient match information for a recipe
  const getIngredientMatchInfo = (recipe: Recipe) => {
    try {
      const matchedIngredients = selectedIngredients.filter(selectedIngredient => 
        recipe.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(selectedIngredient.toLowerCase())
        )
      );
      
      const missingIngredients = recipe.ingredients.filter(recipeIngredient => 
        !selectedIngredients.some(selectedIngredient => 
          recipeIngredient.toLowerCase().includes(selectedIngredient.toLowerCase())
        )
      );
      
      const matchPercentage = selectedIngredients.length > 0 
        ? Math.round((matchedIngredients.length / selectedIngredients.length) * 100) 
        : 0;
      
      return {
        matchedCount: matchedIngredients.length,
        totalSelected: selectedIngredients.length,
        missingIngredients: missingIngredients.slice(0, 3),
        hasMoreMissing: missingIngredients.length > 3,
        matchPercentage
      };
    } catch (error) {
      console.error('Error calculating match info:', error);
      return {
        matchedCount: 0,
        totalSelected: selectedIngredients.length,
        missingIngredients: [],
        hasMoreMissing: false,
        matchPercentage: 0
      };
    }
  };

  // Load more recipes when "See more" is clicked
  const handleLoadMore = () => {
    const nextPage = page + 1
    const startIndex = (nextPage - 1) * RECIPES_PER_PAGE
    const endIndex = startIndex + RECIPES_PER_PAGE
    
    // Add the next page of recipes to the displayed recipes
    setDisplayedRecipes(prev => [...prev, ...recipes.slice(startIndex, endIndex)])
    setPage(nextPage)
    setHasMore(endIndex < recipes.length)
  }

  // Create a memoized sorted recipes array
  const sortedRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'difficulty') {
        type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
        const difficultyOrder: Record<DifficultyLevel, number> = {
          'Easy': 0,
          'Medium': 1,
          'Hard': 2
        };
        const aDifficulty = (a.difficulty || 'Easy') as DifficultyLevel;
        const bDifficulty = (b.difficulty || 'Easy') as DifficultyLevel;
        const aValue: number = difficultyOrder[aDifficulty];
        const bValue: number = difficultyOrder[bDifficulty];
        return aValue - bValue;
      } else if (sortBy === 'cookTime') {
        return (a.cookTime || 0) - (b.cookTime || 0);
      }
      return 0;
    });
  }, [recipes, sortBy]);

  // Memoize the recipe list rendering
  const RecipeList = useMemo(() => {
    // Don't show any recipes until ingredients are selected
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
            Choose ingredients from the list to see matching recipes
          </Text>
        </Box>
      );
    }

    if (isLoading && displayedRecipes.length === 0) {
      return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 4 }}>
          {[1, 2, 3].map((n) => (
            <Box key={n} borderWidth="1px" borderRadius="xl" overflow="hidden">
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

    return (
      <>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 4 }}>
          {displayedRecipes.map((recipe) => (
            <Box 
              key={recipe.id}
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
                  <Tag size="md" colorScheme="whiteAlpha" variant="solid">
                    {recipe.cookTime}
                  </Tag>
                </HStack>
              </Box>
              <Box p={4}>
                <Heading size="md" mb={2}>{recipe.name}</Heading>
                <HStack spacing={3} color="gray.600" fontSize="sm">
                  <Text>{recipe.ingredients.length} ingredients</Text>
                  <Text>•</Text>
                  <Text>Serves {recipe.servings}</Text>
                  {recipe.category && (
                    <>
                      <Text>•</Text>
                      <Text>{recipe.category}</Text>
                    </>
                  )}
                </HStack>
                
                {/* Ingredient Match Information */}
                {selectedIngredients.length > 0 && (
                  <Box mt={3} pt={3} borderTopWidth="1px" borderColor="gray.100">
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        Your Ingredients: {getIngredientMatchInfo(recipe).matchedCount}/{getIngredientMatchInfo(recipe).totalSelected}
                      </Text>
                      <Badge 
                        colorScheme={getIngredientMatchInfo(recipe).matchPercentage > 70 ? "green" : getIngredientMatchInfo(recipe).matchPercentage > 40 ? "yellow" : "red"}
                        fontSize="xs"
                      >
                        {getIngredientMatchInfo(recipe).matchPercentage}% match
                      </Badge>
                    </Flex>
                    <Progress 
                      value={getIngredientMatchInfo(recipe).matchPercentage} 
                      size="sm" 
                      colorScheme={getIngredientMatchInfo(recipe).matchPercentage > 70 ? "green" : getIngredientMatchInfo(recipe).matchPercentage > 40 ? "yellow" : "red"}
                      mb={2}
                    />
                    
                    {getIngredientMatchInfo(recipe).missingIngredients.length > 0 && (
                      <Box mt={2}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          You'll also need:
                        </Text>
                        <Wrap spacing={1}>
                          {getIngredientMatchInfo(recipe).missingIngredients.map((ingredient, index) => (
                            <WrapItem key={index}>
                              <Tag 
                                size="xs" 
                                colorScheme="gray" 
                                variant="outline"
                                borderRadius="md"
                                px={1}
                                py={0.5}
                                fontSize="10px"
                                whiteSpace="nowrap"
                                maxW="100px"
                                overflow="hidden"
                                textOverflow="ellipsis"
                              >
                                {ingredient.split(' ').slice(-2).join(' ')}
                              </Tag>
                            </WrapItem>
                          ))}
                          {getIngredientMatchInfo(recipe).hasMoreMissing && (
                            <WrapItem>
                              <Tag 
                                size="xs" 
                                colorScheme="gray" 
                                variant="outline"
                                borderRadius="md"
                                px={1}
                                py={0.5}
                                fontSize="10px"
                              >
                                +{recipe.ingredients.length - getIngredientMatchInfo(recipe).matchedCount - getIngredientMatchInfo(recipe).missingIngredients.length} more
                              </Tag>
                            </WrapItem>
                          )}
                        </Wrap>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
        
        {hasMore && (
          <Flex justify="center" mt={8}>
            <Button
              colorScheme="orange"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLoadMore();
              }}
              isLoading={isLoading}
              loadingText="Loading more recipes..."
              leftIcon={<AddIcon />}
              zIndex={5}
              position="relative"
            >
              See More Recipes
            </Button>
          </Flex>
        )}
      </>
    );
  }, [displayedRecipes, selectedIngredients, isLoading, hasMore, handleRecipeClick]);

  return (
    <VStack 
      spacing={6} 
      w="100%" 
      maxW="100%" 
      position="relative"
      px={0}
      overflowX="hidden"
    >
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
                      <WrapItem key={ingredient}>
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
                    <Accordion allowMultiple defaultIndex={[]} allowToggle className="custom-accordion">
                      {ingredientCategories.map((category, index) => (
                        <AccordionItem key={index} border="none" className="custom-accordion-item">
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