import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import RecipeFinder from './components/RecipeFinder'
import AddRecipeForm from './components/AddRecipeForm'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Box minH="100vh" bg="gray.50" w="100%" maxW="100%" overflowX="hidden">
          <Header />
          <Box className="content-container" w="100%" overflowX="hidden" p={4}>
            <Routes>
              <Route path="/" element={<RecipeFinder />} />
              <Route path="/add" element={<AddRecipeForm />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  )
}

export default App
