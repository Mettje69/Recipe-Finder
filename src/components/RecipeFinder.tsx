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
import { Recipe, RecipeFilters } from '../types'
import { findRecipesByIngredients } from '../data/recipes'
import RecipeModal from './RecipeModal'
import { FilterIcon } from './Icons'
import { SearchIcon, CheckIcon, WarningIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons'
import { api } from '../services/api'

type SortOption = 'name' | 'cookTime' | 'difficulty' | 'ingredients'

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
  const [hasMore, setHasMore] = useState(false)
  const RECIPES_PER_PAGE = 12
  const { isOpen, onOpen, onClose } = useDisclosure()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const searchTimeoutRef = useRef<number | null>(null)

  // Extract all ingredients from categories for search
  const allIngredients = useMemo(() => {
    return ingredientCategories.flatMap(category => category.ingredients)
  }, [])

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
  }, [toast])

  // Filter and sort recipes when selected ingredients, filters, or sort option changes
  useEffect(() => {
    const filterAndSortRecipes = async () => {
      setIsLoading(true)
      try {
        let filteredRecipes: Recipe[] = []
        
        if (selectedIngredients.length > 0) {
          // Use our new findRecipesByIngredients function
          filteredRecipes = findRecipesByIngredients(selectedIngredients)
          
          // Apply additional filters
          if (filters.difficulty) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === filters.difficulty)
          }
          
          if (filters.category) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === filters.category)
          }
          
          if (filters.maxCookTime) {
            filteredRecipes = filteredRecipes.filter(recipe => {
              const cookTime = parseInt(recipe.cookTime.split(' ')[0])
              return !isNaN(cookTime) && cookTime <= filters.maxCookTime!
            })
          }
          
          if (filters.minServings) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.servings >= filters.minServings!)
          }
          
          if (filters.maxServings) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.servings <= filters.maxServings!)
          }
        } else {
          // If no ingredients selected, show all recipes with filters applied
          filteredRecipes = recipes
          
          if (filters.difficulty) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === filters.difficulty)
          }
          
          if (filters.category) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === filters.category)
          }
          
          if (filters.maxCookTime) {
            filteredRecipes = filteredRecipes.filter(recipe => {
              const cookTime = parseInt(recipe.cookTime.split(' ')[0])
              return !isNaN(cookTime) && cookTime <= filters.maxCookTime!
            })
          }
          
          if (filters.minServings) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.servings >= filters.minServings!)
          }
          
          if (filters.maxServings) {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.servings <= filters.maxServings!)
          }
        }
        
        // Sort recipes
        switch (sortBy) {
          case 'name':
            filteredRecipes.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'cookTime':
            filteredRecipes.sort((a, b) => {
              const timeA = parseInt(a.cookTime.split(' ')[0])
              const timeB = parseInt(b.cookTime.split(' ')[0])
              return timeA - timeB
            })
            break
          case 'difficulty':
            const difficultyOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2 }
            filteredRecipes.sort((a, b) => {
              const diffA = difficultyOrder[a.difficulty || 'Medium']
              const diffB = difficultyOrder[b.difficulty || 'Medium']
              return diffA - diffB
            })
            break
          case 'ingredients':
            filteredRecipes.sort((a, b) => a.ingredients.length - b.ingredients.length)
            break
        }
        
        // Update displayed recipes with pagination
        setDisplayedRecipes(filteredRecipes.slice(0, page * RECIPES_PER_PAGE))
        setHasMore(filteredRecipes.length > page * RECIPES_PER_PAGE)
      } catch (error) {
        console.error('Error filtering recipes:', error)
        toast({
          title: "Error filtering recipes",
          description: "There was a problem filtering recipes. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    filterAndSortRecipes()
  }, [selectedIngredients, filters, sortBy, recipes, page, toast])

  // Add global keyboard event listener to focus input when any key is pressed
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Ignore if already focused or if it's a special key combination
      if (document.activeElement === inputRef.current || 
          e.ctrlKey || e.altKey || e.metaKey || 
          e.key === 'Tab' || e.key === 'Escape') {
        return;
      }
      
      // Focus the input when any regular key is pressed
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleIngredientClick = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      const newIngredients = [...selectedIngredients, ingredient]
      setSelectedIngredients(newIngredients)
      searchRecipes(newIngredients, filters)
    }
  }

  const handleRemoveIngredient = (ingredient: string) => {
    const newIngredients = selectedIngredients.filter(i => i !== ingredient)
    setSelectedIngredients(newIngredients)
    searchRecipes(newIngredients, filters)
  }

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

  const handleFilterChange = (filterKey: keyof RecipeFilters, value: string | number) => {
    const newFilters = { ...filters, [filterKey]: value }
    setFilters(newFilters)
    searchRecipes(selectedIngredients, newFilters)
  }

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    onOpen()
  }

  // Debounced search term update
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setHighlightedIndex(0)
    
    // Show suggestions if there's a search term
    if (value.trim() !== '') {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
    
    // Clear previous timeout
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout
    searchTimeoutRef.current = window.setTimeout(() => {
      // If search term is empty, show all ingredients
      if (value.trim() === '') {
        return
      }
    }, 300)
  }

  // Handle key press in search input
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // If suggestions are shown, select the highlighted suggestion
      if (showSuggestions && filteredIngredients.length > 0) {
        const selectedIngredient = filteredIngredients[highlightedIndex]
        if (selectedIngredient) {
          handleIngredientClick(selectedIngredient)
          setSearchTerm('')
          setShowSuggestions(false)
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

  // Filter ingredients based on search term
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    return allIngredients
      .filter((ingredient: string) => 
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10) // Limit to 10 suggestions for better performance
  }, [allIngredients, searchTerm])

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
        matchPercentage,
        missingIngredients: missingIngredients.slice(0, 5), // Show only first 5 missing ingredients
        hasMoreMissing: missingIngredients.length > 5
      };
    } catch (error) {
      console.error("Error calculating match info:", error);
      // Return safe default values if calculation fails
      return {
        matchedCount: 0,
        totalSelected: selectedIngredients.length,
        matchPercentage: 0,
        missingIngredients: [],
        hasMoreMissing: false
      };
    }
  };

  // Sort recipes with highest match percentage first
  const sortRecipes = (recipesToSort: Recipe[]) => {
    try {
      return [...recipesToSort].sort((a, b) => {
        // If ingredients are selected, prioritize match percentage
        if (selectedIngredients.length > 0) {
          const matchInfoA = getIngredientMatchInfo(a);
          const matchInfoB = getIngredientMatchInfo(b);
          
          // Calculate complexity score based on number of ingredients
          const complexityScoreA = a.ingredients.length;
          const complexityScoreB = b.ingredients.length;
          
          // Check if basic ingredients are selected
          const basicIngredients = ['egg', 'eggs', 'butter', 'milk', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'olive oil'];
          const hasBasicIngredients = selectedIngredients.some(ingredient => 
            basicIngredients.some(basic => ingredient.toLowerCase().includes(basic))
          );
          
          // Adjust match percentage based on ingredient count and difficulty
          let adjustedMatchA = matchInfoA.matchPercentage;
          let adjustedMatchB = matchInfoB.matchPercentage;
          
          // For basic ingredients or few selections, strongly prefer simpler recipes
          if (hasBasicIngredients || selectedIngredients.length <= 2) {
            // Penalize more ingredients
            adjustedMatchA *= (1 - (complexityScoreA / 15));
            adjustedMatchB *= (1 - (complexityScoreB / 15));
            
            // Further penalize harder recipes
            const difficultyPenaltyA = a.difficulty === 'Hard' ? 0.5 : a.difficulty === 'Medium' ? 0.8 : 1;
            const difficultyPenaltyB = b.difficulty === 'Hard' ? 0.5 : b.difficulty === 'Medium' ? 0.8 : 1;
            
            adjustedMatchA *= difficultyPenaltyA;
            adjustedMatchB *= difficultyPenaltyB;
          } 
          // For more ingredients selected, prefer more complex recipes
          else if (selectedIngredients.length >= 3) {
            // Reward more ingredients
            adjustedMatchA *= (1 + (complexityScoreA / 30));
            adjustedMatchB *= (1 + (complexityScoreB / 30));
          }
          
          // Sort by adjusted match percentage (highest first)
          if (adjustedMatchA !== adjustedMatchB) {
            return adjustedMatchB - adjustedMatchA;
          }
          
          // If adjusted match percentages are equal, sort by number of matched ingredients
          if (matchInfoA.matchedCount !== matchInfoB.matchedCount) {
            return matchInfoB.matchedCount - matchInfoA.matchedCount;
          }
        }
        
        // Default sorting based on user selection
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'cookTime':
            return parseInt(a.cookTime) - parseInt(b.cookTime)
          case 'difficulty':
            const difficultyOrder: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
            return (difficultyOrder[a.difficulty || 'Easy'] || 0) - (difficultyOrder[b.difficulty || 'Easy'] || 0)
          case 'ingredients':
            return a.ingredients.length - b.ingredients.length
          default:
            return 0
        }
      });
    } catch (error) {
      console.error("Error sorting recipes:", error);
      // Return unsorted recipes if sorting fails
      return recipesToSort;
    }
  }

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
    setRecipes(prev => sortRecipes(prev))
  }

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

  // Apply sorting whenever recipes or selectedIngredients change
  useEffect(() => {
    if (recipes.length > 0) {
      try {
        const sortedRecipes = sortRecipes(recipes);
        setRecipes(sortedRecipes);
        // Update displayed recipes with the first page of sorted recipes
        setDisplayedRecipes(sortedRecipes.slice(0, RECIPES_PER_PAGE));
        setHasMore(sortedRecipes.length > RECIPES_PER_PAGE);
        setPage(1);
      } catch (error) {
        console.error("Error sorting recipes:", error);
        // Don't update recipes if sorting fails
      }
    }
  }, [selectedIngredients, sortBy]);

  // Create a memoized sorted recipes array
  const sortedRecipes = useMemo(() => {
    return sortRecipes(recipes);
  }, [recipes, selectedIngredients, sortBy]);

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
              {filteredIngredients.map((ingredient: string, index: number) => (
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
                      <Badge colorScheme="orange" ml="auto">Press Enter</Badge>
                    )}
                  </HStack>
                </ListItem>
              ))}
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
                    <Accordion allowMultiple defaultIndex={[]} allowToggle>
                      {ingredientCategories.map((category, index) => (
                        <AccordionItem key={index} border="none">
                          <AccordionButton 
                            _hover={{ bg: 'orange.50' }}
                            _expanded={{ bg: 'orange.50', color: 'orange.500', fontWeight: 'semibold' }}
                            borderRadius="md"
                            p={3}
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
                          <AccordionPanel pb={4}>
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

            {isLoading && displayedRecipes.length === 0 ? (
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
            ) : displayedRecipes.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, md: 4 }}>
                  {displayedRecipes.map((recipe) => {
                    const matchInfo = getIngredientMatchInfo(recipe);
                    return (
                      <Box
                        key={recipe.id}
                        borderWidth="1px"
                        borderRadius="xl"
                        overflow="hidden"
                        w="100%"
                        pr="0"
                        bg="white"
                        _hover={{ 
                          transform: 'translateY(-4px)',
                          boxShadow: 'lg',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        cursor="pointer"
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        <Box position="relative">
                          <Image 
                            src={recipe.image} 
                            alt={recipe.name} 
                            height="200px" 
                            width="100%"
                            objectFit="cover" 
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
                                  Your Ingredients: {matchInfo.matchedCount}/{matchInfo.totalSelected}
                                </Text>
                                <Badge 
                                  colorScheme={matchInfo.matchPercentage > 70 ? "green" : matchInfo.matchPercentage > 40 ? "yellow" : "red"}
                                  fontSize="xs"
                                >
                                  {matchInfo.matchPercentage}% match
                                </Badge>
                              </Flex>
                              <Progress 
                                value={matchInfo.matchPercentage} 
                                size="sm" 
                                colorScheme={matchInfo.matchPercentage > 70 ? "green" : matchInfo.matchPercentage > 40 ? "yellow" : "red"}
                                mb={2}
                              />
                              
                              {matchInfo.missingIngredients.length > 0 && (
                                <Box mt={2}>
                                  <Text fontSize="xs" color="gray.500" mb={1}>
                                    You'll also need:
                                  </Text>
                                  <Wrap spacing={1}>
                                    {matchInfo.missingIngredients.map((ingredient, index) => (
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
                                    {matchInfo.hasMoreMissing && (
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
                                          +{recipe.ingredients.length - matchInfo.matchedCount - matchInfo.missingIngredients.length} more
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
                    );
                  })}
                </SimpleGrid>
                
                {/* Load More Button */}
                {hasMore && (
                  <Flex justify="center" mt={8}>
                    <Button
                      colorScheme="orange"
                      size="lg"
                      onClick={handleLoadMore}
                      isLoading={isLoading}
                      loadingText="Loading more recipes..."
                      leftIcon={<AddIcon />}
                    >
                      See More Recipes
                    </Button>
                  </Flex>
                )}
              </>
            ) : (
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
                  {selectedIngredients.length === 0 
                    ? "Select some ingredients to see matching recipes"
                    : "Try selecting different ingredients or adjusting the filters"}
                </Text>
              </Box>
            )}
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